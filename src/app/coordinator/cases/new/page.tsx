import NewCaseForm from '@/components/coordinator/cases/NewCaseForm';

export default function NewCasePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Case</h1>
        <p className="text-gray-600">Fill in the details to create a new case</p>
      </div>
      
      <NewCaseForm />
    </div>
  );
} 