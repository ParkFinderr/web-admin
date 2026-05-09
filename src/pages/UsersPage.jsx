import { useState } from 'react';
import { USERS } from '../data/mockData';
import UsersHeader from '../components/pages/UsersPage/UsersHeader';
import UsersSummary from '../components/pages/UsersPage/UsersSummary';
import UsersInfoBox from '../components/pages/UsersPage/UsersInfoBox';
import UsersFilter from '../components/pages/UsersPage/UsersFilter';
import UsersTable from '../components/pages/UsersPage/UsersTable';
import UserDetailModal from '../components/pages/UsersPage/UserDetailModal';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatform] = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const guestCount = USERS.filter(u => u.platform === 'web').length;
  const activeCount = USERS.filter(u => u.status === 'active').length;
  const inactiveCount = USERS.filter(u => u.status !== 'active').length;
  const mobileCount = USERS.filter(u => u.platform === 'mobile').length;

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q) || u.plate?.toLowerCase().includes(q) || u.id?.toLowerCase().includes(q);
    const matchPlatform = platformFilter === 'all' || u.platform === platformFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchPlatform && matchStatus;
  });

  const isGuest = u => u.platform === 'web';

  return (
    <div>
      <UsersHeader />
      <UsersSummary 
        total={USERS.length} active={activeCount} inactive={inactiveCount} 
        mobile={mobileCount} guest={guestCount} 
      />
      <UsersInfoBox />
      <UsersFilter 
        search={search} setSearch={setSearch} 
        platformFilter={platformFilter} setPlatform={setPlatform} 
        statusFilter={statusFilter} setStatus={setStatus} 
      />
      <UsersTable filtered={filtered} isGuest={isGuest} setSelectedUser={setSelectedUser} />
      <UserDetailModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} isGuest={isGuest} />
    </div>
  );
}