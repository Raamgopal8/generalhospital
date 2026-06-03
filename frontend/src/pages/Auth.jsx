import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Activity, Shield, User, Lock, Mail, Users, ArrowRight, MapPin, Phone, Clock, Award, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' (patient) or 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await api.auth.login(email, password);
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const data = await api.auth.register(name, email, password, role);
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      <div style={styles.pageLayout}>
        {/* Left Panel — Hospital Info */}
        <div style={styles.infoPanel} className="glass-panel animate-fade-in">
          <div style={styles.infoPanelHeader}>
            <Activity size={30} color="var(--primary)" />
            <div>
              <h2 style={styles.infoPanelTitle}>Clear Dental <span style={{ color: 'var(--primary)' }}>Care</span></h2>
              <p style={styles.infoPanelTagline}>Precision Dentistry & Smile Design</p>
            </div>
          </div>

          <div style={styles.infoPanelDivider} />

          <div style={styles.infoBlock}>
            <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={styles.infoBlockLabel}>Address</p>
              <p style={styles.infoBlockValue}>No 2, near Thanthai Hans Rover Centenary Arch,<br />opposite to tambu vegetable shop, Sungu Pettai,<br />Perambalur, Tamil Nadu 621212</p>
            </div>
          </div>

          <div style={styles.infoBlock}>
            <Phone size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <p style={styles.infoBlockLabel}>Contact Phone</p>
              <p style={{ ...styles.infoBlockValue, color: '#10b981', fontWeight: 700 }}>063836 48103</p>
            </div>
          </div>

          <div style={styles.infoBlock}>
            <Clock size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <p style={styles.infoBlockLabel}>Timings</p>
              <p style={styles.infoBlockValue}>Clinic Hours: 09:00 AM – 09:00 PM</p>
            </div>
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.badge}><Award size={12} color="var(--primary)" /> Smile Design</div>
            <div style={styles.badge}><Shield size={12} color="#10b981" /> 3D Scanning</div>
            <div style={styles.badge}><Activity size={12} color="#f59e0b" /> Implants</div>
          </div>
        </div>

        {/* Right Panel — Auth Form */}
        <div style={styles.authWrapper} className="glass-panel animate-fade-in">
          {/* Brand Header */}
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <Activity size={28} color="var(--primary)" />
            </div>
            <h1 style={styles.logoText}>Clear Dental <span style={{ color: 'var(--primary)' }}>Care</span></h1>
            <p style={styles.subtitle}>Clear Dental Care Management Portal</p>
          </div>

        {/* Action Toggle (Login / Signup) */}
        <div style={styles.toggleContainer} className="glass-panel">
          <button 
            style={{
              ...styles.toggleBtn,
              ...(isLogin ? styles.activeToggle : {})
            }}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button 
            style={{
              ...styles.toggleBtn,
              ...(!isLogin ? styles.activeToggle : {})
            }}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={styles.errorAlert} className="animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  className="form-input"
                  style={styles.inputField}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                className="form-input"
                style={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={styles.eyeToggle}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeOff size={16} color="var(--text-muted)" />
                  : <Eye size={16} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          {/* Role selector (Patient / Administrator) */}
          <div style={styles.roleContainer}>
            <span style={styles.roleLabel}>Access Tier:</span>
            <div style={styles.roleGrid}>
              <div 
                style={{
                  ...styles.roleCard,
                  ...(role === 'user' ? styles.selectedRoleCard : {})
                }}
                onClick={() => setRole('user')}
              >
                <Users size={16} color={role === 'user' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Patient / User</span>
              </div>
              <div 
                style={{
                  ...styles.roleCard,
                  ...(role === 'admin' ? styles.selectedRoleCard : {})
                }}
                onClick={() => setRole('admin')}
              >
                <Shield size={16} color={role === 'admin' ? 'var(--secondary)' : 'var(--text-muted)'} />
                <span>Administrator</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        
      </div>
      </div>{/* end pageLayout */}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#070b13',
    position: 'relative',
    overflow: 'hidden',
  },
  pageLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    zIndex: 10,
    width: '100%',
    maxWidth: '900px',
  },
  infoPanel: {
    flex: '0 0 320px',
    padding: '32px 28px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--glass-border)',
    borderRadius: 'var(--border-radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  infoPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoPanelTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.2,
  },
  infoPanelTagline: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  infoPanelDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
  },
  infoBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  infoBlockLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '3px',
  },
  infoBlockValue: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
  },
  bgGlow1: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(0,0,0,0) 70%)',
    top: '10%',
    left: '15%',
    zIndex: 1,
  },
  bgGlow2: {
    position: 'absolute',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%)',
    bottom: '10%',
    right: '15%',
    zIndex: 1,
  },
  authWrapper: {
    width: '100%',
    maxWidth: '460px',
    padding: '40px 30px',
    zIndex: 10,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--glass-border)',
    borderRadius: 'var(--border-radius-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    boxShadow: '0 0 20px 0 rgba(6, 182, 212, 0.1)',
    marginBottom: '16px',
  },
  logoText: {
    fontSize: '1.6rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  toggleContainer: {
    display: 'flex',
    padding: '4px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(15,23,42,0.4)',
  },
  toggleBtn: {
    flex: 1,
    padding: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  activeToggle: {
    background: 'rgba(255,255,255,0.08)',
    color: 'var(--text-primary)',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '12px 14px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.88rem',
    fontWeight: 500,
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  inputField: {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '40px',
  },
  eyeToggle: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'opacity 0.2s',
    opacity: 0.7,
  },

  roleContainer: {
    margin: '10px 0 24px 0',
  },
  roleLabel: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: '8px',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  roleCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    border: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(15,23,42,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  selectedRoleCard: {
    borderColor: 'rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text-primary)',
    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.15)',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 20px',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.98rem',
    marginTop: '6px',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
  },
  toggleModeText: {
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};
