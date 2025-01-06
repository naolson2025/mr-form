// import Link from 'next/link';
import { db } from '@/lib/db';

// need the number of questions
// need the url to determine current question
// need to know which questions have been answered (diff color)

type SurveyStepperProps = {
  surveyId: number;
  questionId: number;
};

export default function SurveyStepper(props: SurveyStepperProps) {
  const numberOfQuestions = db
    .prepare('SELECT COUNT(*) FROM Questions WHERE survey_id = ?')
    .get(props.surveyId) as { 'COUNT(*)': number };

  console.log(numberOfQuestions);

  return (
    <ul className="steps">
      <li className="step step-primary">Register</li>
      <li className="step step-primary">Choose plan</li>
      <li className="step">Purchase</li>
      <li className="step">Receive Product</li>
    </ul>
  );
}
