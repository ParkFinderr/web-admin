import { useState } from 'react';
import { useApp, STAFF_ACCOUNTS } from '../context/AppContext';
import LoginHeader from '../components/pages/LoginPage/LoginHeader';
import LoginRoleToggle from '../components/pages/LoginPage/LoginRoleToggle';
import LoginForm from '../components/pages/LoginPage/LoginForm';

export default function LoginPage() {
  const { loginAdmin, loginStaff } = useApp();
  const [mode, setMode] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = m => {
    setMode(m);
    setError('');
    setEmail('');
    setPassword('');
    setStaffId('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!password) { setError('Password wajib diisi'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = mode === 'admin' ? loginAdmin(email, password) : loginStaff(staffId, password);
    if (!result.ok) { setError(result.msg); setLoading(false); }
  };

  const selectedStaff = STAFF_ACCOUNTS.find(s => s.id === staffId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, left: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,210,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 36px 32px', position: 'relative', zIndex: 1, boxShadow: '0 24px 64px rgba(0,0,0,0.4)', animation: 'fadeUp 0.5s ease both' }}>
        <LoginHeader mode={mode} />
        <LoginRoleToggle mode={mode} switchMode={switchMode} />
        <LoginForm 
          mode={mode} email={email} setEmail={setEmail} staffId={staffId} setStaffId={v => { setStaffId(v); setError(''); }}
          password={password} setPassword={setPassword} error={error} loading={loading} handleSubmit={handleSubmit} 
          selectedStaff={selectedStaff} STAFF_ACCOUNTS={STAFF_ACCOUNTS}
        />
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 20 }}>© 2026 ParkFinder · Hanya untuk akses internal</p>
      </div>
    </div>
  );
}