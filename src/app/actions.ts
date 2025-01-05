'use server';

import { UUID } from 'crypto';
import { db } from './db';

type ExistingResponse = {
  id: number;
}

export async function submitResponse(questionId: number, response: string, userId: UUID) {
  try {
    const surveyId = db
      .prepare('SELECT survey_id FROM Questions WHERE id = ?')
      .get(questionId) as { survey_id: number } | undefined;
    if (!surveyId) {
      return { error: 'No survey found for this question' };
    }

    // Check if response exists
    const existingResponse = db
      .prepare('SELECT id FROM Responses WHERE question_id = ? AND user_id = ?')
      .get(questionId, userId) as ExistingResponse;

    if (existingResponse) {
      db.prepare('UPDATE Responses SET response = ? WHERE id = ?').run(
        response,
        existingResponse.id
      );
    } else {
      db.prepare(
        'INSERT INTO Responses (question_id, user_id, response) VALUES (?, ?, ?)'
      ).run(questionId, userId, response);
    }

    // Get next question
    const nextQuestion = db
      .prepare(
        'SELECT id FROM Questions WHERE survey_id = ? AND "order" > (SELECT "order" FROM Questions WHERE id = ?) ORDER BY "order" LIMIT 1'
      )
      .get(surveyId.survey_id, questionId) as { id: number } | undefined;

    if (nextQuestion) {
      return {
        redirectUrl: `/survey/${surveyId.survey_id}/question/${nextQuestion.id}`,
      };
    } else {
      return { redirectUrl: `/survey/thank-you` };
    }
  } catch (error) {
    console.error('Error submitting response:', error);
    return { error: 'Failed to submit response.' };
  }
}

type SurveyQuestion = {
  id: number;
};

export async function startSurvey() {
  try {
    const firstQuestion = (await db
      .prepare('SELECT id FROM Questions ORDER BY "order" LIMIT 1')
      .get()) as SurveyQuestion;

    if (!firstQuestion) {
      return { error: 'No questions found in the database.' };
    }

    return { redirectUrl: `/survey/1/question/${firstQuestion.id}` };
  } catch (error) {
    console.error('Error creating survey:', error);
    return { error: 'Failed to start survey.' };
  }
}
