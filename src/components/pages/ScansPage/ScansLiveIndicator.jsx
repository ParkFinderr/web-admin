export default function ScansLiveIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius)', marginBottom: 16, fontSize: 13, color: 'var(--green)' }}>
      <span className="status-dot status-dot-green" />
      Monitoring aktif — Data scan diperbarui secara real-time
    </div>
  );
}