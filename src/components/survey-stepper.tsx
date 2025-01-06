// import Link from 'next/link';
import { db } from '@/lib/db';
import { getSessionCookie } from '../lib/cookies';

// need the number of questions ✅
// need the url to determine current question ✅
// need to know which questions have been answered (diff color)

type SurveyStepperProps = {
  surveyId: number;
  questionId: number;
};

export default async function SurveyStepper(props: SurveyStepperProps) {
  const surveyQuestions = db
    .prepare('SELECT id FROM Questions WHERE survey_id = ?')
    .all(props.surveyId) as { id: number }[];

  const userId = await getSessionCookie();
  // get all the questions that have been answered by the user
  const answeredQuestions = db
    .prepare(
      'SELECT question_id FROM Responses WHERE user_id = ?'
    )
    .all(userId) as { question_id: number }[];

  return (
    <ul className="steps">
      <li className="step step-primary"></li>
      <li className="step step-primary"></li>
      <li className="step"></li>
      <li className="step"></li>
    </ul>
  );
}
