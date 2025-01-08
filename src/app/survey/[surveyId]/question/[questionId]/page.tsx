import { getDbConnection } from '@/lib/db';
import QuestionDisplay from '@/components/question-display';
import { notFound } from 'next/navigation';
import SurveyStepper from '@/components/survey-stepper';
import { getSessionCookie } from '@/lib/cookies';

interface Params {
  surveyId: string;
  questionId: string;
}

export default async function QuestionPage({ params }: { params: Params }) {
  const db = await getDbConnection();
  // need to await params, its a next.js 15 feature
  const { questionId, surveyId } = await params;
  const parsedQuestionId = parseInt(questionId, 10);
  const parsedSurveyId = parseInt(surveyId, 10);
  const userId = await getSessionCookie();

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

  const existingQuestionResp = db
    .prepare('SELECT response FROM Responses WHERE user_id = ? AND question_id = ?')
    .get(userId, parsedQuestionId) as { response: string } | undefined;

  if (!question) {
    notFound();
  }

  const parsedOptions = question.options ? JSON.parse(question.options) : null;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col space-y-4">
        <SurveyStepper
          questionId={parsedQuestionId}
          surveyId={parsedSurveyId}
        />
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <QuestionDisplay
            question={{ ...question, options: parsedOptions }}
            existingResponse={existingQuestionResp}
          />
        </div>
      </div>
    </div>
  );
}
