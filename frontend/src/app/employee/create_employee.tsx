import SignupForm from '../../components/SignupForm';

export default function CreateEmployeePage() {
  return (
    <SignupForm
      title="Create Employee"
      buttonLabel="Create"
      submitUrl="http://localhost:3001/auth/signup" // or a custom URL if needed
    />
  );
}
