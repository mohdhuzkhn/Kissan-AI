import React from 'react';
import { Bug, Leaf, DollarSign, Camera, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Language, ScanResult } from '../types';
import { CROPS } from '../constants';
import { cn, formatPkr, formatPkrUr } from '../lib/utils';
import { translations } from '../i18n';

interface AnalyticsTabProps {
  language: Language;
  scans: ScanResult[];
  key?: React.Key;
}

export default function AnalyticsTab({ language, scans }: AnalyticsTabProps) {
  const healthyCount = scans.filter(s => s.healthStatus === 'healthy').length;
  const diseasedCount = scans.filter(s => s.healthStatus === 'diseased').length;
  const totalScans = scans.length;
  const healthRate = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 0;
  const t = translations[language].analytics;
  
  const totalSaved = scans.reduce((acc, scan) => {
    if (scan.healthStatus === 'diseased' && scan.disease) {
      return acc + (scan.disease.financialLossPkr || 0);
    }
    return acc;
  }, 0);

  const diseaseCounts: Record<string, { en: string, ur: string, count: number }> = {};
  scans.forEach(scan => {
    if (scan.healthStatus === 'diseased' && scan.disease) {
      const key = scan.disease.nameEn;
      if (!diseaseCounts[key]) {
        diseaseCounts[key] = { en: key, ur: scan.disease.nameUr, count: 0 };
      }
      diseaseCounts[key].count++;
    }
  });

  const sortedDiseases = Object.values(diseaseCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  const cropDist = scans.reduce((acc, scan) => {
    acc[scan.cropType] = (acc[scan.cropType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cropDistData = Object.entries(cropDist).map(([key, value]) => {
    const crop = CROPS.find(c => c.id === key);
    return {
      name: crop ? (language === 'ur' ? crop.nameUr : crop.nameEn) : key,
      value,
      color: '#1a531b'
    };
  });

  const COLORS = ['#1a531b', '#8d6e63', '#a1887f', '#795548', '#3e2723'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-20 pt-4"
    >
      <div className={cn("px-2", language === 'ur' ? "text-right" : "text-left")}>
        <h2 className={cn("text-4xl font-bold text-gray-900 leading-tight", language === 'ur' && "urdu-text")}>
          {t.title}
        </h2>
        <p className={cn("text-gray-500 text-lg", language === 'ur' && "urdu-text")}>
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnalyticsCard
          icon={<Bug size={24} className="text-red-500" />}
          label={t.commonDisease}
          subLabel={t.commonDiseaseSub}
          value={sortedDiseases[0] ? (language === 'ur' ? sortedDiseases[0].ur : sortedDiseases[0].en) : '--'}
          valueColor="text-red-600"
          language={language}
        />
        <AnalyticsCard
          icon={<Camera size={24} className="text-[#1a531b]" />}
          label={t.totalScans}
          value={totalScans.toString()}
          language={language}
        />
        <AnalyticsCard
          icon={<Leaf size={24} className="text-[#1a531b]" />}
          label={t.cropHealth}
          value={`${healthRate}%`}
          language={language}
        />
        <AnalyticsCard
          icon={<DollarSign size={24} className="text-[#1a531b]" />}
          label={t.moneySaved}
          value={language === 'ur' ? `${(totalSaved / 1000).toFixed(1)}k` : `${(totalSaved / 1000).toFixed(1)}k`}
          prefix="PKR"
          language={language}
        />
      </div>

      {/* Top Diseases Bar Chart */}
      <div className="bg-white rounded-[40px] p-8 card-shadow border border-gray-50">
        <h3 className={cn("text-xl font-bold text-gray-800 mb-8", language === 'ur' && "urdu-text text-right")}>
          {t.topDiseases}
        </h3>
        
        <div className="space-y-6">
          {sortedDiseases.length === 0 ? (
             <p className={cn("text-center text-gray-400 py-4", language === 'ur' && "urdu-text")}>
               {t.noData}
             </p>
          ) : (
            sortedDiseases.map((d, i) => (
              <div key={i} className="space-y-2">
                <div className={cn("flex justify-between items-center text-sm font-bold text-gray-700", language === 'ur' && "flex-row-reverse")}>
                   <span className={cn(language === 'ur' && "urdu-text")}>{language === 'ur' ? d.ur : d.en}</span>
                   <span className="text-xs text-gray-400 font-bold">{Math.round((d.count / totalScans) * 100)}%</span>
                </div>
                <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden relative">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / totalScans) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn("h-full bg-[#1a531b] rounded-full", language === 'ur' && "absolute right-0")}
                   />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Crop Split Donut Chart */}
      <div className="bg-white rounded-[40px] p-8 card-shadow border border-gray-50">
        <h3 className={cn("text-xl font-bold text-gray-800 mb-6", language === 'ur' && "urdu-text text-right")}>
          {t.cropDist}
        </h3>
        
        <div className={cn("flex items-center gap-8", language === 'ur' ? "flex-row" : "flex-row")}>
           <div className="w-1/2 h-32">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropDistData}
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cropDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
           </div>

           <div className="w-1/2 space-y-3">
              {cropDistData.map((d, i) => (
                <div key={i} className={cn("flex items-center gap-3", language === 'ur' ? "flex-row-reverse" : "flex-row")}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className={cn("text-xs font-bold text-gray-600 truncate", language === 'ur' && "urdu-text text-right flex-1")}>
                    {d.name} ({Math.round((d.value / totalScans) * 100)}%)
                  </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsCard({ icon, label, value, subLabel, prefix, valueColor, language }: any) {
  return (
    <div className="bg-white rounded-[32px] p-6 card-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
       <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
          {icon}
       </div>
       <div className="flex flex-col items-center">
          <span className={cn("text-2xl font-black mb-1", valueColor || "text-gray-900")}>
            {prefix && <span className="text-[10px] mr-1">{prefix}</span>}
            {value}
          </span>
          <span className={cn("text-[10px] font-bold text-gray-400 uppercase tracking-tight", language === 'ur' && "urdu-text leading-tight")}>
            {label}
          </span>
          {subLabel && (
            <span className={cn("text-[8px] font-bold text-gray-300 uppercase", language === 'ur' && "urdu-text mt-1")}>{subLabel}</span>
          )}
       </div>
    </div>
  );
}
