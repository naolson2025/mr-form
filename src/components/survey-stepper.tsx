import { getSessionCookie } from '../lib/cookies';
import Link from 'next/link';
import { getDbConnection } from '../lib/db';

type SurveyStepperProps = {
  surveyId: number;
  questionId: number;
};

export default async function SurveyStepper(props: SurveyStepperProps) {
  const db = await getDbConnection();

  const surveyQuestions = db
    .prepare('SELECT id FROM Questions WHERE survey_id = ?')
    .all(props.surveyId) as { id: number }[];

  const userId = await getSessionCookie();

  const answeredQuestions = db
    .prepare('SELECT question_id FROM Responses WHERE user_id = ?')
    .all(userId) as { question_id: number }[];

  const stepperArray = surveyQuestions.map((question) => {
    if (
      answeredQuestions.some(
        (answeredQuestion) => answeredQuestion.question_id === question.id
      )
    ) {
      return { id: question.id, answered: true };
    } else {
      return { id: question.id, answered: false };
    }
  });

  const getStepClass = (question: { id: number; answered: boolean }) => {
    if (question.id === props.questionId) {
      return 'step step-accent';
    } else if (question.answered) {
      return 'step step-primary';
    } else {
      return 'step';
    }
  };

  return (
    <ul className="steps">
      {stepperArray.map((question) => {
        return (
          <Link
            href={`/survey/${props.surveyId}/question/${question.id}`}
            key={question.id}
            className={getStepClass(question)}
          ></Link>
        );
      })}
    </ul>
  );
}
