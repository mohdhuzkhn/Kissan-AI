export type Language = 'en' | 'ur';

export type CropType = 
  | 'wheat' | 'rice' | 'cotton' | 'sugarcane' | 'maize' 
  | 'tomato' | 'potato' | 'onion' | 'chilli' | 'mango' 
  | 'citrus' | 'sunflower';

export interface DiseaseInfo {
  nameEn: string;
  nameUr: string;
  explanation: string;
  explanationUr: string;
  pesticideBrand: string;
  pesticideBrandUr: string;
  pricePkr: number;
  mixingRatio: string;
  mixingRatioUr: string;
  sprayTime: string;
  sprayTimeUr: string;
  yieldLossPercent: string;
  financialLossPkr: number;
  warningSigns: string[];
  warningSignsUr: string[];
}

export interface ScanResult {
  id: string;
  date: string;
  cropType: CropType;
  healthStatus: 'healthy' | 'diseased';
  disease?: DiseaseInfo;
  confidence: number;
  imageUrl: string;
}

export interface AnalyticsData {
  totalScans: number;
  healthyCount: number;
  diseasedCount: number;
  totalSavedPkr: number;
  mostCommonDiseaseEn: string;
  mostCommonDiseaseUr: string;
}
