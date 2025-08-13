import { useState } from 'react';

export default function FeedbackForm({ onSubmitted }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to submit feedback');
      }
      setForm({ name: '', email: '', message: '' });
      onSubmitted?.();
      alert('Thanks! Your feedback has been submitted.');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <label>Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <label>Message</label>
      <textarea
        rows="5"
        placeholder="Share your thoughts…"
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
