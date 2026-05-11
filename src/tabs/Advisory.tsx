import React from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, TrendingDown, DollarSign, Clock, Beaker, Info, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, ScanResult } from '../types';
import { cn, formatPkr, formatPkrUr } from '../lib/utils';
import { translations } from '../i18n';

interface AdvisoryTabProps {
  language: Language;
  scan: ScanResult | null;
  isAnalyzing?: boolean;
  pendingImage?: string | null;
  onBack: () => void;
  key?: React.Key;
}

export default function AdvisoryTab({ language, scan, isAnalyzing, pendingImage, onBack }: AdvisoryTabProps) {
  const t = translations[language].advisory;
  const tMain = translations[language].analyzer;

  if (isAnalyzing && pendingImage) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-8 space-y-6"
      >
        <div className="relative rounded-3xl overflow-hidden h-72 shadow-xl">
          <img src={pendingImage} alt="Analyzing" className="w-full h-full object-cover grayscale-[0.5]" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4"
            />
            <p className={cn("font-bold text-xl", language === 'ur' && "urdu-text")}>{tMain.analyzing}</p>
            <p className={cn("text-white/70 text-sm", language === 'ur' && "urdu-text")}>{tMain.wait}</p>
          </div>
        </div>
        
        {/* Shimmer placeholders for content */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 space-y-4">
          <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-3/4" />
          <div className="h-4 bg-gray-50 rounded-lg animate-pulse w-full" />
          <div className="h-4 bg-gray-50 rounded-lg animate-pulse w-5/6" />
        </div>
        
        <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 h-32 animate-pulse" />
      </motion.div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#1a531b] border-t-transparent rounded-full mb-6"
        />
        <p className={cn("text-gray-500", language === 'ur' && "urdu-text")}>
          {tMain.analyzing}
        </p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <p className={cn("text-gray-500", language === 'ur' && "urdu-text")}>
          {t.noData}
        </p>
        <button 
          onClick={onBack}
          className="mt-6 px-6 py-2 bg-[#1a531b] text-white rounded-full font-bold"
        >
          {t.openCamera}
        </button>
      </div>
    );
  }

  const { disease, healthStatus, confidence, imageUrl } = scan;
  const isHealthy = healthStatus === 'healthy';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-8 space-y-6"
    >
      {/* Image and Header */}
      <div className="relative rounded-3xl overflow-hidden h-72 shadow-xl bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt="Crop" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Camera size={48} className="mb-2 opacity-20" />
            <span className={cn("text-xs font-bold uppercase tracking-wider", language === 'ur' && "urdu-text")}>
              {t.imageNotAvailable}
            </span>
          </div>
        )}
        <div className={cn(
          "absolute top-4 flex items-center gap-3",
          language === 'ur' ? "left-4" : "right-4"
        )}>
          <div className={cn(
            "px-4 py-1.5 rounded-full text-white font-bold flex items-center gap-2",
            isHealthy ? "bg-green-500" : "bg-[#ef4444]"
          )}>
            {isHealthy ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className={cn(language === 'ur' && "urdu-text")}>
              {isHealthy ? t.healthy : t.diseased}
            </span>
          </div>
        </div>

        <div className={cn(
          "absolute top-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px] shadow-lg",
          language === 'ur' ? "right-4" : "left-4"
        )}>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
              <circle 
                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray={125}
                strokeDashoffset={125 - (125 * confidence) / 100}
                className="text-[#1a531b]" 
              />
            </svg>
            <span className="absolute text-[10px] font-bold">{Math.round(confidence)}%</span>
          </div>
          <span className="text-[8px] font-bold text-gray-500 uppercase mt-1 leading-none text-center">
            {t.confidence}
          </span>
        </div>
      </div>

      {/* Result Info Card */}
      <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100">
        <div className="mb-4">
          <h2 className={cn("text-2xl font-bold text-gray-900 leading-tight", language === 'ur' && "urdu-text")}>
            {isHealthy ? t.isHealthyTitle : (language === 'en' ? disease?.nameEn : disease?.nameUr)}
          </h2>
          {!isHealthy && language === 'en' && (
            <p className="text-lg font-bold text-[#1a531b] urdu-text mt-1">
              {disease?.nameUr}
            </p>
          )}
          {!isHealthy && language === 'ur' && (
            <p className="text-lg font-bold text-gray-500 mt-1">
              {disease?.nameEn}
            </p>
          )}
        </div>
        
        <p className={cn("text-gray-600 leading-relaxed", language === 'ur' && "urdu-text text-right")}>
          {isHealthy 
            ? t.isHealthyDesc
            : (language === 'ur' ? disease?.explanationUr : disease?.explanation)}
        </p>
      </div>

      {!isHealthy && disease && (
        <>
          {/* Recommendation Card */}
          <div className="gradient-bg rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
             
             <div className="mb-4 flex items-center gap-2">
                <span className={cn("text-[10px] font-bold tracking-widest uppercase opacity-80", language === 'ur' && "urdu-text")}>
                  {t.recommendedCure}
                </span>
             </div>
             
             <div className="space-y-1">
                <h3 className={cn("text-xl font-bold", language === 'ur' && "urdu-text urdu-large")}>
                  {language === 'ur' ? disease.pesticideBrandUr : disease.pesticideBrand}
                </h3>
                <h3 className={cn("text-sm font-medium opacity-80", language === 'ur' ? "" : "urdu-text")}>
                  {language === 'ur' ? disease.pesticideBrand : disease.pesticideBrandUr}
                </h3>
             </div>
             
             <div className={cn(
               "absolute bottom-6 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center",
               language === 'ur' ? "left-6" : "right-6"
             )}>
                <Plus size={32} className="text-white" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoBox 
              icon={<Beaker className="text-[#1a531b]" />}
              label={t.mixingRatio}
              value={language === 'ur' ? disease.mixingRatioUr : disease.mixingRatio}
              language={language}
            />
            <InfoBox 
              icon={<DollarSign className="text-[#1a531b]" />}
              label={t.priceEstimate}
              value={language === 'ur' ? formatPkrUr(disease.pricePkr) : formatPkr(disease.pricePkr)}
              language={language}
            />
          </div>

          {/* Risk Card */}
          <div className="bg-[#fff1f2] rounded-3xl p-6 border border-[#fecdd3]">
             <div className={cn("flex justify-between items-start mb-4", language === 'ur' && "flex-row-reverse")}>
                <div className={cn(language === 'ur' && "text-right")}>
                   <h4 className={cn("text-[#9f1239] font-bold", language === 'ur' && "urdu-text")}>{t.yieldLossRisk}</h4>
                </div>
                <div className="px-3 py-1 bg-[#e11d48] text-white rounded-lg text-[10px] font-bold uppercase shrink-0">
                  {t.highRisk}
                </div>
             </div>
             
             <div className={cn("flex justify-between items-end mb-2", language === 'ur' && "flex-row-reverse")}>
                <span className={cn("text-sm font-bold text-[#e11d48]", language === 'ur' && "urdu-text")}>{t.projectedLoss}</span>
                <span className="text-sm font-bold text-[#e11d48]">{disease.yieldLossPercent}</span>
             </div>
             
             <div className="w-full h-3 bg-[#fecdd3] rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#e11d48] rounded-full"
                />
             </div>
             
             <div className={cn("border-t border-[#fecdd3] pt-4", language === 'ur' && "text-right")}>
                <span className={cn("text-[10px] font-bold text-[#9f1239] uppercase tracking-wider block mb-1", language === 'ur' && "urdu-text")}>
                  {t.financialImpact}
                </span>
                <div className="text-lg font-bold text-[#e11d48]">
                   {language === 'ur' ? formatPkrUr(disease.financialLossPkr) : formatPkr(disease.financialLossPkr)} / {t.perAcre}
                </div>
             </div>
          </div>

          {/* Warning Signs */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100">
             <div className={cn("flex items-center gap-3 mb-6", language === 'ur' && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                   <Info size={24} />
                </div>
                <h3 className={cn("text-lg font-bold text-gray-800", language === 'ur' && "urdu-text")}>
                   {t.earlyWarning}
                </h3>
             </div>
             
             <div className="space-y-4">
                {(language === 'ur' ? disease.warningSignsUr : disease.warningSigns).map((sign, idx) => (
                  <div key={idx} className={cn("flex gap-4 items-start", language === 'ur' && "flex-row-reverse")}>
                    <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#1a531b] font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-bold text-gray-800", language === 'ur' && "urdu-text text-right")}>{sign}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function Plus({ size, className }: { size: number, className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function InfoBox({ icon, label, value, language }: { icon: React.ReactNode, label: string, value: string, language: Language }) {
  return (
    <div className="bg-white rounded-3xl p-5 card-shadow border border-gray-100 flex flex-col gap-2">
      <div className={cn("flex items-center gap-2", language === 'ur' && "flex-row-reverse")}>
        <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className={cn("flex flex-col", language === 'ur' && "items-end")}>
          <span className={cn("text-[10px] font-bold text-gray-400 uppercase tracking-tight", language === 'ur' && "urdu-text")}>{label}</span>
        </div>
      </div>
      <div className={cn("mt-2", language === 'ur' && "text-right")}>
        <p className={cn("text-sm font-bold text-gray-800", language === 'ur' && "urdu-text")}>{value}</p>
      </div>
    </div>
  );
}
