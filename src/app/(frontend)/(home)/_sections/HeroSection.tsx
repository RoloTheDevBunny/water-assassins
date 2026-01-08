"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { GetMeBridge } from "@/bridges/getMe";
import { useI18n } from "@/contexts/i18nContext";
import Spinner from "@/components/v1/Spinner"; // Adjusted path to your Spinner component

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
        <div className="py-12 md:py-28 max-w-7xl mx-auto px-2 sm:px-16 lg:px-28">
            <div className="flex flex-col md:flex-row items-center md:items-center">
                <div className="text-center lg:text-left lg:w-2/3">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
                        {translate("pages.home.sections.hero.title")}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600">
                        {translate("pages.home.sections.hero.description")}
                    </p>

                    {/* Button Area with fixed height to prevent layout shift */}
                    <div className="mt-6 flex items-center justify-center lg:justify-start h-[52px]">
                        {isLoading ? (
                            <div className="w-64 flex justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <a
                                href={isLogged ? "/dashboard" : "/register"}
                                className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 w-64 text-center font-semibold transition-colors shadow-md"
                            >
                                {isLogged
                                    ? translate("components.navbar.dashboard")
                                    : translate("components.navbar.try")}
                            </a>
                        )}
                    </div>
                </div>

                <div className="lg:ml-auto lg:w-1/3 mt-12 md:mt-0">
                    <Image
                        src="/svgs/home.svg"
                        alt="AHS Water Assassins Illustration"
                        className="rounded-lg"
                        layout="intrinsic"
                        width={400}
                        height={0}
                        priority // Added priority to the hero image for better LCP
                    />
                </div>
            </div>
        </div>
    );
}