'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from '../../components/SignupForm';

export default function SignUpPage() {
  const router = useRouter();
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const editData = localStorage.getItem('editEmployee');
    if (editData) {
      const parsed = JSON.parse(editData);
      setEmployeeData(parsed);
      localStorage.removeItem('editEmployee');
    }
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {employeeData ? 'Edit Employee' : 'Create Employee'}
      </h2>
      <SignUpForm
        mode={employeeData ? 'edit' : 'create'}
        employeeData={employeeData}
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}
