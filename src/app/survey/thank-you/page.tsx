'use client';

import { Bitcoin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ThankYouPage() {
  const [showCoin, setShowCoin] = useState(false);

  const handleClick = () => {
    setShowCoin(true);
    setTimeout(() => {
      setShowCoin(false); // Hide the coin after the animation
    }, 500); // Match the duration of the animation
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Thank You!</h1>
          <p className="py-6">
            Thank you for completing the survey. I don&apos;t care about your
            feedback, but the marketing department might.
          </p>
          <div className="relative">
            <button className="btn btn-primary" onClick={handleClick}>
              <Bitcoin size={24} />
              Click for Bitcoin
            </button>
            {showCoin && (
              <div className="coin-animation">
                <Image
                  src="/gold_coin.png"
                  alt="gold coin"
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
