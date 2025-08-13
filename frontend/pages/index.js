import Link from 'next/link';
import FeedbackForm from '../components/FeedbackForm';

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <h1>Feedback Collection</h1>
        <Link href="/admin" className="badge">Admin</Link>
      </div>
      <p>Submit your feedback using the form below.</p>
      <FeedbackForm />
    </div>
  );
}
