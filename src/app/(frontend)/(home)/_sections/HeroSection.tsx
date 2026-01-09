"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { GetMeBridge } from "@/bridges/getMe";
import { useI18n } from "@/contexts/i18nContext";
import Spinner from "@/components/v1/Spinner";

export default function HeroSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const { translate } = useI18n();

    useEffect(() => {
        const getUserSession = async () => {
            const getMeBridge = new GetMeBridge();
            const response = await getMeBridge.execute();
            setIsLogged(!!response.id);
            setIsLoading(false);
        };
        getUserSession();
    }, []);

    return (
        <section className="relative pt-20 pb-20 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center"
                >
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 mb-8 uppercase tracking-widest shadow-sm">
                        Registration Open
                    </span>

                    <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-slate-900 max-w-5xl mb-6">
                        {translate("pages.home.sections.hero.title")}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10">
                        {translate("pages.home.sections.hero.description")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 h-[64px]">
                        {isLoading ? <Spinner /> : (
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={isLogged ? "/dashboard" : "/register"}
                                className="inline-flex items-center justify-center bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200"
                            >
                                {isLogged ? translate("components.navbar.dashboard") : translate("components.navbar.try")}
                            </motion.a>
                        )}
                    </div>

                    {/* FIXED IMAGE CONTAINER: object-contain ensures no parts are cut off */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-20 w-full max-w-5xl aspect-[16/9] relative bg-slate-50 rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-inner"
                    >
                        <Image
                            src="/svgs/home.svg"
                            alt="Hero Illustration"
                            fill
                            className="object-contain p-4 md:p-8" // object-contain prevents the cutoff
                            priority
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}