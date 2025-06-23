import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Employe Portal</h1>
      <div style={{ marginTop: '40px' }}>
        <Link href="/login">
          <button style={buttonStyle}>Login</button>
        </Link>
        <Link href="/signup">
          <button style={buttonStyle}>Signup</button>
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: '0 10px',
  padding: '12px 20px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  cursor: 'pointer',
};
