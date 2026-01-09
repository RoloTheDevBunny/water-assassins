"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/contexts/i18nContext";

export default function HowItWorksSection() {
    const { translate } = useI18n();

    const steps = [
        { id: 1, title: "pages.home.sections.how.options.first.title", desc: "pages.home.sections.how.options.first.description" },
        { id: 2, title: "pages.home.sections.how.options.second.title", desc: "pages.home.sections.how.options.second.description" },
        { id: 3, title: "pages.home.sections.how.options.third.title", desc: "pages.home.sections.how.options.third.description" }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }} // Makes it "pop" on hover
                            className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-2xl text-2xl font-black mb-8 shadow-lg shadow-indigo-100">
                                {step.id}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{translate(step.title)}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{translate(step.desc)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}