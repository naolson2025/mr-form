// components/SurveyLandingContent.tsx (Client Component)
'use client';

import Form from 'next/form';
import { startSurvey } from '@/app/actions';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function SurveyLandingContent() {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      const result = await startSurvey();
      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectUrl) {
        router.push(result.redirectUrl);
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Error starting survey:', err);
      setError('Failed to start survey. Please try again later.');
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Welcome to the Survey!</h1>
      <p className="py-6">
        Thank you for taking the time to provide us with your valuable feedback.
        Your input helps us improve our products and services.
      </p>
      {error && (
        <div className="alert alert-error mb-4">
          <AlertTriangle className="stroke-current shrink-0 h-6 w-6" />
          <span>{error}</span>
        </div>
      )}
      <Form action={handleSubmit}>
        <button
          type="submit"
          className={`btn btn-primary ${pending ? 'loading text-neutral' : ''}`}
          disabled={pending}
        >
          Start Survey
        </button>
      </Form>
    </div>
  );
}
