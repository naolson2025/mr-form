import { RangeOptions } from '../lib/db';

type RangeProps = {
  options: RangeOptions;
  response: string;
  setResponse: (response: string) => void;
};

export default function Range(props: RangeProps) {
  const { options, response, setResponse } = props;

  const calculateFill = () => {
    const value = parseInt(response, 10);
    const percentage =
      ((value - options.min) / (options.max - options.min)) * 100;
    return Math.min(100, Math.max(0, percentage)); // Ensure between 0-100
  };

  return (
    <div className="">
      {/* Battery Icon */}
      <div className='flex mb-4 justify-center'>
        <div className="relative w-12 h-6 border-2 border-gray-400 rounded flex items-center">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${calculateFill()}%` }}
          ></div>
          {/* Battery Cap */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-3 bg-gray-400"></div>
        </div>
      </div>

      {/* Range Slider */}
      <input
        type="range"
        min={options.min}
        max={options.max}
        value={response}
        className="range range-primary"
        step={options.step}
        name="response"
        onChange={(e) => setResponse(e.target.value)}
      />
      <div className="flex w-full justify-between px-2 text-xs">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
    </div>
  );
}
