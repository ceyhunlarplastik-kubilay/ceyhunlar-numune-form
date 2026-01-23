"use client";

import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Info } from "lucide-react";

export function CustomProductFormSection({ form }: { form: any }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "customProducts",
    });

    const error = form.formState.errors?.customProducts;

    return (
        <div className="space-y-6">
            {/* INFO BOX */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 text-sm text-blue-900">
                <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                        <Info className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="space-y-3">
                        <p className="font-semibold leading-relaxed">
                            Size daha doğru ve hızlı hizmet verebilmemiz için, ilgilendiğiniz
                            <span className="font-medium"> üretim grubu</span> ve
                            <span className="font-medium"> ürün</span> bilgisini aşağıda
                            belirtmenizi rica ederiz.
                        </p>

                        <p className="text-blue-800 leading-relaxed">
                            Seçtiğiniz ürün sistemimizde tanımlı olmadığı için,
                            talebinizi kendi ifadenizle oluşturabilirsiniz.
                            <br />
                            Lütfen aşağıdaki alanları doldurarak devam ediniz.
                        </p>

                        {/* EXAMPLE */}
                        <div className="rounded-md bg-white/70 border border-blue-200 p-3 text-blue-900">
                            <p className="text-xs font-semibold mb-1 text-blue-700">
                                Örnek Kullanım
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Üretim Grubu:</span> Kamp Mobilyası
                                <br />
                                <span className="font-medium">Ürün:</span> Katlanır Kamp Sandalyesi
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {error?.message && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error.message}
                </div>
            )}


            {/* EMPTY STATE */}
            {fields.length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Henüz özel bir ürün eklenmedi.
                    <br />
                    Aşağıdaki butonu kullanarak ürün ekleyebilirsiniz.
                </div>
            )}

            {/* FIELDS */}
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border rounded-lg p-4"
                >
                    <div>
                        <label className="text-sm font-medium">
                            Üretim Grubu <span className="text-red-500">*</span>
                        </label>
                        <Input
                            {...form.register(
                                `customProducts.${index}.productionGroupName`
                            )}
                            placeholder="Kamp Mobilyası"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Ürün <span className="text-red-500">*</span>
                        </label>
                        <Input
                            {...form.register(`customProducts.${index}.productName`)}
                            placeholder="Katlanır Kamp Sandalyesi"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Kaldır
                        </Button>
                    </div>
                </div>
            ))}

            {/* ADD BUTTON */}
            <Button
                type="button"
                variant="outline"
                onClick={() =>
                    append({ productionGroupName: "", productName: "" })
                }
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ürün Ekle
            </Button>
        </div>
    );
}
