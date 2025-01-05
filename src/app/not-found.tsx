import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-8xl font-bold text-error">404</h1>
          <p className="py-6 text-2xl">Page Not Found</p>
          <p className="mb-8">
            The page you are looking for does not exist. It may have been moved,
            renamed, or never existed.
          </p>
          <Link href="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}