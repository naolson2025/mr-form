'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { submitResponse } from '@/app/actions';
import { TriangleAlert } from 'lucide-react';
import Form from 'next/form';
import MultipleChoiceEmotion from './multiple-choice-emotion';

interface Question {
  id: number;
  text: string;
  type: string;
  options: { value: string; label: string }[] | null;
}

interface Props {
  question: Question;
  existingResponse?: { response: string };
}

export default function QuestionDisplay({ question, existingResponse }: Props) {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>(
    existingResponse?.response || ''
  );

  const handleSubmit = async () => {
    setError(null);
    try {
      const result = await submitResponse(question.id, response);

      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectUrl) {
        router.push(result.redirectUrl);
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response. Please try again later.');
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        <h2 className="card-title">{question.text}</h2>

        {error && (
          <div className="alert alert-error mb-4">
            <TriangleAlert className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <Form action={handleSubmit}>
          {question.type === 'multiple-choice-emotion' && question.options && (
            <MultipleChoiceEmotion
              question={{ ...question, options: question.options }}
              response={response}
              setResponse={setResponse}
            />
          )}

          {question.type === 'multiple-choice' && question.options && (
            <div className="form-control">
              {question.options.map((option) => (
                <div className="flex items-center mb-2" key={option.value}>
                  <input
                    type="radio"
                    id={option.value}
                    name="response"
                    value={option.value}
                    className="radio mr-2"
                    required
                    checked={response === option.value}
                    onChange={() => setResponse(option.value)}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <input
              type="text"
              name="response"
              placeholder="Your answer"
              className="input input-bordered w-full"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
          )}

          <div className="card-actions justify-end mt-4">
            <button
              type="submit"
              className={`btn btn-primary ${pending ? 'loading' : ''}`}
              disabled={pending}
            >
              Next
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
