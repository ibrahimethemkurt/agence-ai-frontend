import React, { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { Reveal } from '../components/animation/Reveal';
import { 
  Download, Upload, Plus, Search, Filter, SlidersHorizontal, 
  Image as ImageIcon, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  Package
} from 'lucide-react';
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Akıllı Saat Pro Max",
    variants: "Siyah, Gümüş",
    salePrice: "₺ 2,499.00",
    purchasePrice: "₺ 1,200.00",
    inventory: "45 adet",
    channels: "Kendi Sitemiz, Trendyol",
    createdAt: "12 Mar 2026",
    updatedAt: "15 May 2026",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "p2",
    name: "Minimalist Sırt Çantası",
    variants: "Gri, Siyah, Lacivert",
    salePrice: "₺ 850.00",
    purchasePrice: "₺ 350.00",
    inventory: "120 adet",
    channels: "Kendi Sitemiz",
    createdAt: "05 Nis 2026",
    updatedAt: "10 May 2026",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "p3",
    name: "Kablosuz Kulaklık V2",
    variants: "Beyaz",
    salePrice: "₺ 1,299.00",
    purchasePrice: "₺ 600.00",
    inventory: "Tükendi",
    channels: "Trendyol, Hepsiburada",
    createdAt: "22 Şub 2026",
    updatedAt: "01 May 2026",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "p4",
    name: "Mekanik Klavye RGB",
    variants: "Switch: Kırmızı, Mavi",
    salePrice: "₺ 1,850.00",
    purchasePrice: "₺ 900.00",
    inventory: "15 adet",
    channels: "Kendi Sitemiz",
    createdAt: "18 Oca 2026",
    updatedAt: "14 May 2026",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=100&q=80"
  }
];

const COLUMNS_DEF = [
  { id: "image", label: "Görsel", defaultVisible: true },
  { id: "name", label: "Ürün", defaultVisible: true },
  { id: "salePrice", label: "Satış Fiyatı", defaultVisible: true },
  { id: "inventory", label: "Envanter", defaultVisible: true },
  { id: "purchasePrice", label: "Alış Fiyatı", defaultVisible: false },
  { id: "channels", label: "Satış Kanalları", defaultVisible: false },
  { id: "createdAt", label: "Oluşturulma Tarihi", defaultVisible: false },
  { id: "updatedAt", label: "Güncellenme Tarihi", defaultVisible: false },
];

export const SatistaOlanUrunlerPage = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(COLUMNS_DEF.filter(c => c.defaultVisible).map(c => c.id))
  );

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const toggleAll = () => {
    if (selectedItems.size === MOCK_PRODUCTS.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(MOCK_PRODUCTS.map(p => p.id)));
    }
  };

  const toggleColumn = (colId: string) => {
    const newCols = new Set(visibleColumns);
    if (newCols.has(colId)) newCols.delete(colId);
    else newCols.add(colId);
    setVisibleColumns(newCols);
  };

  return (
    <PageTransition className="w-full max-w-[1400px] mx-auto py-8 px-4 md:px-8">
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
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-fg)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-white/5 transition-colors">
            <Download className="w-4 h-4" />
            Dışa Aktar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-fg)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-white/5 transition-colors">
            <Upload className="w-4 h-4" />
            İçe Aktar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-2)] rounded-lg transition-colors shadow-[0_0_15px_rgba(160,124,254,0.3)]">
            <Plus className="w-4 h-4" />
            Ürün Ekle
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <Reveal variant="fadeUp" className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
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
              <SlidersHorizontal className="w-5 h-5 opacity-80" />
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
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-[#333] bg-transparent accent-[var(--color-accent)] cursor-pointer"
                    checked={selectedItems.size === MOCK_PRODUCTS.length && MOCK_PRODUCTS.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                {COLUMNS_DEF.map(col => visibleColumns.has(col.id) && (
                  <th key={col.id} className="p-4">{col.label}</th>
                ))}
                <th className="p-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_PRODUCTS.map((product) => {
                const isSelected = selectedItems.has(product.id);
                return (
                  <tr 
                    key={product.id} 
                    className={`transition-colors hover:bg-white/[0.02] ${isSelected ? 'bg-[var(--color-accent)]/[0.05]' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-[#333] bg-transparent accent-[var(--color-accent)] cursor-pointer"
                        checked={isSelected}
                        onChange={() => toggleSelection(product.id)}
                      />
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
                        <div className="text-xs text-[var(--color-muted)] mt-1">{product.variants}</div>
                      </td>
                    )}

                    {visibleColumns.has("salePrice") && (
                      <td className="p-4">
                        <span className="font-medium text-[var(--color-fg)]">{product.salePrice}</span>
                      </td>
                    )}

                    {visibleColumns.has("inventory") && (
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                          product.inventory === 'Tükendi' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-[#1A1A1A] text-[var(--color-fg)] border-[var(--color-border)]'
                        }`}>
                          {product.inventory}
                        </span>
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
                      <button className="p-2 text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[#1A1A1A] rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
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
            <span>1-{MOCK_PRODUCTS.length} / {MOCK_PRODUCTS.length} adet</span>
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
    </PageTransition>
  );
};
