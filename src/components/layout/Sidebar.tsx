
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_GROUPS = [
  {
    title: 'GENEL',
    links: [
      { to: '/', label: 'Dashboard' },
      { to: '/analizler', label: 'Analizler' },
      { to: '/raporlar', label: 'Raporlar' },
    ],
  },
  {
    title: 'AJANLAR',
    links: [
      { to: '/pazar-analizi', label: 'Pazar Analizi' },
      { to: '/fiyat-analizi', label: 'Fiyat Analizi' },
    ],
  },
  {
    title: 'AYARLAR',
    links: [
      { to: '/ayarlar', label: 'Ayarlar' },
      { to: '/yardim', label: 'Yardım' },
    ],
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-[240px] h-screen bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col p-6 fixed left-0 top-0">
      <div className="text-[var(--color-fg)] font-display text-xl font-bold mb-10 tracking-wide">
        AjansAI
      </div>
      
      <nav className="flex flex-col gap-8 flex-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="text-[var(--color-fg)] opacity-40 text-xs font-semibold mb-3 tracking-wider font-body">
              {group.title}
            </div>
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md font-body text-sm transition-colors ${
                        isActive
                          ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-medium'
                          : 'text-[var(--color-fg)] opacity-70 hover:opacity-100 hover:bg-[var(--color-surface)]'
                      }`
                    }
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      {link.label}
                    </motion.div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
