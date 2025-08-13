import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this feedback?')) return;
    const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Delete failed');
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Admin — Feedback List</h1>
        <Link href="/">← Back</Link>
      </div>

      {loading ? <p>Loading…</p> : (
        items.length === 0 ? <p>No feedback yet.</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><span className="badge">{new Date(item.createdAt).toLocaleString()}</span></td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.message}</td>
                  <td>
                    <button onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
