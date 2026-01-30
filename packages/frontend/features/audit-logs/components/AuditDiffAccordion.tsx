"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

function JsonBlock({
    title,
    value,
}: {
    title: string;
    value: any;
}) {
    if (!value) return null;

    return (
        <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">
                {title}
            </div>
            <pre className="max-h-60 overflow-auto rounded-md bg-muted p-2 text-xs">
                {JSON.stringify(value, null, 2)}
            </pre>
        </div>
    );
}

export function AuditDiffAccordion({
    before,
    after,
    changes,
    id,
}: {
    id: string;
    before?: any;
    after?: any;
    changes?: any;
}) {
    if (!before && !after && !changes) {
        return <span className="text-xs text-muted-foreground">—</span>;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={id} className="border-none">
                <AccordionTrigger className="text-xs py-1">
                    Detayları Göster
                </AccordionTrigger>

                <AccordionContent className="space-y-3 pt-2">
                    {changes && (
                        <JsonBlock title="Değişiklikler (changes)" value={changes} />
                    )}

                    {!changes && (
                        <>
                            <JsonBlock title="Before" value={before} />
                            <JsonBlock title="After" value={after} />
                        </>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
