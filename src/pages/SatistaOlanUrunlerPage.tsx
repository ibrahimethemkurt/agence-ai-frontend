import React, { useState, useEffect, useRef } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { Reveal } from '../components/animation/Reveal';
import { 
  Download, Plus, Search, Filter, PanelLeftClose, 
  Image as ImageIcon, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  Package, Pencil, Trash2, X, Check, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { Radio } from '../components/radio';
import { api } from '../lib/api';

// --- MOCK DATA FOR COLUMNS DEFINITION ---
// MOCK DATA REMOVED

const COLUMNS_DEF = [
  { id: "image", label: "Görsel", defaultVisible: true },
  { id: "name", label: "Ürün", defaultVisible: true },
  { id: "salePrice", label: "Satış Fiyatı", defaultVisible: true },
  { id: "inventory", label: "Envanter", defaultVisible: true },
  { id: "salesCount", label: "Satış Adedi", defaultVisible: true },
  { id: "revenue", label: "Toplam Getiri", defaultVisible: true },
  { id: "purchasePrice", label: "Alış Fiyatı", defaultVisible: false },
  { id: "channels", label: "Satış Kanalları", defaultVisible: true },
  { id: "createdAt", label: "Oluşturulma Tarihi", defaultVisible: false },
  { id: "updatedAt", label: "Güncellenme Tarihi", defaultVisible: false },
];

export const SatistaOlanUrunlerPage = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Unified edit drawer state
  const [editItem, setEditItem] = useState<any | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftPrice, setDraftPrice] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftTags, setDraftTags] = useState('');
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [draftPlatforms, setDraftPlatforms] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const fetchListings = async () => {
    try {
      const data = await api.getListings();
      const formattedListings = data.map((item: any) => {
          let channels = "Henüz Yok";
          if (item.platforms_json) {
            try {
              const parsed = JSON.parse(item.platforms_json);
              if (Array.isArray(parsed) && parsed.length > 0) {
                channels = parsed.join(", ");
              }
            } catch (e) {}
          }
          
          return {
            id: String(item.id),
            name: item.product_name,
            variants: item.status === "removed" ? "Pasif" : (item.status === "completed" || item.status === "published") ? "Yayınlandı" : "İşleniyor...",
            rawStatus: item.status,
            rawPrice: item.price || 0,
            salePrice: `₺ ${(item.price || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}`,
            purchasePrice: "Hesaplanıyor",
            inventory: `${item.stock || 0} adet`,
            salesCount: String(item.sales_count || 0),
            revenue: `₺ ${(item.total_revenue || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}`,
            channels: channels,
            createdAt: new Date(item.created_at).toLocaleDateString('tr-TR'),
            updatedAt: new Date(item.created_at).toLocaleDateString('tr-TR'),
            image: item.processed_photo_url || item.photo_url || null,
            seoData: item.agent_output_json
          };
        });
        setListings(formattedListings);
      } catch (err) {
        console.error("Satışlar yüklenirken hata", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(COLUMNS_DEF.filter(c => c.defaultVisible).map(c => c.id))
  );

  const openEditDrawer = (product: any) => {
    let parsed = { title: product.name, description: '', tags: '' };
    try { parsed = JSON.parse(product.seoData || '{}'); } catch(e) {}
    setEditItem(product);
    setDraftTitle(parsed.title || product.name);
    setDraftPrice(product.rawPrice ? String(product.rawPrice) : '0');
    setDraftDesc(parsed.description || '');
    const tagsString = parsed.tags ? (Array.isArray(parsed.tags) ? parsed.tags.join(', ') : parsed.tags) : '';
    setDraftTags(tagsString);
    setDraftImage(product.image || null);

    let platforms: string[] = [];
    if (product.channels && product.channels !== "Henüz Yok") {
      platforms = product.channels.split(", ");
    }
    setDraftPlatforms(platforms);
  };

  const handleCloseDrawer = () => { setEditItem(null); };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageUploading(true);
      const uploaded = await api.uploadImage(file);
      setDraftImage(uploaded.photo_url);
    } catch (err) {
      alert('Görsel yüklenemedi.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!editItem) return;
    setIsSaving(true);
    const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
    try {
      // SEO + title güncelle
      await fetch(`${BASE}/listing/${editItem.id}/seo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ seo_title: draftTitle, seo_description: draftDesc, seo_tags: draftTags }),
      });
      // Fiyat güncelle
      if (draftPrice) {
        await fetch(`${BASE}/listing/${editItem.id}/price`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ price: parseFloat(draftPrice) }),
        });
      }
      // Görseli güncelle (varsa)
      if (draftImage && draftImage !== editItem.image) {
        await fetch(`${BASE}/listing/${editItem.id}/image`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ image_url: draftImage }),
        });
      }
      // Platformları güncelle
      await fetch(`${BASE}/listing/${editItem.id}/platforms`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ platforms: draftPlatforms }),
      });

      setListings(prev => prev.map(l => l.id === editItem.id ? {
        ...l,
        name: draftTitle,
        salePrice: `₺ ${parseFloat(draftPrice || '0').toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
        seoData: JSON.stringify({ title: draftTitle, description: draftDesc, tags: draftTags }),
        image: draftImage,
        channels: draftPlatforms.length > 0 ? draftPlatforms.join(', ') : 'Henüz Yok',
        variants: 'Yayınlandı', rawStatus: 'published'
      } : l));
      setEditItem(null);
    } catch (err) {
      alert('Kaydedilemedi, tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (listingId: string) => {
    if (!confirm('Bu ürünü satıştan kaldırmak istediğinize emin misiniz?')) return;
    const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
    try {
      await fetch(`${BASE}/listing/${listingId}/remove`, { method: 'PATCH', headers });
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, variants: 'Pasif', rawStatus: 'removed' } : l));
      if (editItem?.id === listingId) setEditItem(null);
    } catch (err) {
      alert('Kaldırılamıyor.');
    }
  };

  const handleRepublish = async (listingId: string) => {
    const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
    try {
      await fetch(`${BASE}/listing/${listingId}/republish`, { method: 'PATCH', headers });
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, variants: 'Yayınlandı', rawStatus: 'published' } : l));
    } catch (err) { console.error(err); }
  };



  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const toggleAll = () => {
    if (selectedItems.size === listings.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(listings.map(p => p.id)));
    }
  };

  const toggleColumn = (colId: string) => {
    const newCols = new Set(visibleColumns);
    if (newCols.has(colId)) newCols.delete(colId);
    else newCols.add(colId);
    setVisibleColumns(newCols);
  };

  const exportToExcel = () => {
    let table = '<table border="1"><thead><tr><th>Ürün Adı</th><th>Satış Fiyatı</th><th>Envanter</th><th>Satış Adedi</th><th>Toplam Getiri</th></tr></thead><tbody>';
    listings.forEach(item => {
      table += `<tr><td>${item.name}</td><td>${item.salePrice}</td><td>${item.inventory}</td><td>${item.salesCount}</td><td>${item.revenue}</td></tr>`;
    });
    table += '</tbody></table>';
    
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head><body>${table}</body></html>
    `;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Urunler.xls';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    let tableRows = '';
    listings.forEach(item => {
      tableRows += `<tr><td>${item.name}</td><td>${item.salePrice}</td><td>${item.inventory}</td><td>${item.salesCount}</td><td>${item.revenue}</td></tr>`;
    });

    const html = `
      <html>
        <head>
          <title>Ürünler Raporu</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; color: #333; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Satıştaki Ürünler Raporu</h1>
          <table>
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Satış Fiyatı</th>
                <th>Envanter</th>
                <th>Satış Adedi</th>
                <th>Toplam Getiri</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <PageTransition className="w-full h-full flex flex-col py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-[var(--color-accent)]" />
            Ürünler
          </h1>
          <p className="text-[var(--color-muted)] text-sm">Satışta olan tüm ürünlerinizi buradan yönetebilirsiniz.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
            <Menu.Trigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-fg)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-white/5 transition-colors outline-none cursor-pointer">
              <Download className="w-4 h-4" />
              Dışa Aktar
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-2 min-w-[150px] focus-visible:outline-none font-body text-white">
                  <Menu.Item 
                    value="excel" 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] cursor-pointer outline-none transition-colors"
                  >
                     Excel İndir (.xls)
                  </Menu.Item>
                  <Menu.Item 
                    value="pdf" 
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] cursor-pointer outline-none transition-colors"
                  >
                     PDF İndir (.pdf)
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <button 
            onClick={() => navigate('/ajanlar/satis-sureci')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-2)] rounded-lg transition-colors shadow-[0_0_15px_rgba(160,124,254,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Ürün Ekle
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <Reveal variant="fadeUp" className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col flex-1">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212]/50">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input 
                type="text" 
                placeholder="Tabloda arama yapın..." 
                className="w-full bg-[#1A1A1A] border border-[var(--color-border)] text-[var(--color-fg)] text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-muted)]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-fg)] bg-[#1A1A1A] border border-[var(--color-border)] rounded-lg hover:bg-[#252525] transition-colors">
              <Filter className="w-4 h-4" />
              Filtre
            </button>
          </div>

          <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
            <Menu.Trigger className="flex items-center justify-center p-2 text-[var(--color-fg)] border border-[var(--color-border)] rounded-lg hover:bg-[#1A1A1A] transition-colors outline-none cursor-pointer">
              <PanelLeftClose className="w-5 h-5 opacity-80" />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-2 min-w-[200px] focus-visible:outline-none font-body text-white">
                  <div className="px-3 py-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-1">Görünür Sütunlar</div>
                  {COLUMNS_DEF.map((col) => (
                    <Menu.Item 
                      key={col.id} 
                      value={col.id}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleColumn(col.id);
                      }}
                      className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors group"
                    >
                      <span className="font-medium text-[var(--color-fg)] group-hover:text-white transition-colors">{col.label}</span>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative ${visibleColumns.has(col.id) ? 'bg-[var(--color-accent)]' : 'bg-[#2A2A2A]'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${visibleColumns.has(col.id) ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#121212] border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                <th className="p-4 w-12 text-center">
                  <div 
                    className="flex items-center justify-center cursor-pointer" 
                    onClick={toggleAll}
                  >
                    <div className="pointer-events-none">
                      <Radio checked={selectedItems.size === listings.length && listings.length > 0} />
                    </div>
                  </div>
                </th>
                {COLUMNS_DEF.map(col => visibleColumns.has(col.id) && (
                  <th key={col.id} className="p-4">{col.label}</th>
                ))}
                <th className="p-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan={10} className="p-8 text-center text-[var(--color-muted)]">Satıştaki ürünler yükleniyor...</td></tr>
              ) : listings.length === 0 ? (
                <tr><td colSpan={10} className="p-8 text-center text-[var(--color-muted)]">Henüz satışta olan bir ürününüz bulunmuyor. Satış Süreci sayfasından ürün ekleyebilirsiniz.</td></tr>
              ) : listings.map((product) => {
                const isSelected = selectedItems.has(product.id);
                const isPassive = product.rawStatus === 'removed';
                return (
                  <tr 
                    key={product.id} 
                    className={`transition-colors hover:bg-white/[0.02] ${isSelected ? 'bg-[var(--color-accent)]/[0.05]' : ''} ${isPassive ? 'opacity-50 grayscale' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <div 
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => toggleSelection(product.id)}
                      >
                        <div className="pointer-events-none">
                          <Radio checked={isSelected} />
                        </div>
                      </div>
                    </td>
                    
                    {visibleColumns.has("image") && (
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-[var(--color-border)] overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[var(--color-muted)]" />
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.has("name") && (
                      <td className="p-4">
                        <div className="font-medium text-[var(--color-fg)]">{product.name}</div>
                        <div className={`text-xs mt-1 ${isPassive ? 'text-red-400 font-semibold' : 'text-[var(--color-muted)]'}`}>{product.variants}</div>
                      </td>
                    )}

                    {visibleColumns.has("salePrice") && (
                      <td className="p-4">
                        <span className="font-medium text-[var(--color-fg)]">{product.salePrice}</span>
                      </td>
                    )}

                    {visibleColumns.has("inventory") && (
                      <td className="p-4">
                        <span className={`whitespace-nowrap inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                          product.inventory === 'Tükendi' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-[#1A1A1A] text-[var(--color-fg)] border-[var(--color-border)]'
                        }`}>
                          {product.inventory}
                        </span>
                      </td>
                    )}

                    {visibleColumns.has("salesCount") && (
                      <td className="p-4">
                        <span className="whitespace-nowrap inline-flex items-center font-medium text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md text-xs border border-[#10B981]/20">
                          {product.salesCount} adet
                        </span>
                      </td>
                    )}

                    {visibleColumns.has("revenue") && (
                      <td className="p-4">
                        <span className="font-semibold text-[#8B5CF6]">{product.revenue}</span>
                      </td>
                    )}

                    {visibleColumns.has("purchasePrice") && (
                      <td className="p-4 text-[var(--color-muted)]">{product.purchasePrice}</td>
                    )}

                    {visibleColumns.has("channels") && (
                      <td className="p-4 text-[var(--color-muted)] text-sm">{product.channels}</td>
                    )}

                    {visibleColumns.has("createdAt") && (
                      <td className="p-4 text-[var(--color-muted)] text-sm">{product.createdAt}</td>
                    )}

                    {visibleColumns.has("updatedAt") && (
                      <td className="p-4 text-[var(--color-muted)] text-sm">{product.updatedAt}</td>
                    )}

                    <td className="p-4 text-right">
                       <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
                         <Menu.Trigger className="p-2 text-[var(--color-muted)] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-colors outline-none cursor-pointer">
                           <MoreHorizontal className="w-5 h-5" />
                         </Menu.Trigger>
                         <Portal>
                           <Menu.Positioner>
                             <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-2 min-w-[180px] focus-visible:outline-none font-body text-white">
                               <Menu.Item
                                 value="edit"
                                 onClick={() => openEditDrawer(product)}
                                 className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] cursor-pointer outline-none transition-colors"
                               >
                                 <Pencil className="w-4 h-4 text-[#8b5cf6]" />
                                 <span>Ürünü Düzenle</span>
                               </Menu.Item>
                               <div className="border-t border-[#2a2a2a] my-1" />
                               <Menu.Item
                                 value="remove"
                                 onClick={() => product.rawStatus === 'removed' ? handleRepublish(product.id) : handleRemove(product.id)}
                                 className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors ${product.rawStatus === 'removed' ? 'hover:bg-green-500/10 text-green-400' : 'hover:bg-red-500/10 text-red-400'}`}
                               >
                                 {product.rawStatus === 'removed' ? (
                                   <><Check className="w-4 h-4" /><span>Tekrar Yayına Al</span></>
                                 ) : (
                                   <><Trash2 className="w-4 h-4" /><span>Satıştan Kaldır</span></>
                                 )}
                               </Menu.Item>
                             </Menu.Content>
                           </Menu.Positioner>
                         </Portal>
                       </Menu.Root>
                     </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[#121212]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
          <div className="flex items-center gap-3">
            <span>Satır Adedi:</span>
            <div className="relative">
              <select className="appearance-none bg-[#1A1A1A] border border-[var(--color-border)] text-[var(--color-fg)] rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--color-accent)] cursor-pointer">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>1-{listings.length} / {listings.length} adet</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-1 rounded-md hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </Reveal>

      {/* Unified Edit Drawer */}
      {editItem && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
            onClick={handleCloseDrawer}
          />
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full z-[100] w-full max-w-md bg-[#0d0d0d] border-l border-[#2a2a2a] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">Ürünü Düzenle</h2>
                  <p className="text-xs text-[#737373] truncate max-w-[200px]">{editItem.name}</p>
                </div>
              </div>
              <button onClick={handleCloseDrawer} className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#737373] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Ürün Görseli</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-48 rounded-2xl border-2 border-dashed border-[#2a2a2a] hover:border-[#8b5cf6]/50 bg-[#0a0a0a] hover:bg-[#8b5cf6]/5 transition-all cursor-pointer flex items-center justify-center overflow-hidden group"
                >
                  {imageUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-[#737373]">Yükleniyor...</span>
                    </div>
                  ) : draftImage ? (
                    <>
                      <img src={draftImage} alt="Ürün görseli" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <ImageIcon className="w-5 h-5 text-white" />
                        <span className="text-white text-sm font-medium">Değiştir</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-[#737373] group-hover:text-[#8b5cf6] transition-colors">
                      <ImageIcon className="w-10 h-10" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Görsel yükle</p>
                        <p className="text-xs mt-1 opacity-70">PNG, JPG, WEBP desteklenir</p>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
              </div>

              {/* Product Title */}
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">Ürün Başlığı</label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder:text-[#737373]"
                  placeholder="Müşterilerin göreceği başlık..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">Satış Fiyatı (₺)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] font-bold text-sm">₺</span>
                  <input
                    type="number"
                    value={draftPrice}
                    onChange={(e) => setDraftPrice(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-[#8b5cf6] transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">SEO Açıklaması</label>
                <textarea
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] resize-none transition-colors placeholder:text-[#737373]"
                  placeholder="Satış artırıcı ürün açıklaması..."
                />
              </div>

              {/* SEO Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">Etiketler</label>
                <input
                  type="text"
                  value={draftTags}
                  onChange={(e) => setDraftTags(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder:text-[#737373]"
                  placeholder="kalem, kırtasiye, versatil..."
                />
                <p className="text-xs text-[#737373] mt-2 ml-1">Virgülle ayırarak birden fazla etiket ekleyebilirsiniz</p>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Satış Kanalları</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Amazon', 'Trendyol', 'Hepsiburada', 'Çiçeksepeti'].map((platform) => {
                    const isSelected = draftPlatforms.includes(platform);
                    return (
                      <div 
                        key={platform}
                        onClick={() => {
                          if (isSelected) {
                            setDraftPlatforms(draftPlatforms.filter(p => p !== platform));
                          } else {
                            setDraftPlatforms([...draftPlatforms, platform]);
                          }
                        }}
                        className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${
                          isSelected ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#737373] hover:border-white/30'
                        }`}
                      >
                        <ShoppingCart size={20} className="mb-2" />
                        <span className="font-bold text-sm">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-[#2a2a2a] bg-[#080808] shrink-0 flex flex-col gap-3">
              <button
                onClick={handleSaveAll}
                disabled={isSaving || !draftTitle}
                className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Kaydediliyor...</span></>
                ) : (
                  <><Check className="w-4 h-4" /><span>Kaydet ve Yayına Al</span></>
                )}
              </button>
              <button
                onClick={() => { handleRemove(editItem.id); }}
                className="w-full py-2.5 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors text-sm"
              >
                Satıştan Kaldır
              </button>
            </div>
          </div>
        </>
      )}

    </PageTransition>
  );
};


