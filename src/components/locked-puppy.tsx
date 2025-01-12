import { LockKeyhole } from 'lucide-react';
import Image from 'next/image';

type LockedPuppyProps = {
  response: string;
};

export default function LockedPuppy(props: LockedPuppyProps) {
  if (props.response) {
    return (
      <div className="card w-full bg-gray-300 shadow-2xl">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg text-center">
            🎉 You unlocked a fugly puppy! 🎉
          </h2>
          <p>It wasn&apos;t worth it was it...</p>
        </div>
        <figure>
          <Image
            src="/dog.jpg"
            alt="Picture of an ugly dog"
            width={500}
            height={500}
          />
        </figure>
      </div>
    );
  }

  return (
    <div className="card w-full bg-gray-300 shadow-2xl motion-preset-seesaw">
      <div className="card-body space-y-4">
        <h2 className="card-title text-lg text-center">
          Answer the question to unlock the puppy picture 😱
        </h2>
        <div className="flex justify-center">
          <LockKeyhole className="motion-preset-oscillate text-black" />
        </div>
      </div>
    </div>
  );
}
