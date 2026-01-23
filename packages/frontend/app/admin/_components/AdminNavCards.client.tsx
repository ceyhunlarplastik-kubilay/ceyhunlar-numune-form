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
import {
    Home,
    Layers,
    LayoutDashboard,
    Package,
} from "lucide-react";

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
    return (
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
            <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
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
            </motion.div>

            {/* Üretim Grupları */}
            <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
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
            </motion.div>

            {/* Ürünler */}
            <motion.div variants={cardVariants} whileHover={{ scale: 1.015 }}>
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
            </motion.div>

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
    );
}
