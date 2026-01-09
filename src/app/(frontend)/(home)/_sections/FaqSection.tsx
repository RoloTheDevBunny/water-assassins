"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/contexts/i18nContext";
import { PlusIcon } from "@heroicons/react/24/outline";

const FaqSection = () => {
  const { translate } = useI18n();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({
    question: translate(`pages.home.sections.faq.items.${i}.question`),
    answer: translate(`pages.home.sections.faq.items.${i}.answer`),
  }));

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
            {translate('pages.home.sections.faq.title')}
          </h2>
          <p className="mt-4 text-slate-500 font-medium">{translate('pages.home.sections.faq.description')}</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl border transition-all duration-300 ${activeIdx === index ? "border-indigo-200 bg-indigo-50/30" : "border-slate-100 bg-slate-50"
                }`}
            >
              <button
                onClick={() => setActiveIdx(activeIdx === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left outline-none"
              >
                <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeIdx === index ? 45 : 0 }}
                  className="bg-white p-2 rounded-xl shadow-sm border border-slate-100"
                >
                  <PlusIcon className="w-5 h-5 text-indigo-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIdx === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 text-slate-500 font-medium leading-relaxed text-lg border-t border-indigo-100/20 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;