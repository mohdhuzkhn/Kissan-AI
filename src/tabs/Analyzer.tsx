import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Info, WifiOff, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CropType, Language, ScanResult, DiseaseInfo } from '../types';
import { CROPS, OFFLINE_DISEASES } from '../constants';
import { cn } from '../lib/utils';
import { analyzeCropImage } from '../services/geminiService';
import { translations } from '../i18n';

interface AnalyzerTabProps {
  language: Language;
  onResult: (result: ScanResult) => void;
  onStartAnalysis: (fileBase64: string, crop: CropType) => void;
  key?: React.Key;
}

const SYMPTOMS = [
  { id: 'yellow_leaves', icon: '🍂' },
  { id: 'brown_spots', icon: '🟤' },
  { id: 'white_powder', icon: '❄️' },
  { id: 'wilting', icon: '🥀' },
  { id: 'black_spots', icon: '⚫' },
  { id: 'holes', icon: '🕳️' },
];

export default function AnalyzerTab({ language, onResult, onStartAnalysis }: AnalyzerTabProps) {
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].analyzer;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleTrigger = () => {
      if (selectedCrop) {
        if (isOnline) {
          fileInputRef.current?.click();
        }
      } else {
        alert(t.selectCropFirst);
      }
    };
    window.addEventListener('trigger-camera', handleTrigger);
    return () => window.removeEventListener('trigger-camera', handleTrigger);
  }, [selectedCrop, language, t.selectCropFirst, isOnline]);

  const handleSymptomSelect = (symptomId: string) => {
    if (!selectedCrop) return;

    const cropDiseasesObj = OFFLINE_DISEASES[selectedCrop];
    if (!cropDiseasesObj) return;

    const cropDiseases = Object.values(cropDiseasesObj) as DiseaseInfo[];
    if (cropDiseases.length === 0) return;

    // Simple keyword-based symptom matching
    let matchedDisease: DiseaseInfo | undefined;

    const keywordMap: Record<string, string[]> = {
      yellow_leaves: ['rust', 'yellow', 'mottling', 'leaf curl', 'yellowing'],
      brown_spots: ['spot', 'lesion', 'blight', 'brown'],
      white_powder: ['mildew', 'powder', 'white'],
      wilting: ['wilt', 'wilting', 'stunting', 'stunted'],
      black_spots: ['black', 'smut', 'scurf', 'dark'],
      holes: ['damage', 'insect', 'thrips'],
    };

    const keywords = keywordMap[symptomId] || [];
    
    // Find disease containing any keyword in name or explanation
    matchedDisease = cropDiseases.find((d: DiseaseInfo) => 
      keywords.some(k => 
        d.nameEn.toLowerCase().includes(k) || 
        d.explanation.toLowerCase().includes(k)
      )
    );

    // Fallback to first disease if no match
    if (!matchedDisease && cropDiseases.length > 0) {
      matchedDisease = cropDiseases[0];
    }

    if (matchedDisease) {
      const scanResult: ScanResult = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        cropType: selectedCrop,
        healthStatus: 'diseased',
        disease: matchedDisease,
        confidence: 85,
        imageUrl: '', // Offline mode doesn't have an image
      };
      onResult(scanResult);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCrop) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onStartAnalysis(base64, selectedCrop);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero Banner Item or Offline Header */}
      <AnimatePresence mode="wait">
        {isOnline ? (
          <motion.button 
            key="online-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => {
              if (selectedCrop) {
                fileInputRef.current?.click();
              } else {
                alert(t.selectCropFirst);
              }
            }}
            className={cn(
              "w-full gradient-bg rounded-3xl p-8 flex flex-col items-center justify-center text-white relative overflow-hidden h-64 shadow-xl",
              language === 'ur' ? "text-right" : "text-left"
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            
            <Camera size={48} className="mb-4 opacity-80" />
            <h2 className={cn("text-3xl font-bold text-center leading-tight", language === 'ur' && "urdu-text urdu-large")}>
              {t.title}
            </h2>
            <p className={cn("text-white/80 text-center mt-2 px-4", language === 'ur' && "urdu-text")}>
              {t.subtitle}
            </p>
          </motion.button>
        ) : (
          <motion.div 
            key="offline-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full bg-red-50 text-red-700 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-64 border border-red-100 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <WifiOff size={32} className="text-red-500" />
            </div>
            <h2 className={cn("text-3xl font-bold text-center mb-1", language === 'ur' && "urdu-text urdu-large")}>
              {t.noInternet}
            </h2>
            <p className={cn("text-red-600/70 text-center text-sm px-4", language === 'ur' && "urdu-text")}>
              {t.offlineDesc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips Section (Only if online) */}
      {isOnline && (
        <div className="bg-[#fff9e6] rounded-2xl p-5 border border-[#ffeeba] flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 flex items-center justify-center text-[#d97706] shrink-0">
            <Info size={24} />
          </div>
          <p className={cn("text-[#92400e] text-sm leading-relaxed font-medium", language === 'ur' && "urdu-text text-right flex-1")}>
            {t.tip}
          </p>
        </div>
      )}

      {/* Crop Selection */}
      <div className="space-y-4">
        <h3 className={cn("text-xl font-bold text-gray-800", language === 'ur' && "urdu-text text-right")}>
          {t.selectCrop}
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {CROPS.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200",
                selectedCrop === crop.id 
                  ? "bg-[#1a531b] border-[#1a531b] text-white shadow-md scale-105" 
                  : "bg-white border-gray-100 text-gray-700 hover:border-[#1a531b]/30"
              )}
            >
              <span className="text-2xl mb-1">{crop.icon}</span>
              <span className={cn("text-xs font-bold", language === 'ur' && "urdu-text mb-0.5")}>
                {language === 'ur' ? crop.nameUr : crop.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Button or Symptom Checker */}
      <div className="pt-4 pb-8">
        <AnimatePresence mode="wait">
          {isOnline ? (
            <motion.button 
              key="upload-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedCrop}
              className={cn(
                "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed",
                "gradient-bg text-white"
              )}
            >
              <Camera size={24} />
              <span className={cn(language === 'ur' && "urdu-text urdu-large font-bold")}>
                {t.uploadBtn}
              </span>
            </motion.button>
          ) : (
            <motion.div 
              key="symptom-checker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className={cn("text-lg font-bold text-gray-800 mb-4", language === 'ur' && "urdu-text text-right")}>
                {t.symptoms.title}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom.id}
                    disabled={!selectedCrop}
                    onClick={() => handleSymptomSelect(symptom.id)}
                    className={cn(
                      "flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-95 disabled:opacity-50",
                      language === 'ur' && "flex-row-reverse"
                    )}
                  >
                    <div className={cn("flex items-center gap-3", language === 'ur' && "flex-row-reverse")}>
                      <span className="text-xl">{symptom.icon}</span>
                      <span className={cn("text-sm font-bold text-gray-700", language === 'ur' && "urdu-text")}>
                        {t.symptoms[symptom.id as keyof typeof t.symptoms]}
                      </span>
                    </div>
                    <ChevronRight size={18} className={cn("text-gray-300", language === 'ur' && "rotate-180")} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </motion.div>
  );
}
