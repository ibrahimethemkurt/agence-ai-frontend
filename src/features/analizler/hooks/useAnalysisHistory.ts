import { useState } from 'react';

export const useAnalysisHistory = () => {
  const [reports] = useState([
    { id: '1', product: 'Kablosuz Kulaklık', type: 'Pazar Analizi', date: '2026-05-14', score: 85, status: 'tamamlandı' },
    { id: '2', product: 'Mekanik Klavye', type: 'Fiyat Analizi', date: '2026-05-13', score: 92, status: 'tamamlandı' },
    { id: '3', product: 'Oyuncu Mouse', type: 'Pazar Analizi', date: '2026-05-12', score: 78, status: 'tamamlandı' },
    { id: '4', product: 'Webcam 4K', type: 'Pazar Analizi', date: '2026-05-10', score: 65, status: 'tamamlandı' },
  ]);

  return { reports };
};
