import { Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const anchors = [
  { label: 'Home', href: '#top' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' }
];

export default function NavBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === '/';
  const onDashboard = location.pathname === '/app';
  const { user } = useAuth();

  const handleAnchor = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    navigate('/');
    window.setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };

  return (
    <header className="navbar-water-glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {onDashboard ? <p className="si-font-heading text-xl font-bold uppercase tracking-[0.14em] text-slate-100 sm:text-2xl">Dashboard</p> : null}

        <nav className="hidden items-center gap-6 md:flex">
          {onLanding ? (
            <>
              {anchors.map((anchor) => (
                <button
                  key={anchor.label}
                  type="button"
                  onClick={() => handleAnchor(anchor.href)}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {anchor.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigate(user ? '/app' : '/auth')}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {user ? 'Open Dashboard' : 'Sign In'}
              </button>
            </>
          ) : null}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:hidden">
          <ThemeToggle />
          {(onLanding || onDashboard) && onMenuToggle ? (
            <button
              type="button"
              onClick={onMenuToggle}
              aria-label={onDashboard ? 'Open section panel' : 'Open menu'}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/90"
            >
              <Menu size={18} />
            </button>
          ) : null}
        </div>

        <div className="hidden items-center gap-3 md:ml-auto md:flex">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}