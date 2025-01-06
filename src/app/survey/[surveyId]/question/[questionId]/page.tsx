import { db } from '@/lib/db';
import QuestionDisplay from '@/components/question-display';
import { notFound } from 'next/navigation';
import SurveyStepper from '@/components/survey-stepper';

interface Params {
  surveyId: string;
  questionId: string;
}

export default async function QuestionPage({ params }: { params: Params }) {
  // need to await params, its a next.js 15 feature
  const { questionId, surveyId } = await params;
  const parsedQuestionId = parseInt(questionId, 10);
  const parsedSurveyId = parseInt(surveyId, 10);

  const question = db
    .prepare('SELECT * FROM Questions WHERE id = ?')
    .get(parsedQuestionId) as
    | {
        id: number;
        text: string;
        type: string;
        options: string | null;
      }
    | undefined;

  if (!question) {
    notFound();
  }

  const parsedOptions = question.options ? JSON.parse(question.options) : null;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <SurveyStepper
          questionId={parsedQuestionId}
          surveyId={parsedSurveyId}
        />
        <div className="text-center">
          <h1 className="text-5xl font-bold">Question Time!</h1>
          <p className="py-6">Please Answer the following questions:</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <QuestionDisplay
            question={{ ...question, options: parsedOptions }}
          />
        </div>
      </div>
    </div>
  );
}
