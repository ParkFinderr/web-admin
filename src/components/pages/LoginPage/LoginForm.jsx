import { useState } from 'react';
export default function LoginForm({ mode, email, setEmail, staffId, setStaffId, password, setPassword, error, loading, handleSubmit, selectedStaff, STAFF_ACCOUNTS }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <form onSubmit={handleSubmit}>
      {mode === 'admin' && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 7 }}>Email Admin</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>✉️</span>
            <input className="input" type="email" placeholder="admin@parkfinder.id" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 38 }} autoComplete="email" />
          </div>
        </div>
      )}
      {mode === 'staff' && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 7 }}>Pilih Gedung</label>
          <select className="input" value={staffId} onChange={e => setStaffId(e.target.value)} style={{ cursor: 'pointer' }}>
            <option value="">-- Pilih gedung tugas Anda --</option>
            {STAFF_ACCOUNTS.map(s => <option key={s.id} value={s.id}>🏢 {s.parkingName} — {s.name}</option>)}
          </select>
          {selectedStaff && (
            <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--accent-glow)', border: '1px solid var(--border2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'var(--bg-base)' }}>
                {selectedStaff.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{selectedStaff.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Staff · {selectedStaff.parkingName}</div>
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 7 }}>Password</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>🔒</span>
          <input className="input" type={showPass ? 'text' : 'password'} placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 38, paddingRight: 42 }} autoComplete="current-password" />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: 2 }}>{showPass ? '🙈' : '👁️'}</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', marginBottom: error ? 10 : 18, fontSize: 11, color: 'var(--text3)' }}>
        {mode === 'admin' ? <>🛡️ <strong style={{ color: 'var(--text2)' }}>Admin:</strong> admin@parkfinder.id · <code style={{ color: 'var(--accent)' }}>admin123</code></> : <>👷 <strong style={{ color: 'var(--text2)' }}>Staff:</strong> pilih gedung di atas · password: <code style={{ color: 'var(--accent)' }}>staff123</code></>}
      </div>
      {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>⚠️ {error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, borderRadius: 12 }}>
        {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Memverifikasi...</span> : mode === 'admin' ? '🚀 Masuk sebagai Admin' : '🏢 Masuk sebagai Staff'}
      </button>
    </form>
  );
}