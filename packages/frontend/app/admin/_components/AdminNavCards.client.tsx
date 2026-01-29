"use client";

import Link from "next/link";
import { motion, easeOut } from "motion/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Layers, Loader2, AlertCircle } from "lucide-react";

import { useClientRole } from "@/hooks/auth/useClientRole";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: easeOut,
        },
    },
};


export function AdminNavCards() {
    const {
        isLoaded,
        canManageCustomers,
        canExportCustomers,
    } = useClientRole();


    // 🔐 SADECE UI'YI KİLİTLİYORUZ
    if (!isLoaded) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Ana Sayfa */}
                <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow h-full">
                        <div className="flex flex-col h-full">
                            <CardHeader className="space-y-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5 text-blue-500" />
                                    Ana Sayfa
                                </CardTitle>
                                <CardDescription>
                                    Müşterilerin gördüğü ana sayfaya git
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 mt-auto">
                                <Button asChild className="w-full">
                                    <Link href="/">Siteye Git</Link>
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div>

                {/* Sektörler */}
                {canManageCustomers ? <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
                    <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow h-full">
                        <div className="flex flex-col h-full">
                            <CardHeader className="space-y-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-green-500" />
                                    Sektör Yönetimi
                                </CardTitle>
                                <CardDescription>
                                    Sektörleri ekle, düzenle veya sil
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 mt-auto">
                                <Button asChild variant="outline" className="w-full border-green-200 hover:bg-green-50 hover:text-green-700">
                                    <Link href="/admin/sectors">Sektörleri Yönet</Link>
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div> : null}

                {/* Üretim Grupları */}
                {canManageCustomers ? <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
                    <Card className="border-l-4  border-l-orange-500 hover:shadow-md transition-shadow h-full">
                        <div className="flex flex-col h-full">
                            <CardHeader className="space-y-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-orange-500" />
                                    Üretim Grupları
                                </CardTitle>
                                <CardDescription>
                                    Sektörlere bağlı üretim gruplarını yönet.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 mt-auto">
                                <Button asChild variant="outline" className="w-full  border-orange-200 hover:bg-orange-50 hover:text-orange-700">
                                    <Link href="/admin/production-groups">Grupları Yönet</Link>
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div> : null}

                {/* Ürünler */}
                {canManageCustomers ? <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
                    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow h-full">
                        <div className="flex flex-col h-full">
                            <CardHeader className="space-y-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-purple-500" />
                                    Endüstriyel Ürün Yönetimi
                                </CardTitle>
                                <CardDescription>
                                    Üretim gruplarına bağlı endüstriyel ürünleri yönet. Ürün görsellerini buradan ekleyebilirsin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 mt-auto">
                                <Button asChild variant="outline" className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                                    <Link href="/admin/products">Ürünleri Yönet</Link>
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div> : null}

                {/* Müşteriler */}
                <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
                    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow h-full">
                        <div className="flex flex-col h-full">
                            <CardHeader className="space-y-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-purple-500" />
                                    Müşteriler
                                </CardTitle>
                                <CardDescription>
                                    Numune talep eden müşterileri yönet.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 mt-auto">
                                <Button asChild variant="outline" className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                                    <Link href="/admin/customers">Müşterileri Yönet</Link>
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div>

                {/* Diğer kartları aynı pattern ile devam ettir */}
            </motion.div>
            {/* Info Alert */}
            {canManageCustomers ? <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-800">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Silme İşlemi Hakkında Önemli Bilgi</h4>
                    <p>
                        Veri bütünlüğünü korumak amacıyla silme işlemleri hiyerarşik bir
                        sıra izlemelidir:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
                        <li>
                            Bir <strong>Sektör</strong> silinmeden önce, o sektöre ait tüm
                            ürünler ve üretim grupları silinmelidir.
                        </li>
                        <li>
                            Bir <strong>Üretim Grubu</strong> silinmeden önce, o gruba ait tüm
                            ürünler silinmelidir.
                        </li>
                    </ul>
                </div>
            </div> : null}
        </>
    );
}
