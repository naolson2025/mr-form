'use server';
import { Database } from 'bun:sqlite';
import { redirect } from 'next/navigation';

const db = new Database('mydb.sqlite'); // Initialize your DB

export async function submitResponse(
  surveyId: number,
  questionId: number,
  response: string,
  userId?: number
) {
  try {
    // Check if response exists
    const existingResponse = db
      .query('SELECT id FROM Responses WHERE question_id = ? AND user_id = ?')
      .get(questionId, userId);

    if (existingResponse) {
      db.query('UPDATE Responses SET response = ? WHERE id = ?').run(
        response,
        existingResponse.id
      );
    } else {
      db.query(
        'INSERT INTO Responses (question_id, user_id, response) VALUES (?, ?, ?)'
      ).run(questionId, userId, response);
    }

    // Get next question
    const nextQuestion = db
      .query(
        'SELECT id FROM Questions WHERE survey_id = ? AND "order" > (SELECT "order" FROM Questions WHERE id = ?) ORDER BY "order" LIMIT 1'
      )
      .get(surveyId, questionId);

    if (nextQuestion) {
      redirect(`/surveys/${surveyId}/questions/${nextQuestion.id}`);
    } else {
      redirect(`/surveys/${surveyId}/thank-you`);
    }
  } catch (error) {
    console.error('Error submitting response:', error);
    // Handle error appropriately (e.g., display an error message)
    return { error: 'Failed to submit response.' };
  }
}
