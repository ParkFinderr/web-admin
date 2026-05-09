import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Lock, Eye, EyeOff, Save, Trash2, LogOut, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Avatar from '../components/Avatar'

export default function ProfilePage() {
  const { user, logout, profilePhoto, updateProfilePhoto, removeProfilePhoto, changeAdminPassword } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef()

  // Password form state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw]   = useState({ current: false, newPw: false, confirm: false })
  const [pwError, setPwError]  = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  // Photo state
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoMsg, setPhotoMsg]         = useState('')

  // ── Photo upload ──────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setPhotoMsg('⚠ Ukuran file maksimal 2MB'); return }
    if (!file.type.startsWith('image/')) { setPhotoMsg('⚠ File harus berupa gambar'); return }
    setPhotoLoading(true)
    setPhotoMsg('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateProfilePhoto(ev.target.result)
      setPhotoLoading(false)
      setPhotoMsg('✅ Foto profil berhasil diperbarui!')
      setTimeout(() => setPhotoMsg(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    removeProfilePhoto()
    setPhotoMsg('✅ Foto profil dihapus')
    setTimeout(() => setPhotoMsg(''), 2500)
  }

  // ── Password change ───────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPwError('')
    if (!pwForm.current) { setPwError('Masukkan password saat ini'); return }
    if (pwForm.newPw.length < 6) { setPwError('Password baru minimal 6 karakter'); return }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Konfirmasi password tidak cocok'); return }
    setPwLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = changeAdminPassword(pwForm.current, pwForm.newPw)
    setPwLoading(false)
    if (!result.ok) { setPwError(result.msg); return }
    setPwSuccess(true)
    setPwForm({ current: '', newPw: '', confirm: '' })
    setTimeout(() => setPwSuccess(false), 4000)
  }

  const ToggleEye = ({ field }) => (
    <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: '0 6px' }}>
      {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  )

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">👤 Profil & Keamanan</h1>
          <p className="page-sub">Kelola foto profil dan keamanan akun admin</p>
        </div>
        <button className="btn btn-ghost" onClick={() => { logout(); navigate('/login') }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* ── Profile Card ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">🖼️ Foto Profil</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar preview */}
            <div style={{ position: 'relative' }}>
              <Avatar size={96} fontSize={32} />
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--accent)', border: '2px solid var(--bg-card)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000',
                }}
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Info & actions */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>{user?.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <ShieldCheck size={14} color="var(--accent)" />
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>Super Admin</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => fileRef.current?.click()} disabled={photoLoading}>
                  <Camera size={13} /> {photoLoading ? 'Mengupload...' : 'Upload Foto'}
                </button>
                {profilePhoto && (
                  <button className="btn btn-ghost btn-sm" onClick={handleRemovePhoto}
                    style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}>
                    <Trash2 size={13} /> Hapus Foto
                  </button>
                )}
              </div>
              {photoMsg && (
                <div style={{ marginTop: 10, fontSize: 12, color: photoMsg.startsWith('✅') ? 'var(--green)' : 'var(--orange)' }}>
                  {photoMsg}
                </div>
              )}
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

          {/* Photo guidelines */}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 10, fontSize: 12, color: 'var(--text3)' }}>
            💡 Format yang didukung: JPG, PNG, WebP · Ukuran maksimal: <strong>2MB</strong> · Rasio ideal: <strong>1:1 (persegi)</strong>
          </div>
        </div>
      </div>

      {/* ── Change Password Card ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🔐 Ubah Password Admin</span>
          <span className="badge badge-orange">Keamanan</span>
        </div>
        <div className="card-body">
          {pwSuccess && (
            <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, marginBottom: 20, fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
              ✅ Password berhasil diubah! Gunakan password baru untuk login berikutnya.
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            {/* Current password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>
                Password Saat Ini *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
                <input
                  type={showPw.current ? 'text' : 'password'}
                  className="input" placeholder="Masukkan password saat ini"
                  value={pwForm.current} onChange={e => { setPwForm(p => ({ ...p, current: e.target.value })); setPwError('') }}
                  style={{ border: 'none', boxShadow: 'none', flex: 1 }}
                />
                <ToggleEye field="current" />
              </div>
            </div>

            {/* New password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>
                Password Baru * <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(min. 6 karakter)</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: `1px solid ${pwForm.newPw && pwForm.newPw.length < 6 ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
                <input
                  type={showPw.newPw ? 'text' : 'password'}
                  className="input" placeholder="Password baru"
                  value={pwForm.newPw} onChange={e => { setPwForm(p => ({ ...p, newPw: e.target.value })); setPwError('') }}
                  style={{ border: 'none', boxShadow: 'none', flex: 1 }}
                />
                <ToggleEye field="newPw" />
              </div>
              {/* Strength bar */}
              {pwForm.newPw && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99, transition: 'width .3s',
                      width: pwForm.newPw.length >= 12 ? '100%' : pwForm.newPw.length >= 8 ? '66%' : pwForm.newPw.length >= 6 ? '33%' : '10%',
                      background: pwForm.newPw.length >= 12 ? 'var(--green)' : pwForm.newPw.length >= 8 ? 'var(--orange)' : 'var(--red)',
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                    Kekuatan: {pwForm.newPw.length >= 12 ? '💪 Kuat' : pwForm.newPw.length >= 8 ? '👍 Sedang' : '⚠️ Lemah'}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>
                Konfirmasi Password Baru *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: `1px solid ${pwForm.confirm && pwForm.confirm !== pwForm.newPw ? 'var(--red)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <Lock size={14} style={{ marginLeft: 12, color: 'var(--text3)', flexShrink: 0 }} />
                <input
                  type={showPw.confirm ? 'text' : 'password'}
                  className="input" placeholder="Ulangi password baru"
                  value={pwForm.confirm} onChange={e => { setPwForm(p => ({ ...p, confirm: e.target.value })); setPwError('') }}
                  style={{ border: 'none', boxShadow: 'none', flex: 1 }}
                />
                <ToggleEye field="confirm" />
              </div>
              {pwForm.confirm && pwForm.confirm !== pwForm.newPw && (
                <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>⚠ Password tidak cocok</div>
              )}
            </div>

            {pwError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: 'var(--red)' }}>
                ⚠ {pwError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
              {pwLoading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 15, height: 15, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Menyimpan...</span>
                : <><Save size={15} /> Simpan Password Baru</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
