import { PageTransition } from '../components/animation/PageTransition';

export const SatistaOlanUrunlerPage = () => {
  return (
    <PageTransition className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Satışta Olan Ürünler</h1>
        <p className="text-[#a3a3a3]">Tüm platformlarda yayında olan ürünlerinizi buradan takip edebilirsiniz.</p>
      </div>

      <div className="bg-[#121212] rounded-[32px] p-12 border border-[#2a2a2a] flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-[#737373] text-lg text-center">Henüz bu sayfanın içerikleri eklenmedi.<br/>Gelecekte ürünleriniz burada listelenecektir.</p>
      </div>
    </PageTransition>
  );
};
