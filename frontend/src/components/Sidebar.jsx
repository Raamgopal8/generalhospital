import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, LayoutDashboard, Users, Pill, Bed, 
  CalendarDays, History, LogOut, ShieldAlert, MapPin
} from 'lucide-react';
import { api } from '../utils/api';

export default function Sidebar({ user, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.auth.logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Nav items based on role
  const adminItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Records', icon: Users },
    { id: 'doctors', label: 'Manage Doctors', icon: Users },
    { id: 'duty', label: 'Assign Duty', icon: CalendarDays },
    { id: 'medicines', label: 'Medicine Inventory', icon: Pill },
    { id: 'beds', label: 'Treatment Chairs', icon: Bed },
  ];

  const userItems = [
    { id: 'dashboard', label: 'User Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Book Appointment', icon: CalendarDays },
    { id: 'beds', label: 'Chair Availability', icon: Bed },
    { id: 'history', label: 'My Bookings', icon: History },
  ];

  const items = user?.role === 'admin' ? adminItems : userItems;

  return (
    <aside style={styles.sidebar} className="glass-panel">
      {/* Brand Logo */}
      <div style={styles.logoArea}>
        <Activity size={24} color="var(--primary)" />
        <div>
          <h2 style={styles.logoText}>Clear Dental <span style={{ color: 'var(--primary)' }}>Care</span></h2>
          <p style={styles.logoTagline}>Perambalur, Tamil Nadu</p>
        </div>
      </div>

      {/* User Badge */}
      <div style={styles.profileBadge} className="glass-panel">
        <div style={styles.avatar}>
          {getInitials(user?.name)}
        </div>
        <div style={styles.profileDetails}>
          <div style={styles.profileName}>{user?.name || 'Loading...'}</div>
          <div style={styles.profileRoleContainer}>
            {user?.role === 'admin' ? (
              <span style={styles.adminRole}>
                <ShieldAlert size={12} style={{ marginRight: '3px' }} /> Admin
              </span>
            ) : (
              <span style={styles.patientRole}>Patient</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              style={{
                ...styles.navBtn,
                ...(isActive ? styles.navBtnActive : {})
              }}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-secondary)'} />
              <span>{item.label}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Logout button + Address */}
      <div style={styles.footer}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
        <div style={styles.addressCard}>
          <MapPin size={11} color="var(--primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={styles.addressText}>
            No 2, near Thanthai Hans Rover Centenary Arch,<br />
            opp. tambu vegetable shop, Sungu Pettai,<br />
            Perambalur, Tamil Nadu 621212
          </p>
        </div>
      </div>
    </aside>
  );
}


const styles = {
  sidebar: {
    width: '280px',
    height: 'calc(100vh - 40px)',
    position: 'fixed',
    top: '20px',
    left: '20px',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 18px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--glass-border)',
    borderRadius: 'var(--border-radius-lg)',
    zIndex: 100,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
    paddingLeft: '6px',
  },
  logoText: {
    fontSize: '1.1rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    color: '#ffffff',
    lineHeight: 1.2,
  },
  logoTagline: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '1px',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: '28px',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    color: '#0b1120',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#ffffff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  profileRoleContainer: {
    display: 'flex',
  },
  adminRole: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#f87171',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    padding: '1px 6px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  patientRole: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--primary)',
    background: 'var(--primary-glow)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    padding: '1px 6px',
    borderRadius: '4px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 14px',
    background: 'none',
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.92rem',
    fontWeight: 600,
    textAlign: 'left',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  navBtnActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    width: '3px',
    height: '60%',
    background: 'var(--primary)',
    borderRadius: '0 4px 4px 0',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 14px',
    background: 'none',
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.92rem',
    fontWeight: 600,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  logoutBtnHover: {
    background: 'rgba(239, 68, 68, 0.05)',
    color: '#f87171',
  },
  addressCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    padding: '10px 12px',
    background: 'rgba(6, 182, 212, 0.03)',
    border: '1px solid rgba(6, 182, 212, 0.08)',
    borderRadius: '8px',
  },
  addressText: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    fontWeight: 500,
  },
};
