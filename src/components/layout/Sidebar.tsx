import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Settings,
  BadgeHelp,
  Search,
  ShoppingCart,
  PackageCheck,
  Landmark,
  ChartSpline,
  ShoppingBag
} from "lucide-react";

const MAIN_GROUPS = [
  {
    title: 'GENEL',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/finans', label: 'Finans', icon: Landmark },
      { to: '/analizler', label: 'Analizler', icon: ChartSpline },
      { to: '/satista-olan-urunler', label: 'Satışta Olan Ürünler', icon: ShoppingBag },
    ],
  },
  {
    title: 'AJANLAR',
    links: [
      { to: '/ajanlar/satis-oncesi', label: 'Satış Öncesi', icon: Search },
      { to: '/ajanlar/satis-sureci', label: 'Satış Süreci', icon: ShoppingCart },
      { 
        to: '/ajanlar/satis-sonrasi', 
        label: 'Satış Sonrası', 
        icon: PackageCheck,
        subLinks: [
          { to: '/ajanlar/satis-sonrasi?tab=Operasyon Merkezi', label: 'Operasyon Merkezi' },
          { to: '/ajanlar/satis-sonrasi?tab=Yorumlar', label: 'Yorumlar' },
          { to: '/ajanlar/satis-sonrasi?tab=İadeler', label: 'İadeler' }
        ]
      },
    ],
  },
];

const SETTINGS_GROUP = {
  title: 'AYARLAR',
  links: [
    { to: '/ayarlar', label: 'Ayarlar', icon: Settings },
    { to: '/yardim', label: 'Yardım', icon: BadgeHelp },
  ],
};

export const Sidebar = ({ isCollapsed = false }: { isCollapsed?: boolean }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <aside className={`h-screen bg-[#0A0A0A]/40 backdrop-blur-xl border-r border-[var(--color-border)] flex flex-col p-4 md:p-6 fixed left-0 top-0 transition-all duration-300 ease-in-out z-20 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>

      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'pl-2'}`}>
        {!isCollapsed ? (
          <img src="/pazaralogo.svg" alt="Pazara" className="h-10 w-auto" />
        ) : (
          <img src="/pazaralogo.svg" alt="Pazara" className="h-8 w-8 object-contain" />
        )}
      </div>

      <nav className={`flex flex-col gap-8 flex-1 mt-12 ${isCollapsed ? 'items-center' : ''}`}>
        {MAIN_GROUPS.map((group) => (
          <div key={group.title} className={isCollapsed ? 'w-full flex flex-col items-center' : ''}>
            {!isCollapsed && (
              <div className="text-[var(--color-fg)] opacity-40 text-xs font-semibold mb-3 tracking-wider font-body">
                {group.title}
              </div>
            )}
            <ul className="flex flex-col gap-1 w-full">
              {group.links.map((link) => (
                <li key={link.to} className={isCollapsed ? 'flex justify-center flex-col items-center gap-1' : 'flex flex-col gap-1'}>
                  <NavLink
                    to={link.to}
                    end={!link.subLinks}
                    className={({ isActive }) =>
                      `block rounded-md font-body text-sm transition-colors ${isCollapsed ? 'p-2' : 'px-3 py-2'
                      } ${isActive
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-medium'
                        : 'text-[var(--color-fg)] opacity-70 hover:opacity-100 hover:bg-[var(--color-surface)]'
                      }`
                    }
                    title={isCollapsed ? link.label : undefined}
                  >
                    <motion.div
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                    >
                      <link.icon className="w-5 h-5 opacity-70" />
                      {!isCollapsed && <span>{link.label}</span>}
                    </motion.div>
                  </NavLink>
                  {link.subLinks && !isCollapsed && (
                    <div className="flex flex-col gap-1 mt-1 ml-4 border-l border-white/10 pl-2">
                      {link.subLinks.map(sub => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          className={() => {
                            const isSearchActive = window.location.search.includes(sub.to.split('?')[1]);
                            return `block rounded-md font-body text-xs transition-colors px-3 py-1.5 ${
                              isSearchActive
                                ? 'text-[var(--color-accent)] font-medium'
                                : 'text-[var(--color-fg)] opacity-50 hover:opacity-100 hover:bg-white/5'
                            }`;
                          }}
                        >
                          <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                            {sub.label}
                          </motion.div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={`mt-auto flex flex-col gap-6 ${isCollapsed ? 'items-center' : ''}`}>
        <div className={isCollapsed ? 'w-full flex flex-col items-center' : ''}>
          {!isCollapsed && (
            <div className="text-[var(--color-fg)] opacity-40 text-xs font-semibold mb-3 tracking-wider font-body">
              {SETTINGS_GROUP.title}
            </div>
          )}
          <ul className="flex flex-col gap-1 w-full">
            {SETTINGS_GROUP.links.map((link) => (
              <li key={link.to} className={isCollapsed ? 'flex justify-center' : ''}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-md font-body text-sm transition-colors ${isCollapsed ? 'p-2' : 'px-3 py-2'
                    } ${isActive
                      ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-medium'
                      : 'text-[var(--color-fg)] opacity-70 hover:opacity-100 hover:bg-[var(--color-surface)]'
                    }`
                  }
                  title={isCollapsed ? link.label : undefined}
                >
                  <motion.div
                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                  >
                    <link.icon className="w-5 h-5 opacity-70" />
                    {!isCollapsed && <span>{link.label}</span>}
                  </motion.div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <Menu.Root positioning={{ placement: "top-start", gutter: 8 }}>
          <Menu.Trigger className={`flex items-center gap-3 p-2 rounded-md hover:bg-[var(--color-surface)] transition-colors focus:outline-none cursor-pointer ${isCollapsed ? 'justify-center' : 'justify-between w-full -mx-2'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="min-w-10 min-h-10 w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-fg)] font-bold font-display">
                K
              </div>
              {!isCollapsed && (
                <div className="text-left">
                  <div className="text-sm font-medium text-[var(--color-fg)] font-body">Kullanıcı</div>
                  <div className="text-xs text-[var(--color-fg)] opacity-50 font-body">Yönetici</div>
                </div>
              )}
            </div>
            {!isCollapsed && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m18 15-6-6-6 6" /></svg>}
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-1.5 min-w-[208px] focus-visible:outline-none font-body text-white">
                <Menu.Item value="profile" onClick={() => navigate('/ayarlar')} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors">
                  Profili Düzenle
                </Menu.Item>
                <Menu.Separator className="my-1 h-px bg-[#2a2a2a]" />
                <Menu.Item
                  value="logout"
                  onClick={() => {
                    const confirmLogout = window.confirm("Çıkış yapmak istediğinizden emin misiniz?");
                    if (confirmLogout) {
                      showToast("Oturum kapatılıyor, yönlendiriliyorsunuz...", "error", 2000);
                      setTimeout(() => {
                        localStorage.removeItem('access_token');
                        navigate('/login');
                      }, 1500);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
                >
                  Çıkış Yap
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </div>
    </aside>
  );
};
