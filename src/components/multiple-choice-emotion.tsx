'use client';

import Form from 'next/form';
import { submitResponse } from '../app/actions';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type MultipleChoiceProps = {
  question: {
    id: number;
    text: string;
    type: string;
    options: { value: string; label: string }[];
  };
  existingResponse?: { response: string };
};

export default function MultipleChoiceEmotion(props: MultipleChoiceProps) {
  const { pending } = useFormStatus();
  const [selected, setSelected] = useState<string | null>(
    props.existingResponse?.response || null
  );

  const handleSubmit = async () => {
    if (!selected) {
      return;
    }
    try {
      await submitResponse(props.question.id, selected);
    } catch (err) {
      console.error('Error submitting response:', err);
      toast.error('Failed to submit. Please try again.');
    }
  };

  return (
    <>
      <Form action={handleSubmit} className="flex flex-col">
        <div className="flex flex-row">
          {props.question.options.map((option) => (
            <div className="flexitems-center mb-2" key={option.value}>
              <input
                type="radio"
                id={option.value}
                name="response"
                value={option.value}
                className="hidden"
                required
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
              />
              <label
                htmlFor={option.value}
                className={`cursor-pointer p-2 rounded-lg ${
                  selected === option.value
                    ? 'bg-blue-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{option.label}</span>
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${pending ? 'loading' : ''}`}
          disabled={pending || !selected}
        >
          Submit
        </button>
      </Form>
      <Toaster position="top-center" />
    </>
  );
}
