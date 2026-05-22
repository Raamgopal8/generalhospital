import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Shield } from 'lucide-react';

export default function Header({ user, title }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header style={styles.headerWrap}>
      {/* Top info bar */}
      <div style={styles.infoBar}>
        <div style={styles.infoLeft}>
          <div style={styles.infoBadge}>
            <Shield size={12} color="var(--primary)" />
            <span>NABH Accredited</span>
          </div>
          <div style={styles.infoDivider} />
          <div style={styles.infoBadge}>
            <Phone size={12} color="#10b981" />
            <span style={{ color: '#10b981' }}>Emergency: +91 9444172675</span>
          </div>
        </div>
        <div style={styles.clockCard}>
          <Calendar size={13} color="var(--primary)" />
          <span style={styles.dateText}>{formatDate(time)}</span>
          <span style={styles.divider}>|</span>
          <span style={styles.timeText}>{formatTime(time)}</span>
        </div>
      </div>

      {/* Main header */}
      <div style={styles.mainHeader} className="glass-panel">
        <div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.welcome}>
            Welcome back, <span style={{ color: '#ffffff', fontWeight: 600 }}>{user?.name || 'Guest'}</span>
            <span style={styles.hospitalRef}> — Lakshmi Hospitals, Perambalur</span>
          </p>
        </div>
      </div>
    </header>
  );
}

const styles = {
  headerWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  infoBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 18px',
    background: 'rgba(15, 23, 42, 0.55)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 600,
  },
  infoLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: 'var(--text-secondary)',
  },
  infoDivider: {
    width: '1px',
    height: '14px',
    background: 'rgba(255,255,255,0.08)',
  },
  mainHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    background: 'rgba(30, 41, 59, 0.25)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  welcome: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  hospitalRef: {
    color: 'var(--primary)',
    fontWeight: 500,
  },
  clockCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  dateText: {
    color: 'var(--text-primary)',
  },
  divider: {
    color: 'var(--text-muted)',
    margin: '0 1px',
  },
  timeText: {
    color: 'var(--primary)',
    fontFamily: 'monospace',
    letterSpacing: '0.05em',
  },
};
