"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { FormSectionHeader } from "@/components/form3/form-section/FormSectionHeader";
import { PhoneInput } from "@/components/form3/form-section/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProvinces } from "@/hooks/useProvinces";
import { useDistricts } from "@/hooks/useDistricts";

import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

// İyileştirilmiş telefon validasyonu
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Telefon numarası zorunludur.")
  .refine(
    (value) => {
      // Boş değer kontrolü
      if (!value || value.length === 0) return false;

      try {
        const phone = parsePhoneNumberFromString(value, {
          defaultCountry: "TR",
          extract: false,
        });

        if (!phone) return false;

        // Geçerli ve olası bir numara mı?
        return phone.isValid() && phone.isPossible();
      } catch (error) {
        return false;
      }
    },
    {
      message: "Lütfen geçerli bir telefon numarası giriniz.",
    }
  )
  .refine(
    (value) => {
      try {
        const phone = parsePhoneNumberFromString(value);
        if (!phone) return true; // Önceki refine yakalayacak

        // Türkiye numaraları için ek kontrol
        if (phone.country === "TR") {
          // TR numaraları 10 haneli olmalı (başındaki 0 hariç)
          const nationalNumber = phone.nationalNumber;
          return nationalNumber.length === 10;
        }

        return true;
      } catch (error) {
        return true;
      }
    },
    {
      message: "Türkiye için 10 haneli bir numara girmelisiniz.",
    }
  );

export const ContactFormSection = ({ form }: { form: any }) => {
  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const selectedProvince = form.watch("il");
  const { data: districts = [], isLoading: loadingDistricts } =
    useDistricts(selectedProvince);

  return (
    <div className="space-y-6">
      <FormSectionHeader
        title="İletişim Bilgileri"
        description="Size ulaşabilmemiz için lütfen iletişim bilgilerinizi eksiksiz doldurunuz."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Firma Adı */}
        <Controller
          name="firmaAdi"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1">
              <FieldLabel>Firma Adı</FieldLabel>
              <Input {...field} placeholder="Firma Adı" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Ad */}
        <Controller
          name="ad"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1">
              <FieldLabel>Ad</FieldLabel>
              <Input {...field} placeholder="Adınız" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Soyad */}
        <Controller
          name="soyad"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1">
              <FieldLabel>Soyad</FieldLabel>
              <Input {...field} placeholder="Soyadınız" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1">
              <FieldLabel>E-posta</FieldLabel>
              <Input {...field} type="email" placeholder="ornek@sirket.com" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Telefon */}
        <Controller
          name="telefon"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field 
              data-invalid={fieldState.invalid} 
              className="space-y-1"
            >
              <FieldLabel>Telefon</FieldLabel>

              <PhoneInput
                value={field.value || ""}
                onChange={(value) => {
                  // Değer değiştiğinde form'u touch et
                  field.onChange(value ?? "");
                  field.onBlur();
                }}
                onBlur={field.onBlur}
                defaultCountry="TR"
                international
                countryCallingCodeEditable={false}
                placeholder="5XX XXX XX XX"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          {/* İl */}
          <Controller
            name="il"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1">
                <FieldLabel>İl</FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("ilce", ""); // il değişince ilçe sıfırlanır
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="İl seçiniz" />
                  </SelectTrigger>

                  <SelectContent>
                    {loadingProvinces && (
                      <SelectItem value="loading" disabled>
                        Yükleniyor...
                      </SelectItem>
                    )}

                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* İlçe */}
          <Controller
            name="ilce"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1">
                <FieldLabel>İlçe</FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedProvince ? "İlçe seçiniz" : "Önce il seçiniz"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {loadingDistricts && (
                      <SelectItem value="loading" disabled>
                        Yükleniyor...
                      </SelectItem>
                    )}

                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      {/* Adres */}
      <Controller
        name="adres"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1">
            <FieldLabel>Adres</FieldLabel>
            <Textarea
              {...field}
              placeholder="Şirket adresiniz..."
              className="min-h-25"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};
