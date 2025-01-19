import { cn } from '@/lib/utils';

type MultipleChoiceEmotionProps = {
  question: {
    options: {
      value: string;
      label: string;
    }[];
  };
  response: string;
  setResponse: (response: string) => void;
};

export default function MultipleChoiceEmotion(
  props: MultipleChoiceEmotionProps
) {
  const { question, response, setResponse } = props;

  return (
    <div className="flex flex-row justify-around">
      {question.options.map((option) => (
        <div className="flex items-center mb-2" key={option.value}>
          <input
            type="radio"
            id={option.value}
            name="response"
            value={option.value}
            className="hidden"
            required
            checked={response === option.value}
            onChange={() => setResponse(option.value)}
          />
          <label
            htmlFor={option.value}
            className={cn(['btn px-3', response === option.value && 'btn-primary'])}
          >
            <span className="text-2xl">{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
