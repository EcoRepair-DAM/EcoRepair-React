export default function StatusMessage({
  loading,
  error,
  empty,
}: {
  loading?: boolean;
  error?: string;
  empty?: boolean;
}) {
  if (loading) return <p className="status-text">Loading data...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (empty) return <p className="status-text">No data found.</p>;
  return null;
}