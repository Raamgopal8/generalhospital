import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { api } from '../utils/api';
import { 
  CalendarDays, Activity, Bed, Users, FileText, CheckCircle2, 
  Clock, XCircle, ArrowRight, ShieldCheck, HeartPulse, User
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // API Data
  const [myAppointments, setMyAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [beds, setBeds] = useState([]);

  // Loadings & Errors
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  // Booking Flow States
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');

  useEffect(() => {
    // Authenticate Patient User
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/auth');
      return;
    }
    const currUser = JSON.parse(userStr);
    if (currUser.role !== 'user') {
      navigate('/admin');
      return;
    }
    setUser(currUser);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [apptsData, docsData, bedsData] = await Promise.all([
        api.appointments.getMy(),
        api.doctors.getAll(),
        api.beds.getAll()
      ]);
      setMyAppointments(apptsData);
      setDoctors(docsData.filter(d => d.available)); // Only show active doctors
      setBeds(bedsData);
    } catch (err) {
      setError('Failed to fetch medical profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.appointments.updateStatus(id, 'Cancelled');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !bookingDate || !bookingSlot) {
      alert('Please fill out all booking fields');
      return;
    }

    setBookingLoading(true);
    try {
      await api.appointments.create({
        doctorId: selectedDoctorId,
        date: bookingDate,
        timeSlot: bookingSlot
      });
      // Clear forms
      setSelectedDoctorId('');
      setBookingDate('');
      setBookingSlot('');
      await fetchData();
      alert('Appointment request submitted successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBedAllocation = async (bedId, isOccupying) => {
    try {
      if (isOccupying) {
        await api.beds.toggleOccupancy(bedId, { isOccupied: true });
        alert('Chair reserved successfully!');
      } else {
        await api.beds.toggleOccupancy(bedId, { isOccupied: false });
        alert('Chair vacated successfully.');
      }
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge badge-success"><CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Confirmed</span>;
      case 'Cancelled':
        return <span className="badge badge-danger"><XCircle size={12} style={{ marginRight: '4px' }} /> Cancelled</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} style={{ marginRight: '4px' }} /> Pending</span>;
    }
  };

  const getSelectedDocSlots = () => {
    const doc = doctors.find(d => d._id === selectedDoctorId);
    return doc ? doc.availableSlots : [];
  };

  // Sub-sections renderer
  const renderDashboardTab = () => {
    const pendingCount = myAppointments.filter(a => a.status === 'Pending').length;
    const confirmedCount = myAppointments.filter(a => a.status === 'Confirmed').length;
    const currentAllocatedBed = beds.find(b => b.isOccupied && b.occupiedBy?._id === myAppointments[0]?.user?._id);

    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        {/* Profile Card / Overview */}
        <div style={styles.welcomeBanner} className="glass-panel">
          <div style={styles.bannerInfo}>
            <HeartPulse size={40} color="var(--primary)" />
            <div>
              <h2 style={styles.bannerTitle}>Your Dental Care Assistant</h2>
              <p style={styles.bannerSubtitle}>Book clinical schedules, reserve treatment chairs, and review your prescription notes online.</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setActiveTab('appointments')}>
            Book Appointment <ArrowRight size={16} />
          </button>
        </div>

        {/* Short Dashboard Stats */}
        <div className="dashboard-grid">
          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Total Bookings</div>
              <div style={styles.statVal}>{myAppointments.length}</div>
            </div>
            <div style={{ ...styles.statIconContainer, background: 'rgba(99, 102, 241, 0.08)' }}>
              <CalendarDays size={22} color="var(--secondary)" />
            </div>
          </div>

          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Confirmed Visits</div>
              <div style={styles.statVal}>{confirmedCount}</div>
            </div>
            <div style={{ ...styles.statIconContainer, background: 'rgba(16, 185, 129, 0.08)' }}>
              <ShieldCheck size={22} color="var(--success)" />
            </div>
          </div>

          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Chair Reservation</div>
              <div style={{ ...styles.statVal, fontSize: '1.2rem', color: currentAllocatedBed ? 'var(--error)' : 'var(--text-secondary)' }}>
                {currentAllocatedBed ? `Reserved Chair: ${currentAllocatedBed.bedNumber}` : 'No Active Reservation'}
              </div>
            </div>
            <div style={{ ...styles.statIconContainer, background: currentAllocatedBed ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)' }}>
              <Bed size={22} color={currentAllocatedBed ? 'var(--error)' : 'var(--warning)'} />
            </div>
          </div>
        </div>

        {/* Upcoming Appointments List */}
        <div className="glass-panel" style={styles.listSection}>
          <div style={styles.sectionHeader}>
            <CalendarDays size={18} color="var(--primary)" />
            <h3 style={styles.sectionTitle}>Your Schedule Checklists</h3>
          </div>
          <div style={styles.tableScroll}>
            {myAppointments.length === 0 ? (
              <div style={styles.emptyState}>No registered appointments found. Start by scheduling one!</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Doctor</th>
                    <th style={styles.th}>Specialization</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Time Slot</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.slice(0, 5).map((appt) => (
                    <tr key={appt._id} style={styles.tr}>
                      <td style={styles.td}>{appt.doctor?.name}</td>
                      <td style={styles.td}>{appt.doctor?.specialization}</td>
                      <td style={styles.td}>{appt.date}</td>
                      <td style={styles.td}>{appt.timeSlot}</td>
                      <td style={styles.td}>{getStatusBadge(appt.status)}</td>
                      <td style={styles.td}>
                        {appt.status === 'Pending' && (
                          <button 
                            className="btn btn-secondary" 
                            style={styles.cancelLinkBtn}
                            onClick={() => handleCancelAppointment(appt._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentsTab = () => {
    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div style={styles.dualGrid}>
          {/* Scheduling Form */}
          <div className="glass-panel" style={styles.formSection}>
            <div style={styles.formTitleContainer}>
              <CalendarDays size={18} color="var(--primary)" />
              <h3>Book Doctor Appointment</h3>
            </div>
            <form onSubmit={handleBookAppointment} style={styles.formContainer}>
              <div className="form-group">
                <label>Select Specialist</label>
                <select
                  className="form-select"
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    setBookingSlot('');
                  }}
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctorId && (
                <>
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]} // Block historical dates
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Available Time Slot</label>
                    <select
                      className="form-select"
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Slot --</option>
                      {getSelectedDocSlots().map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '10px' }} 
                disabled={bookingLoading || !selectedDoctorId}
              >
                {bookingLoading ? 'Submitting request...' : 'Book Appointment'}
              </button>
            </form>
          </div>

          {/* Active Doctor Listing */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Users size={18} color="var(--primary)" />
              <h3 style={styles.sectionTitle}>Available Medical Staff</h3>
            </div>
            <div style={styles.gridScrollContainer}>
              {doctors.map((doc) => (
                <div key={doc._id} style={styles.docMiniCard} className="glass-panel" onClick={() => setSelectedDoctorId(doc._id)}>
                  <div style={styles.docAvatar}>
                    <User size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={styles.docName}>{doc.name}</div>
                    <div style={styles.docSpec}>{doc.specialization} • {doc.department}</div>
                    <div style={styles.docContact}>Contact: {doc.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBedsTab = () => {
    // Check if the current user already has a bed checked out
    const activeBed = beds.find(b => b.isOccupied && b.occupiedBy?._id === myAppointments[0]?.user?._id);

    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div style={styles.bedMetaAlert} className="glass-panel">
          <Bed size={20} color="var(--primary)" />
          {activeBed ? (
            <p>You are currently checked into chair <strong>{activeBed.bedNumber}</strong>. Click "Vacate Chair" to check out.</p>
          ) : (
            <p>Review the real-time treatment chair registry. You can check into any <strong>Vacant</strong> chair slots online.</p>
          )}
        </div>

        <div style={styles.bedGridContainer}>
          {beds.map((b) => {
            const isMine = b.isOccupied && b.occupiedBy?._id === myAppointments[0]?.user?._id;
            return (
              <div 
                key={b._id} 
                style={{
                  ...styles.bedGridCard,
                  borderColor: isMine 
                    ? 'var(--primary)' 
                    : b.isOccupied 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(16, 185, 129, 0.2)',
                  background: isMine 
                    ? 'rgba(6, 182, 212, 0.05)' 
                    : b.isOccupied 
                      ? 'rgba(15, 23, 42, 0.2)' 
                      : 'rgba(16, 185, 129, 0.03)'
                }}
                className="glass-panel"
              >
                <div style={styles.bedHeader}>
                  <span style={styles.bedNum}>{b.bedNumber}</span>
                  <span style={styles.bedType}>{b.type}</span>
                </div>

                <div style={styles.bedDetails}>
                  {b.isOccupied ? (
                    isMine ? (
                      <div style={styles.bedAllocContainer}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Your Reserved Chair</span>
                        <button style={styles.vacateBtn} onClick={() => handleBedAllocation(b._id, false)}>
                          Vacate Chair
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Occupied</span>
                    )
                  ) : (
                    <div style={styles.bedAllocContainer}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>Vacant</span>
                      <button 
                        style={styles.reserveBtn} 
                        onClick={() => handleBedAllocation(b._id, true)}
                        disabled={!!activeBed} // Can only reserve one chair at a time
                      >
                        Reserve Chair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div className="glass-panel" style={styles.listSection}>
          <div style={styles.sectionHeader}>
            <FileText size={18} color="var(--primary)" />
            <h3 style={styles.sectionTitle}>Archived Clinical Visites</h3>
          </div>
          <div style={styles.tableScroll}>
            {myAppointments.length === 0 ? (
              <div style={styles.emptyState}>No historical records found</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Doctor</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Scheduled Date</th>
                    <th style={styles.th}>Time Slot</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map((appt) => (
                    <tr key={appt._id} style={styles.tr}>
                      <td style={styles.td}>{appt.doctor?.name}</td>
                      <td style={styles.td}>{appt.doctor?.department}</td>
                      <td style={styles.td}>{appt.date}</td>
                      <td style={styles.td}>{appt.timeSlot}</td>
                      <td style={styles.td}>{getStatusBadge(appt.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'appointments': return 'Schedule Specialist Visit';
      case 'beds': return 'Treatment Chair Registry';
      case 'history': return 'Your Appointment History';
      default: return 'Patient Portal';
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={styles.mainContent}>
        <Header user={user} title={getHeaderTitle()} />

        {loading ? (
          <div style={styles.loadingSpinner}>
            <Activity size={32} className="animate-fade-in" style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading patient modules...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'appointments' && renderAppointmentsTab()}
            {activeTab === 'beds' && renderBedsTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#070b13',
  },
  mainContent: {
    marginLeft: '320px',
    padding: '24px',
    minHeight: '100vh',
  },
  loadingSpinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  },
  tabContent: {
    animation: 'fadeIn 0.3s ease-out forwards',
  },
  welcomeBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '30px 40px',
    marginBottom: '30px',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(99, 102, 241, 0.04))',
  },
  bannerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  bannerTitle: {
    fontSize: '1.45rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    maxWidth: '520px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '22px 24px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(30, 41, 59, 0.3)',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statVal: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#ffffff',
  },
  statIconContainer: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  listSection: {
    padding: '24px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(30, 41, 59, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: '12px',
  },
  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  tableScroll: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.02)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '14px 16px',
    fontSize: '0.9rem',
    color: '#ffffff',
  },
  cancelLinkBtn: {
    padding: '4px 10px',
    fontSize: '0.75rem',
    background: 'rgba(239, 68, 68, 0.05)',
    color: 'var(--error)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    border: '1px dashed rgba(255,255,255,0.06)',
    borderRadius: '10px',
    background: 'rgba(15,23,42,0.1)',
  },
  dualGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr',
    gap: '24px',
  },
  formSection: {
    padding: '24px',
    background: 'rgba(30, 41, 59, 0.2)',
    border: '1px solid var(--glass-border)',
    alignSelf: 'start',
  },
  formTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: '12px',
    marginBottom: '20px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridScrollContainer: {
    maxHeight: '480px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '4px',
  },
  docMiniCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px',
    background: 'rgba(15,23,42,0.2)',
    border: '1px solid rgba(255,255,255,0.03)',
    cursor: 'pointer',
  },
  docAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  docSpec: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  docContact: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  bedMetaAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'rgba(6, 182, 212, 0.04)',
    border: '1px solid rgba(6, 182, 212, 0.12)',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: '24px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  bedGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    paddingBottom: '20px',
  },
  bedGridCard: {
    padding: '16px',
    border: '1px solid',
    borderRadius: 'var(--border-radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '130px',
  },
  bedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    paddingBottom: '8px',
    marginBottom: '10px',
  },
  bedNum: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  bedType: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  bedDetails: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  bedAllocContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  reserveBtn: {
    width: '100%',
    padding: '6px 12px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--success)',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  vacateBtn: {
    width: '100%',
    padding: '6px 12px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--error)',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  }
};
