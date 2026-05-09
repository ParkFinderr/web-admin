export default function SwapsSummary({ total, success, failed, pending }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
      {[
        { label: 'Total Swap', value: total, color: 'var(--text)' },
        { label: 'Berhasil', value: success, color: 'var(--green)' },
        { label: 'Gagal', value: failed, color: 'var(--red)' },
        { label: 'Pending', value: pending, color: 'var(--orange)' }
      ].map((s, i) => (
        <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}