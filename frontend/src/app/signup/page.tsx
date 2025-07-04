'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SignUpForm from '../../components/SignupForm';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    if (mode === 'edit') {
      const data = localStorage.getItem('editEmployee');
      if (data) {
        setEmployeeData(JSON.parse(data));
        localStorage.removeItem('editEmployee');
      }
    }
  }, [mode]);

  return (
    <div>
      <h1>{mode === 'edit' ? 'Edit Employee' : 'Create Employee'}</h1>
      <SignUpForm
        mode={mode}
        employeeData={employeeData}
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}
