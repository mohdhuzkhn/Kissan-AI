/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LayoutGrid, ClipboardCheck, History, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, ScanResult, CropType } from './types';
import Header from './components/Header';
import AnalyzerTab from './tabs/Analyzer';
import AdvisoryTab from './tabs/Advisory';
import FieldLogsTab from './tabs/FieldLogs';
import AnalyticsTab from './tabs/Analytics';
import { analyzeCropImage, validateImage } from './services/geminiService';
import { cn } from './lib/utils';
import { translations } from './i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'advisory' | 'fieldLogs' | 'analytics'>('analyzer');
  const [language, setLanguage] = useState<Language>('ur');
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [pendingImageData, setPendingImageData] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const t = translations[language];

  useEffect(() => {
    // Set HTML direction globally
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // Load scans from localStorage
    try {
      const savedScans = localStorage.getItem('kisan_ai_scans');
      if (savedScans) {
        setScans(JSON.parse(savedScans));
      }
    } catch (e) {
      console.error('Failed to load scans:', e);
      localStorage.removeItem('kisan_ai_scans');
    }
    
    // Hide splash after 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const saveScan = (scan: ScanResult) => {
    // Keep internal state with full data
    setScans(prev => {
      const newScans = [scan, ...prev];
      
      // Save to localStorage WITHOUT the heavy image data to avoid QuotaExceededError
      try {
        const scansForStorage = newScans.map(s => ({ ...s, imageUrl: '' }));
        localStorage.setItem('kisan_ai_scans', JSON.stringify(scansForStorage));
      } catch (e) {
        console.error('Failed to save scans to localStorage:', e);
      }
      
      return newScans;
    });
  };

  const handleScanResult = (result: ScanResult) => {
    saveScan(result);
    setCurrentScan(result);
    setPendingImageData(null);
    setActiveTab('advisory');
  };

  const handleStartAnalysis = async (fileBase64: string, crop: CropType) => {
    setIsAnalyzing(true);
    setPendingImageData(fileBase64);
    setCurrentScan(null);
    setActiveTab('advisory');
    
    try {
      // Step 1: Check if the image contains a plant/crop
      const isPlant = await validateImage(fileBase64);
      if (!isPlant) {
        alert(t.analyzer.invalidImage);
        setActiveTab('analyzer');
        setPendingImageData(null);
        setIsAnalyzing(false);
        return;
      }

      // Step 2: Run disease analysis
      const result = await analyzeCropImage(fileBase64, crop, language);
      
      const scanResult: ScanResult = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        cropType: crop,
        healthStatus: result.healthStatus || 'healthy',
        disease: result.disease,
        confidence: result.confidence || 0,
        imageUrl: fileBase64,
      };
      
      handleScanResult(scanResult);
    } catch (error) {
      alert(t.analyzer.error);
      setPendingImageData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 gradient-bg flex flex-col items-center justify-center text-white z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
             <div className="text-[#1a531b] font-bold text-4xl">AI</div>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.appName}</h1>
          <p className={cn("text-xl mb-12", language === 'ur' && "urdu-text")}>
            {t.tagline}
          </p>
          
          <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden relative mt-8">
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        <div className="absolute bottom-12 text-white/70 text-sm flex items-center gap-2">
          <span>Google Gemini</span>
          <span className="w-1 h-1 bg-white/40 rounded-full" />
          <span>POWERED BY</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-24 flex flex-col max-w-md mx-auto bg-white shadow-lg overflow-hidden relative",
      language === 'ur' ? "urdu-text" : ""
    )}>
      <Header 
        language={language} 
        onToggleLanguage={toggleLanguage} 
      />

      <main className="flex-1 overflow-y-auto px-4 py-2">
        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' && (
            <AnalyzerTab 
              key="analyzer" 
              language={language} 
              onResult={handleScanResult} 
              onStartAnalysis={handleStartAnalysis}
            />
          )}
          {activeTab === 'advisory' && (
            <AdvisoryTab 
              key="advisory" 
              language={language} 
              scan={currentScan} 
              isAnalyzing={isAnalyzing}
              pendingImage={pendingImageData}
              onBack={() => setActiveTab('analyzer')} 
            />
          )}
          {activeTab === 'fieldLogs' && (
            <FieldLogsTab 
              key="fieldLogs" 
              language={language} 
              scans={scans} 
              onSelectScan={(scan) => {
                setCurrentScan(scan);
                setActiveTab('advisory');
              }}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab key="analytics" language={language} scans={scans} />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex justify-between items-center z-10">
        <NavButton 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')}
          icon={<LayoutGrid size={24} />}
          label={t.tabs.analytics}
          urdu={language === 'ur'}
        />
        <NavButton 
          active={activeTab === 'fieldLogs'} 
          onClick={() => setActiveTab('fieldLogs')}
          icon={<ClipboardCheck size={24} />}
          label={t.tabs.fieldLogs}
          urdu={language === 'ur'}
        />
        
        <div className="relative -top-10">
          <button 
            onClick={() => {
              if (activeTab !== 'analyzer') {
                setActiveTab('analyzer');
              } else {
                window.dispatchEvent(new CustomEvent('trigger-camera'));
              }
            }}
            disabled={isAnalyzing}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95",
              "bg-[#f59e0b] text-white border-[6px] border-white",
              isAnalyzing && "opacity-50 pointer-events-none"
            )}
          >
            <Camera size={40} />
          </button>
        </div>

        <NavButton 
          active={activeTab === 'advisory'} 
          onClick={() => setActiveTab('advisory')}
          icon={<History size={24} />}
          label={t.tabs.advisory}
          urdu={language === 'ur'}
        />
        <NavButton 
          active={activeTab === 'analyzer'} 
          onClick={() => setActiveTab('analyzer')}
          icon={<LayoutGrid size={24} />}
          label={t.tabs.analyzer}
          urdu={language === 'ur'}
        />
      </nav>

      {/* Global Analysis Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-12 text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#1a531b] border-t-transparent rounded-full mb-6"
            />
            <h2 className={cn("text-2xl font-bold text-[#1a531b] mb-2", language === 'ur' && "urdu-text")}>
              {t.analyzer.analyzing}
            </h2>
            <p className={cn("text-gray-500", language === 'ur' && "urdu-text")}>
              {t.analyzer.wait}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, urdu }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, urdu: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
        active ? "text-[#1a531b]" : "text-gray-400"
      )}
    >
      <div className={cn("p-1 rounded-lg", active && "bg-[#f0fdf4]")}>
        {icon}
      </div>
      <span className={cn("text-[10px] font-bold", urdu && "urdu-text leading-none")}>{label}</span>
    </button>
  );
}

