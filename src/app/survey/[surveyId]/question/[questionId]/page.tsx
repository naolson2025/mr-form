import { db } from '@/app/db';
import QuestionDisplay from '@/components/question-display';
import { notFound } from 'next/navigation';

interface Params {
  surveyId: string;
  questionId: string;
}

export default async function QuestionPage({ params }: { params: Params }) {
  const questionId = parseInt(params.questionId, 10);

  const question = db.prepare('SELECT * FROM Questions WHERE id = ?').get(questionId) as {
    id: number;
    text: string;
    type: string;
    options: string | null;
  } | undefined;

  if (!question) {
    notFound();
  }

  const parsedOptions = question.options ? JSON.parse(question.options) : null;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Question Time!</h1>
          <p className="py-6">Please Answer the following question</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <QuestionDisplay question={{ ...question, options: parsedOptions }} />
        </div>
      </div>
    </div>
  );
}
