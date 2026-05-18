import { useState, useEffect } from 'react';

export const useSatisSonrasiData = () => {
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using our existing fetch implementation in api.ts
        // Wait, we need to add getOperations to api.ts first!
        // For now let's use standard fetch with token
        const token = localStorage.getItem('access_token');
        const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1';
        const res = await fetch(`${apiBase}/support/operations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOperations(data);
        } else {
          console.error("API Error Status:", res.status);
          const errorData = await res.text();
          console.error("API Error Data:", errorData);
        }
      } catch (error) {
        console.error("Operasyon verileri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { operations, loading };
};
