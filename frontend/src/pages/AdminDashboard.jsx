import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { api } from '../utils/api';
import { 
  Users, UserPlus, Bed, Plus, Trash2, Check, X, AlertTriangle, 
  TrendingUp, Activity, Pill, DollarSign, Calendar, Clock, Edit2,
  Search, Mail, Phone, UserCircle2, ChevronDown, ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Dashboard Stats & Lists
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [beds, setBeds] = useState([]);
  const [duties, setDuties] = useState([]);

  // Loadings & Errors
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Add Forms States
  const [doctorForm, setDoctorForm] = useState({
    name: '', specialization: '', department: 'General Medicine', experience: '', phone: '', available: true
  });
  const [medicineForm, setMedicineForm] = useState({
    name: '', category: 'Analgesics', stock: '', price: '', minThreshold: 10
  });
  const [bedForm, setBedForm] = useState({
    bedNumber: '', type: 'General'
  });
  const [dutyForm, setDutyForm] = useState({
    doctor: '', date: '', shift: 'Morning (08:00 AM - 04:00 PM)', room: '', notes: ''
  });
  const [editingDutyId, setEditingDutyId] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);

  useEffect(() => {
    // Authenticate Admin
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }
    const currUser = JSON.parse(userStr);
    if (currUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    setUser(currUser);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, apptsData, ptsData, docData, medData, bedData, dutyData] = await Promise.all([
        api.auth.getStats(),
        api.appointments.getAll(),
        api.auth.getUsers(),
        api.doctors.getAll(),
        api.medicines.getAll(),
        api.beds.getAll(),
        api.duties.getAll()
      ]);
      setStats(statsData);
      setAppointments(apptsData);
      setPatients(ptsData);
      setDoctors(docData);
      setMedicines(medData);
      setBeds(bedData);
      setDuties(dutyData);
    } catch (err) {
      setError('Failed to fetch hospital records: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleAppointmentStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await api.appointments.updateStatus(id, status);
      await fetchData(); // Refresh data
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.doctors.add(doctorForm);
      setDoctorForm({ name: '', specialization: '', department: 'General Medicine', experience: '', phone: '', available: true });
      await fetchData();
      alert('Doctor profile added successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleDoctorAvail = async (doc) => {
    try {
      await api.doctors.update(doc._id, { ...doc, available: !doc.available });
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor profile?')) return;
    try {
      await api.doctors.delete(id);
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.medicines.add(medicineForm);
      setMedicineForm({ name: '', category: 'Analgesics', stock: '', price: '', minThreshold: 10 });
      await fetchData();
      alert('Medicine added to inventory!');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStock = async (med, val) => {
    const newStock = med.stock + val;
    if (newStock < 0) return;
    try {
      await api.medicines.update(med._id, { ...med, stock: newStock });
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medicine?')) return;
    try {
      await api.medicines.delete(id);
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddBed = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.beds.add(bedForm);
      setBedForm({ bedNumber: '', type: 'General' });
      await fetchData();
      alert('Hospital bed added successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDischargePatient = async (bedId) => {
    if (!window.confirm('Discharge patient and vacate this bed?')) return;
    try {
      await api.beds.toggleOccupancy(bedId, { isOccupied: false });
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBed = async (id) => {
    if (!window.confirm('Are you sure you want to remove this bed?')) return;
    try {
      await api.beds.delete(id);
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddDuty = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingDutyId) {
        await api.duties.update(editingDutyId, dutyForm);
        alert('Duty assignment updated successfully!');
      } else {
        await api.duties.add(dutyForm);
        alert('Duty assignment created successfully!');
      }
      setDutyForm({ doctor: '', date: '', shift: 'Morning (08:00 AM - 04:00 PM)', room: '', notes: '' });
      setEditingDutyId(null);
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditDuty = (duty) => {
    setEditingDutyId(duty._id);
    setDutyForm({
      doctor: duty.doctor?._id || duty.doctor || '',
      date: duty.date,
      shift: duty.shift,
      room: duty.room,
      notes: duty.notes || ''
    });
  };

  const handleCancelEditDuty = () => {
    setEditingDutyId(null);
    setDutyForm({ doctor: '', date: '', shift: 'Morning (08:00 AM - 04:00 PM)', room: '', notes: '' });
  };

  const handleDeleteDuty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this duty assignment?')) return;
    try {
      await api.duties.delete(id);
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Sub-sections renderer
  const renderPatientsTab = () => {
    const filtered = patients.filter((p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(patientSearch.toLowerCase())
    );

    const getPatientAppts = (userId) =>
      appointments.filter((a) => a.user?._id === userId || a.user === userId);

    const statusColor = (s) => ({
      'Confirmed': '#10b981', 'Pending': '#f59e0b', 'Cancelled': '#ef4444'
    }[s] || 'var(--text-muted)');

    return (
      <div style={styles.tabSection}>
        {/* Header row */}
        <div style={styles.tabHeader}>
          <div>
            <h2 style={styles.tabTitle}>Patient Records</h2>
            <p style={styles.tabSubtitle}>
              {patients.length} registered patient{patients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <div style={styles.patientStatStrip}>
          <div style={styles.patientStat} className="glass-panel">
            <UserCircle2 size={20} color="var(--primary)" />
            <div>
              <div style={styles.pStatVal}>{patients.length}</div>
              <div style={styles.pStatLabel}>Total Patients</div>
            </div>
          </div>
          <div style={styles.patientStat} className="glass-panel">
            <Calendar size={20} color="#f59e0b" />
            <div>
              <div style={styles.pStatVal}>
                {appointments.filter(a => a.status === 'Pending').length}
              </div>
              <div style={styles.pStatLabel}>Pending Appts</div>
            </div>
          </div>
          <div style={styles.patientStat} className="glass-panel">
            <Check size={20} color="#10b981" />
            <div>
              <div style={styles.pStatVal}>
                {appointments.filter(a => a.status === 'Confirmed').length}
              </div>
              <div style={styles.pStatLabel}>Confirmed Appts</div>
            </div>
          </div>
          <div style={styles.patientStat} className="glass-panel">
            <X size={20} color="#ef4444" />
            <div>
              <div style={styles.pStatVal}>
                {appointments.filter(a => a.status === 'Cancelled').length}
              </div>
              <div style={styles.pStatLabel}>Cancelled</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={styles.searchRow}>
          <div style={styles.searchWrapper}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              className="form-input"
              style={styles.searchInput}
              placeholder="Search by name or email..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
          </div>
          <div style={styles.searchCount}>
            Showing <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> of {patients.length}
          </div>
        </div>

        {/* Patient list */}
        {filtered.length === 0 ? (
          <div className="glass-panel" style={styles.emptyPatients}>
            <UserCircle2 size={36} color="var(--text-muted)" />
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>No patients found</p>
          </div>
        ) : (
          <div style={styles.patientList}>
            {filtered.map((pt) => {
              const ptAppts = getPatientAppts(pt._id);
              const isExpanded = expandedPatient === pt._id;
              return (
                <div key={pt._id} className="glass-panel" style={styles.patientCard}>
                  {/* Patient row */}
                  <div
                    style={styles.patientRow}
                    onClick={() => setExpandedPatient(isExpanded ? null : pt._id)}
                  >
                    <div style={styles.patientAvatar}>
                      {pt.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div style={styles.patientInfo}>
                      <div style={styles.patientName}>{pt.name}</div>
                      <div style={styles.patientMeta}>
                        <span style={styles.metaChip}>
                          <Mail size={11} /> {pt.email}
                        </span>
                        <span style={styles.metaChip}>
                          <Calendar size={11} /> {ptAppts.length} appointment{ptAppts.length !== 1 ? 's' : ''}
                        </span>
                        <span style={styles.metaChip}>
                          <Clock size={11} /> Joined {new Date(pt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div style={styles.expandIcon}>
                      {isExpanded ? <ChevronDown size={18} color="var(--primary)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {/* Expanded Appointment History */}
                  {isExpanded && (
                    <div style={styles.apptHistory}>
                      <div style={styles.apptHistoryTitle}>Appointment History</div>
                      {ptAppts.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>No appointments yet.</p>
                      ) : (
                        ptAppts.map((a) => (
                          <div key={a._id} style={styles.apptHistoryRow}>
                            <div style={styles.apptHistoryLeft}>
                              <div style={styles.apptHistoryDoctor}>
                                Dr. {a.doctor?.name || 'N/A'}
                              </div>
                              <div style={styles.apptHistoryMeta}>
                                {a.date} @ {a.timeSlot} · {a.doctor?.specialization || ''}
                              </div>
                            </div>
                            <div style={{
                              ...styles.apptStatusBadge,
                              background: `${statusColor(a.status)}18`,
                              color: statusColor(a.status),
                              border: `1px solid ${statusColor(a.status)}44`,
                            }}>
                              {a.status}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderDashboardTab = () => {
    if (!stats) return null;
    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        {/* Core Stats Overview */}
        <div className="dashboard-grid">
          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Active Patients</div>
              <div style={styles.statVal}>{stats.users}</div>
            </div>
            <div style={{ ...styles.statIconContainer, background: 'rgba(99, 102, 241, 0.08)' }}>
              <Users size={22} color="var(--secondary)" />
            </div>
          </div>

          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Active Doctors</div>
              <div style={styles.statVal}>{stats.doctors}</div>
            </div>
            <div style={{ ...styles.statIconContainer, background: 'rgba(6, 182, 212, 0.08)' }}>
              <Activity size={22} color="var(--primary)" />
            </div>
          </div>

          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Ward Bed Occupancy</div>
              <div style={styles.statVal}>{stats.beds.occupied} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.beds.total}</span></div>
            </div>
            <div style={{ ...styles.statIconContainer, background: 'rgba(16, 185, 129, 0.08)' }}>
              <Bed size={22} color="var(--success)" />
            </div>
          </div>

          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>Low Stock Alert</div>
              <div style={{ ...styles.statVal, color: stats.medicines.lowStock > 0 ? 'var(--error)' : 'var(--text-primary)' }}>
                {stats.medicines.lowStock}
              </div>
            </div>
            <div style={{ ...styles.statIconContainer, background: stats.medicines.lowStock > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)' }}>
              <Pill size={22} color={stats.medicines.lowStock > 0 ? 'var(--error)' : 'var(--warning)'} />
            </div>
          </div>
        </div>

        {/* Dynamic Lists Grid */}
        <div style={styles.listsGrid}>
          {/* Pending Appointments */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Calendar size={18} color="var(--primary)" />
              <h3 style={styles.sectionTitle}>Pending Schedule Approvals</h3>
            </div>
            <div style={styles.listScrollContainer}>
              {appointments.filter(a => a.status === 'Pending').length === 0 ? (
                <div style={styles.emptyState}>No pending appointment approvals</div>
              ) : (
                appointments.filter(a => a.status === 'Pending').map((appt) => (
                  <div key={appt._id} style={styles.apptItem} className="glass-panel">
                    <div>
                      <div style={styles.apptPatient}>{appt.user?.name}</div>
                      <div style={styles.apptMeta}>
                        <span>Doc: {appt.doctor?.name}</span> • <span>{appt.date} @ {appt.timeSlot}</span>
                      </div>
                    </div>
                    <div style={styles.actionButtons}>
                      <button 
                        style={styles.approveBtn} 
                        onClick={() => handleAppointmentStatus(appt._id, 'Confirmed')}
                        disabled={actionLoading}
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        style={styles.cancelBtn} 
                        onClick={() => handleAppointmentStatus(appt._id, 'Cancelled')}
                        disabled={actionLoading}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Registered Patient List */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Users size={18} color="var(--secondary)" />
              <h3 style={styles.sectionTitle}>Registered Patients Roster</h3>
            </div>
            <div style={styles.listScrollContainer}>
              {patients.length === 0 ? (
                <div style={styles.emptyState}>No registered patients found</div>
              ) : (
                patients.map((p) => (
                  <div key={p._id} style={styles.patientItem} className="glass-panel">
                    <div>
                      <div style={styles.apptPatient}>{p.name}</div>
                      <div style={styles.apptMeta}>{p.email}</div>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Patient</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDoctorsTab = () => {
    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div style={styles.dualGrid}>
          {/* Add Form */}
          <div className="glass-panel" style={styles.formSection}>
            <div style={styles.formTitleContainer}>
              <UserPlus size={18} color="var(--primary)" />
              <h3>Register New Medical Staff</h3>
            </div>
            <form onSubmit={handleAddDoctor} style={styles.formContainer}>
              <div className="form-group">
                <label>Doctor Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dr. Alexander Pierce"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cardiologist"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hospital Department</label>
                <select 
                  className="form-select"
                  value={doctorForm.department}
                  onChange={(e) => setDoctorForm({...doctorForm, department: e.target.value})}
                >
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Neurology</option>
                  <option>Oncology</option>
                  <option>Orthopedics</option>
                  <option>Outpatient Care</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="8"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading}>
                <Plus size={16} /> Add Doctor Profile
              </button>
            </form>
          </div>

          {/* Roster List */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Users size={18} color="var(--primary)" />
              <h3 style={styles.sectionTitle}>Medical Staff Roster</h3>
            </div>
            <div style={styles.gridScrollContainer}>
              {doctors.map((doc) => (
                <div key={doc._id} style={styles.rosterCard} className="glass-panel">
                  <div style={styles.rosterLeft}>
                    <div style={styles.rosterName}>{doc.name}</div>
                    <div style={styles.rosterSpecialization}>{doc.specialization} • {doc.department}</div>
                    <div style={styles.rosterMeta}>
                      <span>Exp: {doc.experience} Yrs</span> • <span>Ph: {doc.phone}</span>
                    </div>
                  </div>
                  <div style={styles.rosterRight}>
                    <button 
                      style={{
                        ...styles.statusToggle,
                        background: doc.available ? 'var(--success-glow)' : 'var(--error-glow)',
                        color: doc.available ? 'var(--success)' : 'var(--error)',
                        border: doc.available ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)'
                      }}
                      onClick={() => handleToggleDoctorAvail(doc)}
                    >
                      {doc.available ? 'Active' : 'On Leave'}
                    </button>
                    <button style={styles.deleteIconBtn} onClick={() => handleDeleteDoctor(doc._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMedicinesTab = () => {
    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div style={styles.dualGrid}>
          {/* Add Form */}
          <div className="glass-panel" style={styles.formSection}>
            <div style={styles.formTitleContainer}>
              <Pill size={18} color="var(--primary)" />
              <h3>Add Stock Item</h3>
            </div>
            <form onSubmit={handleAddMedicine} style={styles.formContainer}>
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Lipitor 10mg"
                  value={medicineForm.name}
                  onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-select"
                  value={medicineForm.category}
                  onChange={(e) => setMedicineForm({...medicineForm, category: e.target.value})}
                >
                  <option>Analgesics</option>
                  <option>Antibiotics</option>
                  <option>Antidiabetics</option>
                  <option>Cardiovascular</option>
                  <option>Respiratory</option>
                  <option>Anesthetics</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Initial Qty</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="100"
                    value={medicineForm.stock}
                    onChange={(e) => setMedicineForm({...medicineForm, stock: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="1.50"
                    value={medicineForm.price}
                    onChange={(e) => setMedicineForm({...medicineForm, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Min Alert Threshold</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="10"
                  value={medicineForm.minThreshold}
                  onChange={(e) => setMedicineForm({...medicineForm, minThreshold: parseInt(e.target.value)})}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading}>
                <Plus size={16} /> Insert Stock Item
              </button>
            </form>
          </div>

          {/* Roster List */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Pill size={18} color="var(--primary)" />
              <h3 style={styles.sectionTitle}>Pharmacy Stock List</h3>
            </div>
            <div style={styles.gridScrollContainer}>
              {medicines.map((med) => {
                const isLow = med.stock <= med.minThreshold;
                return (
                  <div 
                    key={med._id} 
                    style={{
                      ...styles.rosterCard,
                      borderLeft: isLow ? '3px solid var(--error)' : '1px solid var(--glass-border)'
                    }} 
                    className="glass-panel"
                  >
                    <div style={styles.rosterLeft}>
                      <div style={styles.rosterName}>
                        {med.name}
                        {isLow && (
                          <span style={styles.lowStockText}>
                            <AlertTriangle size={12} style={{ marginRight: '3px' }} /> Critically Low
                          </span>
                        )}
                      </div>
                      <div style={styles.rosterSpecialization}>{med.category} • ${med.price.toFixed(2)} / unit</div>
                      <div style={styles.rosterMeta}>
                        <span>Stock count: <strong style={{ color: isLow ? 'var(--error)' : '#ffffff' }}>{med.stock}</strong></span> • <span>Alert Limit: {med.minThreshold}</span>
                      </div>
                    </div>
                    <div style={styles.rosterRight}>
                      <div style={styles.stockManipulator}>
                        <button style={styles.stockBtn} onClick={() => handleUpdateStock(med, -5)}>-</button>
                        <span style={styles.stockCounter}>5</span>
                        <button style={styles.stockBtn} onClick={() => handleUpdateStock(med, 5)}>+</button>
                      </div>
                      <button style={styles.deleteIconBtn} onClick={() => handleDeleteMedicine(med._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBedsTab = () => {
    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div style={styles.dualGrid}>
          {/* Add Form */}
          <div className="glass-panel" style={styles.formSection}>
            <div style={styles.formTitleContainer}>
              <Bed size={18} color="var(--primary)" />
              <h3>Register Hospital Bed</h3>
            </div>
            <form onSubmit={handleAddBed} style={styles.formContainer}>
              <div className="form-group">
                <label>Bed Number / Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ICU-05, G-12"
                  value={bedForm.bedNumber}
                  onChange={(e) => setBedForm({...bedForm, bedNumber: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ward Tier</label>
                <select 
                  className="form-select"
                  value={bedForm.type}
                  onChange={(e) => setBedForm({...bedForm, type: e.target.value})}
                >
                  <option>General</option>
                  <option>ICU</option>
                  <option>Semi-Private</option>
                  <option>Private</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={actionLoading}>
                <Plus size={16} /> Add Bed Unit
              </button>
            </form>
          </div>

          {/* Bed Grid view */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Bed size={18} color="var(--primary)" />
              <h3 style={styles.sectionTitle}>Ward Occupancy Grid</h3>
            </div>
            <div style={styles.bedGridContainer}>
              {beds.map((b) => (
                <div 
                  key={b._id} 
                  style={{
                    ...styles.bedGridCard,
                    border: b.isOccupied ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                    background: b.isOccupied ? 'rgba(239, 68, 68, 0.03)' : 'rgba(16, 185, 129, 0.03)'
                  }}
                  className="glass-panel"
                >
                  <div style={styles.bedHeader}>
                    <span style={styles.bedNum}>{b.bedNumber}</span>
                    <span style={styles.bedType}>{b.type}</span>
                  </div>
                  {b.isOccupied ? (
                    <div style={styles.occupiedData}>
                      <div style={styles.patientName}>{b.occupiedBy?.name}</div>
                      <div style={styles.admittedDate}>Admitted: {new Date(b.admittedDate).toLocaleDateString()}</div>
                      <div style={styles.bedControls}>
                        <button style={styles.dischargeBtn} onClick={() => handleDischargePatient(b._id)}>
                          Discharge
                        </button>
                        <button style={styles.bedDeleteBtn} onClick={() => handleDeleteBed(b._id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.unoccupiedData}>
                      <div style={styles.vacancyLabel}>Vacant</div>
                      <button style={styles.bedDeleteBtn} onClick={() => handleDeleteBed(b._id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDutyTab = () => {
    const isDoubleBooked = (doctorId, date) => {
      if (!doctorId || !date) return false;
      const count = duties.filter((d) => {
        const dDocId = d.doctor?._id || d.doctor;
        return dDocId === doctorId && d.date === date;
      }).length;
      return count > 1;
    };

    return (
      <div className="animate-fade-in" style={styles.tabContent}>
        <div style={styles.dualGrid}>
          {/* Add/Edit Form */}
          <div className="glass-panel" style={styles.formSection}>
            <div style={styles.formTitleContainer}>
              <Calendar size={18} color="var(--primary)" />
              <h3>{editingDutyId ? 'Modify Duty Assignment' : 'Assign Staff Duty'}</h3>
            </div>
            <form onSubmit={handleAddDuty} style={styles.formContainer}>
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  className="form-select"
                  value={dutyForm.doctor}
                  onChange={(e) => setDutyForm({ ...dutyForm, doctor: e.target.value })}
                  required
                >
                  <option value="">Select Doctor / Specialist...</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} ({doc.specialization}) {!doc.available ? '• [On Leave]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Duty Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dutyForm.date}
                  onChange={(e) => setDutyForm({ ...dutyForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Shift Slot</label>
                <select
                  className="form-select"
                  value={dutyForm.shift}
                  onChange={(e) => setDutyForm({ ...dutyForm, shift: e.target.value })}
                  required
                >
                  <option value="Morning (08:00 AM - 04:00 PM)">Morning (08:00 AM - 04:00 PM)</option>
                  <option value="Afternoon (04:00 PM - 12:00 AM)">Afternoon (04:00 PM - 12:00 AM)</option>
                  <option value="Night (12:00 AM - 08:00 AM)">Night (12:00 AM - 08:00 AM)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Room / Ward Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ward B, Room 302, ER"
                  value={dutyForm.room}
                  onChange={(e) => setDutyForm({ ...dutyForm, room: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duty Notes (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lead cardiologist on-call"
                  value={dutyForm.notes}
                  onChange={(e) => setDutyForm({ ...dutyForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={actionLoading}>
                  {editingDutyId ? <Check size={16} /> : <Plus size={16} />}
                  <span style={{ marginLeft: '6px' }}>{editingDutyId ? 'Save Changes' : 'Allocate Shift'}</span>
                </button>
                {editingDutyId && (
                  <button type="button" className="btn btn-secondary" style={{ ...styles.cancelEditBtn }} onClick={handleCancelEditDuty}>
                    <X size={16} />
                    <span style={{ marginLeft: '6px' }}>Cancel</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Roster list view */}
          <div className="glass-panel" style={styles.listSection}>
            <div style={styles.sectionHeader}>
              <Clock size={18} color="var(--primary)" />
              <h3 style={styles.sectionTitle}>Medical Staff Shift Ledger</h3>
            </div>
            <div style={styles.gridScrollContainer}>
              {duties.length === 0 ? (
                <div style={styles.emptyState}>
                  No shift assignments mapped yet. Use the allocator to assign staff members to duty roles.
                </div>
              ) : (
                duties.map((d) => {
                  const docId = d.doctor?._id || d.doctor;
                  const hasConflict = isDoubleBooked(docId, d.date);

                  // Color mapping for shifts
                  let shiftBadgeStyle = {
                    background: 'rgba(6, 182, 212, 0.08)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                  };
                  if (d.shift.startsWith('Afternoon')) {
                    shiftBadgeStyle = {
                      background: 'rgba(245, 158, 11, 0.08)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    };
                  } else if (d.shift.startsWith('Night')) {
                    shiftBadgeStyle = {
                      background: 'rgba(139, 92, 246, 0.08)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    };
                  }

                  return (
                    <div key={d._id} style={styles.rosterCard} className="glass-panel">
                      <div style={styles.rosterLeft}>
                        <div style={styles.rosterName}>
                          {d.doctor?.name || 'Unknown Doctor'}
                          {hasConflict && (
                            <span style={styles.doubleBookedBadge}>
                              <AlertTriangle size={12} style={{ marginRight: '3px' }} /> Double-Booked
                            </span>
                          )}
                        </div>
                        <div style={styles.rosterSpecialization}>
                          {d.doctor?.specialization || 'General Practitioner'} • {d.room}
                        </div>
                        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <Calendar size={12} /> {d.date}
                          </span>
                          <span style={{
                            ...styles.statusToggle,
                            ...shiftBadgeStyle,
                            padding: '2px 8px',
                            cursor: 'default'
                          }}>
                            {d.shift.split(' ')[0]}
                          </span>
                        </div>
                        {d.notes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '6px' }}>
                            Note: {d.notes}
                          </div>
                        )}
                      </div>
                      <div style={styles.rosterRight}>
                        <button
                          style={{
                            ...styles.deleteIconBtn,
                            color: 'var(--primary)',
                            marginRight: '6px'
                          }}
                          onClick={() => handleEditDuty(d)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button style={styles.deleteIconBtn} onClick={() => handleDeleteDuty(d._id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'doctors': return 'Medical Staff Controller';
      case 'duty': return 'Staff Duty Scheduler';
      case 'medicines': return 'Pharmacy Inventory Control';
      case 'beds': return 'Bed Allocation Manager';
      default: return 'Hospital Administration Panel';
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
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading hospital dashboard modules...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'patients' && renderPatientsTab()}
            {activeTab === 'doctors' && renderDoctorsTab()}
            {activeTab === 'duty' && renderDutyTab()}
            {activeTab === 'medicines' && renderMedicinesTab()}
            {activeTab === 'beds' && renderBedsTab()}
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
  tabSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tabHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  tabTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  tabSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  patientStatStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
  },
  patientStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
  },
  pStatVal: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.1,
  },
  pStatLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '2px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    maxWidth: '420px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '40px',
    width: '100%',
  },
  searchCount: {
    fontSize: '0.83rem',
    color: 'var(--text-secondary)',
  },
  patientList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  patientCard: {
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  patientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  patientAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
    border: '1px solid rgba(6,182,212,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.88rem',
    fontWeight: 700,
    color: 'var(--primary)',
    flexShrink: 0,
  },
  patientInfo: {
    flex: 1,
    minWidth: 0,
  },
  patientName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '5px',
  },
  patientMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  metaChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '2px 9px',
  },
  expandIcon: {
    flexShrink: 0,
  },
  apptHistory: {
    padding: '16px 20px 18px 78px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  apptHistoryTitle: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  },
  apptHistoryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
  },
  apptHistoryLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  apptHistoryDoctor: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  apptHistoryMeta: {
    fontSize: '0.77rem',
    color: 'var(--text-muted)',
  },
  apptStatusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '0.03em',
  },
  emptyPatients: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    textAlign: 'center',
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
    fontSize: '1.8rem',
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
  listsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  listSection: {
    padding: '24px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(30, 41, 59, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  listScrollContainer: {
    maxHeight: '380px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '4px',
  },
  gridScrollContainer: {
    maxHeight: '520px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '4px',
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
  apptItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  apptPatient: {
    fontSize: '0.92rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  apptMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  approveBtn: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--success)',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--error)',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  patientItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  dualGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
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
  formRow: {
    display: 'flex',
    gap: '12px',
  },
  rosterCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    background: 'rgba(15, 23, 42, 0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  rosterLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  rosterName: {
    fontSize: '0.98rem',
    fontWeight: 700,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
  },
  lowStockText: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--error)',
    background: 'var(--error-glow)',
    padding: '1px 6px',
    borderRadius: '4px',
    marginLeft: '10px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  rosterSpecialization: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  rosterMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  rosterRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusToggle: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteIconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'color 0.2s',
    padding: '4px',
  },
  stockManipulator: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  stockBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    width: '26px',
    height: '26px',
    cursor: 'pointer',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  stockCounter: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--primary)',
    padding: '0 8px',
  },
  bedGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
    maxHeight: '520px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  bedGridCard: {
    padding: '12px',
    border: '1px solid',
    borderRadius: 'var(--border-radius-md)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
  },
  bedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    paddingBottom: '6px',
    marginBottom: '8px',
  },
  bedNum: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  bedType: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  occupiedData: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    height: '100%',
  },
  patientName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#f87171',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  admittedDate: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
  },
  unoccupiedData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
    height: '100%',
  },
  vacancyLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--success)',
  },
  dischargeBtn: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    color: 'var(--error)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },
  bedControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: 'auto',
  },
  bedDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  cancelEditBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--glass-border)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '10px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  doubleBookedBadge: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--error)',
    background: 'var(--error-glow)',
    padding: '1px 6px',
    borderRadius: '4px',
    marginLeft: '10px',
    display: 'inline-flex',
    alignItems: 'center',
  }
};
