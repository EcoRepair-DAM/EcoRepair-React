export default function StatusMessage({
  loading,
  error,
  empty,
}: {
  loading?: boolean;
  error?: string;
  empty?: boolean;
}) {
  if (loading) return <p className="text-secondary fw-semibold">Loading data...</p>;
  if (error) return <p className="alert alert-danger fw-semibold">{error}</p>;
  if (empty) return <p className="text-secondary fw-semibold">No data found.</p>;
  return null;
}
