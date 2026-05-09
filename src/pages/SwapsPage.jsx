import { useState } from 'react';
import { SWAP_LOGS } from '../data/mockData';
import SwapsHeader from '../components/pages/SwapsPage/SwapsHeader';
import SwapsSummary from '../components/pages/SwapsPage/SwapsSummary';
import SwapsFilter from '../components/pages/SwapsPage/SwapsFilter';
import SwapsTable from '../components/pages/SwapsPage/SwapsTable';
import SwapsInfo from '../components/pages/SwapsPage/SwapsInfo';

const MORE_SWAPS = [
  { id: 'SWP-004', ticketOld: 'PKF-B7E3A2C1', ticketNew: 'PKF-SW-ABCD04', userName: 'Siti Rahayu', plate: 'BE 5678 CD', fromParking: 'Mall Boemi Kedaton', fromSlot: 'B1/B1-04', toParking: 'Mall Boemi Kedaton', toSlot: 'L1/A05', swapTime: '2026-05-08T09:30:00Z', status: 'success' },
  { id: 'SWP-005', ticketOld: 'PKF-E4B6E5G4', ticketNew: null, userName: 'Eko Prasetyo', plate: 'BE 7890 IJ', fromParking: 'Stasiun Tanjungkarang', fromSlot: 'L1/A08', toParking: 'Stasiun Tanjungkarang', toSlot: 'L1/A03', swapTime: '2026-05-08T10:10:00Z', status: 'pending' }
];
const ALL_SWAPS = [...SWAP_LOGS, ...MORE_SWAPS].sort((a, b) => new Date(b.swapTime) - new Date(a.swapTime));

export default function SwapsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = ALL_SWAPS.filter(s => {
    const matchSearch = s.userName.toLowerCase().includes(search.toLowerCase()) || s.ticketOld.toLowerCase().includes(search.toLowerCase()) || s.plate.toLowerCase().includes(search.toLowerCase()) || s.fromParking.toLowerCase().includes(search.toLowerCase()) || s.toParking.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <SwapsHeader />
      <SwapsSummary 
        total={ALL_SWAPS.length} 
        success={ALL_SWAPS.filter(s => s.status === 'success').length} 
        failed={ALL_SWAPS.filter(s => s.status === 'failed').length} 
        pending={ALL_SWAPS.filter(s => s.status === 'pending').length} 
      />
      <SwapsFilter search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <SwapsTable filtered={filtered} />
      <SwapsInfo />
    </div>
  );
}