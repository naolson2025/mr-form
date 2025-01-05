'use server';

import { db } from './db';

export async function submitSurveyResponse(formData: FormData) {
  console.log('submitSurveyResponse', formData);
}

type SurveyQuestion = {
  id: number;
}

export async function startSurvey() {
  try {
    if (!db) {
      throw new Error('Database connection is null.');
    }

    const firstQuestion = await db
      .prepare('SELECT id FROM Questions ORDER BY "order" LIMIT 1')
      .get() as SurveyQuestion;

    if (!firstQuestion) {
      return { error: 'No questions found in the database.' };
    }

    return { redirectUrl: `/survey/1/question/${firstQuestion.id}` };
  } catch (error) {
    console.error('Error creating survey:', error);
    return { error: 'Failed to start survey.' };
  }
}
