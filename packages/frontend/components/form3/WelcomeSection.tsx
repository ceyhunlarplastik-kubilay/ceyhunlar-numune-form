"use client";

import Image from "next/image";
import { motion } from "motion/react";

export const WelcomeSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center space-y-4 py-6 md:py-8"
    >
      {/* Logo ve Başlık Grubu */}
      <div className="text-center mb-6 md:mb-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4 md:mb-5"
        >
          <div
            className="relative w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto"
            style={{ aspectRatio: "1470/341" }}
          >
            <Image
              src="/ceyhunlar.png"
              alt="Ceyhunlar Plastik Logo"
              fill
              className="object-contain"
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </motion.div>

        {/* Ana Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          className="text-xl md:text-2xl lg:text-2xl font-bold text-zinc-800 dark:text-white mb-1"
        >
          CEYHUNLAR PLASTİK SANAYİ VE TİCARET LİMİTED ŞİRKETİ
        </motion.h1>

        {/* Alt Başlık */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center justify-center space-x-2 mb-2 md:mb-3"
        >
          <div className="w-8 md:w-10 h-px bg-brand/50" />
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-brand dark:text-brand">
            Numune Talep Formu
          </h2>
          <div className="w-8 md:w-10 h-px bg-brand/50" />
        </motion.div>
      </div>

      {/* Açıklama Metni */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.45, ease: "easeOut" }}
        className="max-w-full text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed md:leading-7 text-center px-2 md:px-0"
      >
        <p>
          Ceyhunlar Plastik olarak geliştirdiğimiz bu platform ile sektörünüze özel
          ürünlere tek noktadan ulaşmanızı, ihtiyaçlarınıza en uygun çözümleri
          detaylı şekilde incelemenizi ve numune taleplerinizi pratik bir şekilde
          oluşturmanızı hedefliyoruz.
        </p>

        <p className="mt-4">
          Amacımız; karar süreçlerinizi hızlandıran, güvenilir ve kullanıcı odaklı
          bir deneyim sunmaktır.
        </p>
      </motion.div>
    </motion.div>
  );
};
