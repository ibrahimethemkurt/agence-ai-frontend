import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── Tipler ──────────────────────────────────────────────────────────────────

export type InsightType = 'root_cause' | 'crisis_management' | 'supplier_advice';
export type InsightSeverity = 'high' | 'medium' | 'low';

export interface Insight {
  type: InsightType;
  title: string;
  message: string;
  severity: InsightSeverity;
  product_name?: string | null;
}

interface InsightsContextType {
  insights: Insight[];
  loading: boolean;
  unreadCount: number;
  markAllRead: () => void;
  refetch: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

export const InsightsContext = createContext<InsightsContextType>({
  insights: [],
  loading: false,
  unreadCount: 0,
  markAllRead: () => {},
  refetch: () => {},
});

export const useInsights = () => useContext(InsightsContext);

// ─── Provider ────────────────────────────────────────────────────────────────

export const InsightsProvider = ({ children }: { children: ReactNode }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchInsights = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/support/insights', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: Insight[] = await res.json();
        setInsights(data);
        setUnreadCount(data.length);
      }
    } catch (err) {
      console.error('[InsightsProvider] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const markAllRead = () => setUnreadCount(0);

  return (
    <InsightsContext.Provider
      value={{ insights, loading, unreadCount, markAllRead, refetch: fetchInsights }}
    >
      {children}
    </InsightsContext.Provider>
  );
};
