import { Bitcoin } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Thank You!</h1>
          <p className="py-6">
            Thank you for completing the survey. Your feedback is greatly
            appreciated.
          </p>
          <button className="btn btn-primary">
            <Bitcoin size={24} />
            Click for Bitcoin
          </button>
        </div>
      </div>
    </div>
  );
}
