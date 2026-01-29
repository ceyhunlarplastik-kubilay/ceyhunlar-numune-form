"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import { AsYouType } from "libphonenumber-js/max";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Utils */
/* ------------------------------------------------------------------ */

function trimToMaxLength(
  value: string,
  country?: RPNInput.Country
): string {
  // country bazlı net sınırlar
  const maxNationalLength =
    country === "TR" ? 10 : 15;

  const formatter = new AsYouType(country);
  formatter.input(value);

  const phone = formatter.getNumber();
  if (!phone) return value;

  const national = phone.nationalNumber;
  if (national.length <= maxNationalLength) {
    return value;
  }

  // fazla girilen karakter kadar kes
  const overflow = national.length - maxNationalLength;
  return value.slice(0, value.length - overflow);
}

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value | undefined) => void;
  };

/* ------------------------------------------------------------------ */
/* Stable Input (FOCUS KAYBI YOK) */
/* ------------------------------------------------------------------ */

const StableInputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    {...props}
    ref={ref}
    className={cn(
      "rounded-e-lg rounded-s-none flex-1 w-full",
      className
    )}
  />
));

StableInputComponent.displayName = "StableInputComponent";

/* ------------------------------------------------------------------ */
/* PhoneInput */
/* ------------------------------------------------------------------ */

export const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, defaultCountry, ...props }, ref) => {
  return (
    <div className="w-full">
      <RPNInput.default
        ref={ref}
        className={cn("flex w-full gap-0", className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={StableInputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(val) => {
          if (!val) {
            onChange?.(undefined);
            return;
          }

          const trimmed = trimToMaxLength(
            val,
            defaultCountry
          );

          onChange?.(trimmed as RPNInput.Value);
        }}
        defaultCountry={defaultCountry}
        {...props}
      />
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";

/* ------------------------------------------------------------------ */
/* Country Select */
/* ------------------------------------------------------------------ */

type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options,
  onChange,
}: CountrySelectProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter(
      (o) =>
        o.value &&
        (o.label.toLowerCase().includes(s) ||
          o.value.toLowerCase().includes(s) ||
          RPNInput.getCountryCallingCode(o.value).includes(s))
    );
  }, [options, search]);

  return (
    <Popover open={open} modal onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="flex items-center gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 min-w-18"
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown className="-mr-2 size-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Ülke ara..."
            value={search}
            onValueChange={(v) => {
              setSearch(v);
              setTimeout(() => {
                const el =
                  scrollRef.current?.querySelector(
                    "[data-radix-scroll-area-viewport]"
                  ) as HTMLDivElement | null;
                if (el) el.scrollTop = 0;
              }, 0);
            }}
          />
          <CommandList>
            <ScrollArea ref={scrollRef} className="h-72">
              <CommandEmpty>Ülke bulunamadı</CommandEmpty>
              <CommandGroup>
                {filtered.map(
                  ({ value, label }) =>
                    value && (
                      <CountrySelectOption
                        key={value}
                        country={value}
                        countryName={label}
                        selectedCountry={selectedCountry}
                        onChange={onChange}
                        onSelectComplete={() => setOpen(false)}
                      />
                    )
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ------------------------------------------------------------------ */
/* Country Option */
/* ------------------------------------------------------------------ */

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const selected = country === selectedCountry;

  return (
    <CommandItem
      className={cn("gap-2", selected && "bg-accent")}
      onSelect={() => {
        onChange(country);
        onSelectComplete();
      }}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">
        +{RPNInput.getCountryCallingCode(country)}
      </span>
      <CheckIcon
        className={cn(
          "ml-auto size-4",
          selected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

/* ------------------------------------------------------------------ */
/* Flag */
/* ------------------------------------------------------------------ */

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 items-center justify-center overflow-hidden rounded-sm bg-foreground/10">
      {Flag ? <Flag title={countryName} /> : <span>🌐</span>}
    </span>
  );
};
