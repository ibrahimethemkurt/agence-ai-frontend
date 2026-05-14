import { PageTransition } from '../components/animation/PageTransition';
import { UserInfoForm } from '../features/ayarlar/components/UserInfoForm';

export const AyarlarPage = () => {
  return (
    <PageTransition className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Ayarlar</h1>
        <p className="text-[var(--color-muted)]">Hesap bilgilerinizi, platform bağlantılarınızı ve tercihlerinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserInfoForm />
        
        <div className="space-y-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-4">Platform Bağlantıları</h3>
            <p className="text-[var(--color-muted)] text-sm mb-6">Pazaryeri API entegrasyonlarınızı buradan yönetebilirsiniz.</p>
            <div className="border border-dashed border-[var(--color-border)] rounded-lg p-6 text-center text-[var(--color-muted)] text-sm">
              Platform modülü aktif değil.
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-4">Bildirim Tercihleri</h3>
            <p className="text-[var(--color-muted)] text-sm mb-6">Hangi konularda bildirim almak istediğinizi seçin.</p>
            <div className="border border-dashed border-[var(--color-border)] rounded-lg p-6 text-center text-[var(--color-muted)] text-sm">
              Bildirim ayarları modülü aktif değil.
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
