// utils/fetchSnapshotCount.js
export async function fetchSnapshotCount() {
  const res = await fetch('/api/snapshots/count');
  if (!res.ok) throw new Error('Failed to fetch snapshot count');
  const data = await res.json();
  return data.count;
}

