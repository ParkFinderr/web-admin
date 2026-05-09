import { useState } from 'react'
import { useApp, STAFF_ACCOUNTS } from '../context/AppContext'

const LOGO_URL = 'https://storage.googleapis.com/parkfinderbucket/foto/logo.png'

export default function LoginPage() {
  const { loginAdmin, loginStaff } = useApp()

  const [mode, setMode]         = useState('admin')   // 'admin' | 'staff'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [staffId, setStaffId]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const switchMode = (m) => {
    setMode(m); setError(''); setEmail(''); setPassword(''); setStaffId('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) { setError('Password wajib diisi'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const result = mode === 'admin'
      ? loginAdmin(email, password)
      : loginStaff(staffId, password)

    if (!result.ok) { setError(result.msg); setLoading(false) }
  }

  const selectedStaff = STAFF_ACCOUNTS.find(s => s.id === staffId)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position:'absolute', top:-120, left:-120, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,210,255,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, right:-80, width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(123,97,255,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{
        width:'100%', maxWidth: 440, background:'var(--bg-card)',
        border:'1px solid var(--border)', borderRadius:20,
        padding:'36px 36px 32px', position:'relative', zIndex:1,
        boxShadow:'0 24px 64px rgba(0,0,0,0.4)',
        animation:'fadeUp 0.5s ease both',
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ marginBottom:12 }}>
            <img src={LOGO_URL} alt="ParkFinder"
              style={{ height:48, width:'auto', objectFit:'contain' }}
              onError={e => { e.target.style.display='none' }}
            />
          </div>
          <h1 style={{ fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:4 }}>
            Selamat Datang, <span style={{ background:'linear-gradient(90deg,var(--accent),var(--accent2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {mode === 'admin' ? 'Admin' : 'Staff'}
            </span>
          </h1>
          <p style={{ fontSize:13, color:'var(--text3)' }}>Masuk ke panel monitoring ParkFinder</p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display:'flex', background:'var(--bg-base)', border:'1px solid var(--border)',
          borderRadius:12, padding:4, marginBottom:24, gap:4,
        }}>
          {[['admin','🛡️  Admin','Akses penuh sistem'],['staff','👷  Staff Gedung','Monitoring 1 gedung']].map(([r, label, sub]) => (
            <button key={r} type="button" onClick={() => switchMode(r)} style={{
              flex:1, padding:'10px 8px', borderRadius:9, border:'none', cursor:'pointer',
              background: mode === r ? 'var(--bg-card)' : 'transparent',
              boxShadow: mode === r ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
              transition:'all 0.2s', textAlign:'center',
            }}>
              <div style={{ fontSize:13, fontWeight:700, color: mode === r ? 'var(--accent)' : 'var(--text3)' }}>{label}</div>
              <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{sub}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Admin: Email input */}
          {mode === 'admin' && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:7 }}>Email Admin</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:15 }}>✉️</span>
                <input className="input" type="email" placeholder="admin@parkfinder.id"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft:38 }} autoComplete="email"
                />
              </div>
            </div>
          )}

          {/* Staff: Pilih Gedung dropdown */}
          {mode === 'staff' && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:7 }}>Pilih Gedung</label>
              <select
                className="input"
                value={staffId}
                onChange={e => { setStaffId(e.target.value); setError('') }}
                style={{ cursor:'pointer' }}
              >
                <option value="">-- Pilih gedung tugas Anda --</option>
                {STAFF_ACCOUNTS.map(s => (
                  <option key={s.id} value={s.id}>
                    🏢 {s.parkingName} — {s.name}
                  </option>
                ))}
              </select>

              {/* Staff info card */}
              {selectedStaff && (
                <div style={{
                  marginTop:10, padding:'10px 14px',
                  background:'var(--accent-glow)', border:'1px solid var(--border2)',
                  borderRadius:10, display:'flex', alignItems:'center', gap:10,
                }}>
                  <div style={{
                    width:36, height:36, borderRadius:'50%', flexShrink:0,
                    background:'linear-gradient(135deg, var(--accent), var(--accent2))',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, fontWeight:800, color:'var(--bg-base)',
                  }}>
                    {selectedStaff.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{selectedStaff.name}</div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>Staff · {selectedStaff.parkingName}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom:8 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:7 }}>Password</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:15 }}>🔒</span>
              <input className="input" type={showPass ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft:38, paddingRight:42 }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', fontSize:15, lineHeight:1, padding:2,
              }}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          {/* Demo hint */}
          <div style={{
            background:'var(--bg-hover)', border:'1px solid var(--border)',
            borderRadius:8, padding:'8px 12px', marginBottom: error ? 10 : 18,
            fontSize:11, color:'var(--text3)',
          }}>
            {mode === 'admin'
              ? <>🛡️ <strong style={{ color:'var(--text2)' }}>Admin:</strong> admin@parkfinder.id · <code style={{ color:'var(--accent)' }}>admin123</code></>
              : <>👷 <strong style={{ color:'var(--text2)' }}>Staff:</strong> pilih gedung di atas · password: <code style={{ color:'var(--accent)' }}>staff123</code></>
            }
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)',
              borderRadius:10, padding:'10px 14px', fontSize:13, color:'var(--red)',
              marginBottom:14,
            }}>⚠️ {error}</div>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{
            width:'100%', justifyContent:'center', padding:'12px', fontSize:15, borderRadius:12,
          }}>
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.3)', borderTopColor:'#000', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />
                Memverifikasi...
              </span>
            ) : mode === 'admin' ? '🚀 Masuk sebagai Admin' : '🏢 Masuk sebagai Staff'}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:12, color:'var(--text3)', marginTop:20 }}>
          © 2026 ParkFinder · Hanya untuk akses internal
        </p>
      </div>
    </div>
  )
}
