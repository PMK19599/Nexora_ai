import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const primaryTabs = [
  { path: '/dashboard', label: 'Home', icon: '📊' },
  { path: '/review', label: 'Review', icon: '🧠' },
  { path: '/games', label: 'Play', icon: '🎮' },
  { path: '/career', label: 'Career', icon: '🚀' },
];

const moreTabs = [
  { path: '/tutors', label: 'Peer Tutors', icon: '👥' },
  { path: '/groups', label: 'Study Groups', icon: '📚' },
  { path: '/accessibility', label: 'Accessibility', icon: '♿' },
];

export default function MobileBottomNav() {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const allMoreTabs = user?.role === 'admin'
    ? [...moreTabs, { path: '/admin', label: 'Admin Panel', icon: '⚙️' }]
    : moreTabs;

  const isMoreActive = allMoreTabs.some(t => location.pathname === t.path);

  return (
    <>
      {/* More menu overlay + panel */}
      {showMore && (
        <>
          <div
            className="mobile-more-overlay"
            onClick={() => setShowMore(false)}
          />
          <div className="mobile-more-menu">
            {allMoreTabs.map(tab => (
              <NavLink
                key={tab.path}
                to={tab.path}
                onClick={() => setShowMore(false)}
                className={({ isActive }) =>
                  `mobile-more-item${isActive ? ' active' : ''}`
                }
              >
                <span className="mobile-more-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            ))}
          </div>
        </>
      )}

      {/* Bottom nav bar */}
      <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
        <div className="mobile-bottom-nav-inner">
          {primaryTabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `mobile-nav-item${isActive ? ' active' : ''}`
              }
            >
              <span className="mobile-nav-icon">{tab.icon}</span>
              <span className="mobile-nav-label">{tab.label}</span>
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`mobile-nav-item${isMoreActive ? ' active' : ''}`}
            aria-label="More options"
          >
            <span className="mobile-nav-icon">
              {showMore ? '✕' : '•••'}
            </span>
            <span className="mobile-nav-label">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
