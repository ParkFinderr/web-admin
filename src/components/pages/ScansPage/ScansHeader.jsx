export default function ScansHeader() {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">📡 Log Scan QR</h1>
        <p className="page-sub">Riwayat semua aktivitas scan tiket parkir secara real-time</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost">Export Log</button>
      </div>
    </div>
  );
}