import { useState, useEffect } from 'react';

/**
 * Tarayıcının sessionStorage'ına otomatik olarak kaydeden ve
 * sayfayı yenileme veya başka sayfaya geçiş sonrası state'i
 * geri yükleyen generic custom hook.
 *
 * @param key - sessionStorage anahtarı
 * @param initialValue - İlk değer (sessionStorage'da henüz kayıt yoksa kullanılır)
 */
export function useSessionStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // sessionStorage quota exceeded — sessizce yoksay
    }
  }, [key, state]);

  return [state, setState];
}

/**
 * Belirli bir prefix altındaki tüm sessionStorage anahtarlarını siler.
 * Örneğin clearSessionStorageByPrefix('satisOncesi') tüm 'satisOncesi_*' anahtarlarını temizler.
 */
export function clearSessionStorageByPrefix(prefix: string): void {
  Object.keys(sessionStorage)
    .filter(k => k.startsWith(prefix))
    .forEach(k => sessionStorage.removeItem(k));
}
