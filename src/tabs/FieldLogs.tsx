import React from 'react';
import { TrendingUp, Filter, Search, Calendar, Tractor as TractorIcon, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Language, ScanResult } from '../types';
import { CROPS } from '../constants';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { translations } from '../i18n';

interface FieldLogsTabProps {
  language: Language;
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  key?: React.Key;
}

const mockChartData = [
  { name: 'Week 4', healthy: 12, diseased: 24 },
  { name: 'Week 3', healthy: 28, diseased: 15 },
  { name: 'Week 2', healthy: 22, diseased: 18 },
  { name: 'Week 1', healthy: 30, diseased: 12 },
];

export default function FieldLogsTab({ language, scans, onSelectScan }: FieldLogsTabProps) {
  const healthyCount = scans.filter(s => s.healthStatus === 'healthy').length;
  const diseasedCount = scans.filter(s => s.healthStatus === 'diseased').length;
  const totalScans = scans.length;
  const t = translations[language].fieldLogs;

  return (
    <motion.div 
      initial={{ opacity: 0, x: language === 'ur' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 pb-20"
    >
      {/* Page Header */}
      <div className={cn("pt-4 px-2", language === 'ur' ? "text-right" : "text-left")}>
        <h2 className={cn("text-4xl font-bold text-gray-900 leading-tight", language === 'ur' && "urdu-text")}>
          {t.title}
        </h2>
        <p className={cn("text-gray-500 text-lg", language === 'ur' && "urdu-text")}>
          {t.subtitle}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard 
          value={healthyCount} 
          label={t.healthy} 
          color="text-green-600" 
          bgColor="border-b-4 border-green-500"
          urdu={language === 'ur'}
        />
        <SummaryCard 
          value={diseasedCount} 
          label={t.diseased} 
          color="text-red-500" 
          bgColor="border-b-4 border-red-500"
          urdu={language === 'ur'}
        />
        <SummaryCard 
          value={totalScans} 
          label={t.totalScans} 
          color="text-gray-800" 
          bgColor="border-b-4 border-gray-400"
          urdu={language === 'ur'}
        />
      </div>

      {/* Analytics Graph */}
      <div className="bg-white rounded-[40px] p-8 card-shadow border border-gray-50">
        <div className={cn("flex justify-between items-center mb-10", language === 'ur' && "flex-row-reverse")}>
          <h3 className={cn("text-xl font-bold text-gray-800", language === 'ur' && "urdu-text")}>
            {t.weeklyTrend}
          </h3>
          <div className={cn("flex gap-4", language === 'ur' && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-2", language === 'ur' && "flex-row-reverse")}>
              <span className={cn("text-sm font-bold text-gray-400", language === 'ur' && "urdu-text")}>{t.diseased}</span>
              <div className="w-3 h-3 rounded-full bg-red-600" />
            </div>
            <div className={cn("flex items-center gap-2", language === 'ur' && "flex-row-reverse")}>
              <span className={cn("text-sm font-bold text-gray-400", language === 'ur' && "urdu-text")}>{t.healthy}</span>
              <div className="w-3 h-3 rounded-full bg-[#1a531b]" />
            </div>
          </div>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="diseased" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="healthy" 
                stroke="#1a531b" 
                strokeWidth={4} 
                dot={{ r: 5, fill: '#1a531b', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between mt-4 px-2">
          {mockChartData.map((d, i) => (
             <span key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.name}</span>
          ))}
        </div>
      </div>

      {/* Recent Scans List */}
      <div className="space-y-4 px-1">
        <div className={cn("flex justify-between items-center", language === 'ur' && "flex-row-reverse")}>
          <h3 className={cn("text-xl font-bold text-gray-900", language === 'ur' && "urdu-text")}>
            {t.recentScans}
          </h3>
          <button className={cn("text-[10px] font-bold text-[#1a531b] tracking-widest uppercase flex items-center gap-1", language === 'ur' && "flex-row-reverse")}>
            {t.filter} <Filter size={14} />
          </button>
        </div>
        
        <div className="space-y-3">
          {scans.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
               <Search className="mx-auto text-gray-300 mb-2" size={32} />
               <p className={cn("text-sm text-gray-400", language === 'ur' && "urdu-text")}>
                 {t.noRecords}
               </p>
            </div>
          ) : (
            scans.map((scan) => (
              <ScanItem key={scan.id} scan={scan} language={language} onClick={() => onSelectScan(scan)} />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ value, label, color, bgColor, urdu }: { value: number, label: string, color: string, bgColor: string, urdu: boolean }) {
  return (
    <div className={cn("bg-white rounded-3xl p-6 flex flex-col items-center justify-center card-shadow", bgColor)}>
      <span className={cn("text-4xl font-bold mb-1", color)}>{value}</span>
      <span className={cn("text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center leading-tight", urdu && "urdu-text underline decoration-2 underline-offset-4")}>
        {label}
      </span>
    </div>
  );
}

function ScanItem({ scan, language, onClick }: { scan: ScanResult, language: Language, onClick: () => void, key?: React.Key }) {
  const crop = CROPS.find(c => c.id === scan.cropType);
  const isHealthy = scan.healthStatus === 'healthy';
  const t = translations[language].advisory;

  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full bg-white rounded-[32px] p-5 flex items-center justify-between card-shadow border border-gray-50 transition-transform active:scale-[0.98]",
        language === 'ur' && "flex-row-reverse"
      )}
    >
      <div className={cn("flex items-center gap-4", language === 'ur' && "flex-row-reverse")}>
         <div className={cn("w-2.5 h-2.5 rounded-full", isHealthy ? "bg-green-600" : "bg-red-500")} />
         <div className={cn("flex flex-col items-start leading-tight", language === 'ur' && "items-end")}>
            <h4 className={cn("text-xl font-bold text-gray-800", language === 'ur' && "urdu-text")}>
              {isHealthy ? t.healthy : (language === 'en' ? scan.disease?.nameEn : scan.disease?.nameUr)}
            </h4>
            <div className={cn("flex items-center gap-2 mt-1", language === 'ur' && "flex-row-reverse")}>
               <span className={cn("text-xs text-gray-400 font-bold", language === 'ur' && "urdu-text")}>
                 {language === 'ur' ? crop?.nameUr : crop?.nameEn}
                </span>
            </div>
         </div>
      </div>
      
      <div className={cn("flex items-center gap-4", language === 'ur' && "flex-row-reverse")}>
         <div className={cn("flex flex-col items-end leading-none", language === 'ur' && "items-start")}>
            <span className="text-[10px] font-bold text-gray-400 opacity-80 mb-1">{format(new Date(scan.date), 'MMM dd, yyyy')}</span>
            <div className={cn("flex items-center gap-1 text-[10px] font-bold text-[#1a531b] opacity-80", language === 'ur' && "flex-row-reverse")}>
               <TractorIcon size={12} /> <span className={cn(language === 'ur' && "urdu-text")}>{language === 'ur' ? crop?.nameUr : crop?.nameEn}</span>
            </div>
         </div>
         <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center text-gray-300">
            {scan.imageUrl ? (
              <img src={scan.imageUrl} alt="Scan" className="w-full h-full object-cover" />
            ) : (
              <Camera size={24} className="opacity-20" />
            )}
         </div>
      </div>
    </button>
  );
}
