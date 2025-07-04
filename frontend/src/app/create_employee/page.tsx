// src/app/create_employee/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import SignUpForm from '../../components/SignupForm';

export default function CreateEmployeePage() {
  const router = useRouter();

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        Create Employee
      </h2>

      <SignUpForm
        mode="create"
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}
