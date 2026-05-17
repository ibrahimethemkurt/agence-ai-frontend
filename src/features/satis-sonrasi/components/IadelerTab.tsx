import { Reveal } from '../../../components/animation/Reveal';

const MOCK_RETURNS = [
  {
    id: 'r1',
    productName: 'Kablosuz Kulaklık V2',
    orderNo: 'ORD-2023-1042',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=100&q=80',
    reason: 'Ürün şarj olmuyor, kutusu hasarlı geldi. Müşteri iade talep etti.',
  },
  {
    id: 'r2',
    productName: 'Akıllı Saat Pro Max',
    orderNo: 'ORD-2023-1105',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=100&q=80',
    reason: 'Kordonda renk atması var. Beklentiyi karşılamadığı için iade.',
  },
  {
    id: 'r3',
    productName: 'Mekanik Klavye Blue',
    orderNo: 'ORD-2023-0988',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=100&q=80',
    reason: 'Tuşlardan biri basmıyor, üretim hatası şüphesi.',
  },
  {
    id: 'r4',
    productName: 'Oyuncu Faresi X1',
    orderNo: 'ORD-2023-1250',
    image: 'https://images.unsplash.com/photo-1527814050087-379381547949?auto=format&fit=crop&w=100&q=80',
    reason: 'Müşteri yanlış ürün sipariş ettiğini belirtti.',
  }
];

export const IadelerTab = () => {
  return (
    <div className="space-y-6">
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {MOCK_RETURNS.map((item) => (
            <div key={item.id} className="relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h4 className="text-[15px] font-semibold text-white/90 line-clamp-1">{item.productName}</h4>
                  <p className="text-xs text-[var(--color-muted)] mt-1.5 font-mono tracking-wider">{item.orderNo}</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] border border-white/10 shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 mt-auto">
                <h5 className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-wider mb-2">İade Sebebi:</h5>
                <p className="text-sm text-white/70 leading-relaxed">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
};
