'use client';

import { motion } from "framer-motion";
import { BanknotesIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/contexts/i18nContext";

export default function FeaturesSection() {
  const { translate } = useI18n();

  const features = [
    {
      title: translate('pages.home.sections.features.bounties.title'),
      description: translate('pages.home.sections.features.bounties.description'),
      icon: <BanknotesIcon className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: translate('pages.home.sections.features.prize.title'),
      description: translate('pages.home.sections.features.prize.description'),
      icon: <TrophyIcon className="h-8 w-8 text-indigo-600" />,
    },
  ];

  return (
    <section id="payouts" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
            {translate('pages.home.sections.features.title')}
          </h2>
          <p className="mt-4 text-slate-500 text-lg font-medium">
            Transparent prize pools for the top competitors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="flex flex-col p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-default"
            >
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}