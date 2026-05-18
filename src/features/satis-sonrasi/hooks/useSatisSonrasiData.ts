import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export const useSatisSonrasiData = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stock] = useState([
    { id: '1', product: 'Dyson V15 Detect Absolute', quantity: 25, threshold: 10 },
    { id: '2', product: 'Apple MacBook Pro M3 14 inç', quantity: 12, threshold: 5 },
    { id: '3', product: 'Sony WH-1000XM5 Kulaklık', quantity: 50, threshold: 15 },
  ]); // Stock can stay mock for now or fetched later

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, reviewsData] = await Promise.all([
          api.getSupportOrders(),
          api.getSupportReviews()
        ]);
        
        // Map backend orders to frontend format
        const formattedOrders = ordersData.map((o: any) => ({
          id: o.id,
          date: o.date,
          product: o.product,
          customer: o.customer, // Added customer mapping
          platform: 'Satış Kanalı', // Generic for now
          amount: o.amount,
          status: o.status === 'teslim_edildi' ? 'tamamlandı' : 
                  o.status === 'kargolandı' ? 'kargoda' : 'bekliyor'
        }));
        
        setOrders(formattedOrders);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Destek verisi çekilirken hata:", err);
      }
    };
    fetchData();
  }, []);

  return { orders, reviews, stock };
};
