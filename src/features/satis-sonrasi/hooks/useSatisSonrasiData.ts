import { useState } from 'react';

export const useSatisSonrasiData = () => {
  const [orders] = useState([
    { id: 'ORD-1234', date: '2026-05-14', product: 'Kablosuz Kulaklık V2', platform: 'Trendyol', amount: 899, status: 'bekliyor' },
    { id: 'ORD-1235', date: '2026-05-13', product: 'Oyuncu Monitörü', platform: 'Hepsiburada', amount: 4500, status: 'tamamlandı' },
    { id: 'ORD-1236', date: '2026-05-12', product: 'Mekanik Klavye', platform: 'Amazon', amount: 1200, status: 'tamamlandı' },
  ]);

  const [stock] = useState([
    { id: '1', product: 'Kablosuz Kulaklık V2', quantity: 45, threshold: 20 },
    { id: '2', product: 'Mekanik Klavye', quantity: 12, threshold: 15 },
    { id: '3', product: 'Oyuncu Monitörü', quantity: 3, threshold: 5 },
  ]);

  return { orders, stock };
};
