import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProfileHeader from '../components/pages/ProfilePage/ProfileHeader';
import ProfileCard from '../components/pages/ProfilePage/ProfileCard';
import PasswordCard from '../components/pages/ProfilePage/PasswordCard';

export default function ProfilePage() {
  const { user, logout, profilePhoto, updateProfilePhoto, removeProfilePhoto, changeAdminPassword } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMsg, setPhotoMsg] = useState('');

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setPhotoMsg('⚠ Ukuran file maksimal 2MB'); return; }
    if (!file.type.startsWith('image/')) { setPhotoMsg('⚠ File harus berupa gambar'); return; }
    setPhotoLoading(true); setPhotoMsg('');
    const reader = new FileReader();
    reader.onload = ev => {
      updateProfilePhoto(ev.target.result);
      setPhotoLoading(false); setPhotoMsg('✅ Foto profil berhasil diperbarui!');
      setTimeout(() => setPhotoMsg(''), 3000);
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => { removeProfilePhoto(); setPhotoMsg('✅ Foto profil dihapus'); setTimeout(() => setPhotoMsg(''), 2500); };

  const handlePasswordSubmit = async e => {
    e.preventDefault(); setPwError('');
    if (!pwForm.current) { setPwError('Masukkan password saat ini'); return; }
    if (pwForm.newPw.length < 6) { setPwError('Password baru minimal 6 karakter'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Konfirmasi password tidak cocok'); return; }
    setPwLoading(true); await new Promise(r => setTimeout(r, 700));
    const result = changeAdminPassword(pwForm.current, pwForm.newPw);
    setPwLoading(false);
    if (!result.ok) { setPwError(result.msg); return; }
    setPwSuccess(true); setPwForm({ current: '', newPw: '', confirm: '' }); setTimeout(() => setPwSuccess(false), 4000);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <ProfileHeader logout={logout} navigate={navigate} />
      <ProfileCard 
        user={user} profilePhoto={profilePhoto} photoLoading={photoLoading} photoMsg={photoMsg} 
        fileRef={fileRef} handlePhotoChange={handlePhotoChange} handleRemovePhoto={handleRemovePhoto} 
      />
      <PasswordCard 
        pwForm={pwForm} setPwForm={setPwForm} showPw={showPw} setShowPw={setShowPw} 
        pwError={pwError} setPwError={setPwError} pwSuccess={pwSuccess} pwLoading={pwLoading} 
        handlePasswordSubmit={handlePasswordSubmit} 
      />
    </div>
  );
}