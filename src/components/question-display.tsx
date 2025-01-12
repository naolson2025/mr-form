'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitResponse } from '@/app/actions';
import { TriangleAlert } from 'lucide-react';
import Form from 'next/form';
import MultipleChoiceEmotion from './multiple-choice-emotion';
import Range from './range';
import { MultipleChoiceOptions, RangeOptions } from '../lib/db';

interface Question {
  id: number;
  text: string;
  type: string;
  options: MultipleChoiceOptions[] | RangeOptions;
}

interface Props {
  question: Question;
  existingResponse?: { response: string };
}

export default function QuestionDisplay({ question, existingResponse }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>(
    existingResponse?.response || ''
  );

  const handleSubmit = async () => {
    setError(null);
    try {
      const result = await submitResponse(question.id, response);
      setLoading(false);

      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectUrl) {
        router.push(result.redirectUrl);
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Error submitting response:', err);
      setLoading(false);
      setError('Failed to submit response. Please try again later.');
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        <h2 className="card-title">{question.text}</h2>

        {error && (
          <div role="alert" className="alert alert-error flex">
            <TriangleAlert />
            <span>{error}</span>
          </div>
        )}

        <Form action={handleSubmit}>
          {question.type === 'multiple-choice-emotion' &&
            Array.isArray(question.options) && (
              <MultipleChoiceEmotion
                question={{ ...question, options: question.options }}
                response={response}
                setResponse={setResponse}
              />
            )}

          {question.type === 'multiple-choice' &&
            Array.isArray(question.options) && (
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

          {question.type === 'range' && !Array.isArray(question.options) && (
            <Range
              options={question.options}
              response={response}
              setResponse={setResponse}
            />
          )}

          <div className="card-actions justify-end mt-4">
            <button
              type="submit"
              className={`btn btn-primary ${
                loading ? 'loading text-accent' : ''
              }`}
              disabled={!response}
              onClick={() => setLoading(true)}
            >
              Next
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
