'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignUpForm from '../../../components/SignupForm';

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  // Extract ID safely from dynamic route
  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no ID in URL, redirect
    if (!id) {
      console.warn('No employee ID in URL. Redirecting...');
      router.push('/');
      return;
    }

    const fetchEmployee = async () => {
      try {
        console.log('Fetching employee with ID:', id);
        const res = await fetch(`http://localhost:3001/auth/employees/${id}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        console.log('Fetched employee data:', data);

        if (data?.id) {
          setEmployeeData({
            id: data.id,
            name: data.employeeName,
            email: data.email,
            phone: data.phone,
            designation: data.designation,
            departmentId: data.department?.id ?? data.departmentId,
          });
        } else {
          console.warn('Invalid employee data:', data);
          setEmployeeData(null);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setEmployeeData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]); 

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!employeeData) {
    return <div style={{ padding: '2rem' }}>Employee not found.</div>;
  }

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Edit Employee
      </h2>

      <SignUpForm
        mode="edit"
        employeeData={employeeData}
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}
