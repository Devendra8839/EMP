'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('employee');
    if (stored) {
      setEmployee(JSON.parse(stored));
    } else {
      window.location.href = '/login'; // or use next/router if needed
    }
  }, []);

  return (
    <div>
      <nav style={styles.nav}>
        <span>Welcome, {employee?.employeeName}</span>
        <button style={styles.button} onClick={() => alert('Go to Create Department')}>
          Create Department
        </button>
      </nav>
      <main style={styles.main}>
        <h1>Home Page</h1>
        <p>This is a protected page after login.</p>
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#222',
    color: '#fff',
  },
  button: {
    padding: '10px',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  main: {
    padding: '40px',
    textAlign: 'center',
  },
};
