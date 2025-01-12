import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'surveys.sqlite'); // Store in project root

export interface MultipleChoiceOptions {
  value: string;
  label: string;
}

export interface RangeOptions {
  min: number;
  max: number;
  step: number;
}

interface QuestionData {
  text: string;
  type: string;
  options: MultipleChoiceOptions[] | RangeOptions;
}

const initialQuestions: QuestionData[] = [
  {
    text: 'How would you rate the durability of your banana smartphone?',
    type: 'multiple-choice',
    options: [
      { value: '1', label: 'Mush' },
      { value: '2', label: 'Bruised' },
      { value: '3', label: 'Ripe' },
      { value: '4', label: 'Green' },
      { value: '5', label: "GMO Super Banana" },
    ],
  },
  {
    text: 'How would you rate the battery life of the banana smartphone?',
    type: 'range',
    options: {
      min: 1,
      max: 5,
      step: 1,
    },
  },
  {
    text: 'How was the setup process for your banana smartphone?',
    type: 'multiple-choice-emotion',
    options: [
      { value: '1', label: '😡' },
      { value: '2', label: '😠' },
      { value: '3', label: '😐' },
      { value: '4', label: '😊' },
      { value: '5', label: '😍' },
    ],
  }
];

let db: DatabaseType;

export async function getDbConnection(): Promise<DatabaseType> {
  if (!db) {
    try {
      db = new Database(dbPath);
  
      // Check if tables exist. If not create them.
      db.exec(`
        CREATE TABLE IF NOT EXISTS Surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT
        );
      `);
  
      db.exec(`
        CREATE TABLE IF NOT EXISTS Questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            survey_id INTEGER NOT NULL DEFAULT 1,
            text TEXT NOT NULL,
            type TEXT NOT NULL,
            options TEXT,
            "order" INTEGER NOT NULL,
            FOREIGN KEY (survey_id) REFERENCES Surveys(id)
        );
      `);
  
      db.exec(`
        CREATE TABLE IF NOT EXISTS Responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id TEXT,
            response TEXT NOT NULL,
            FOREIGN KEY (question_id) REFERENCES Questions(id)
        );
      `);
  
      // Add default survey if it doesn't exist
      const surveyExists = db.prepare('SELECT 1 FROM Surveys LIMIT 1').get();
      if (!surveyExists) {
        db.prepare('INSERT INTO Surveys (title, description) VALUES (?, ?)').run(
          'Banana Smartphone Survey',
          'Help us improve our product by answering a few questions.'
        );
      }
  
      // Check if questions exist and insert if not
      const insertQuestion = db.prepare(
        'INSERT INTO Questions (text, type, options, "order") VALUES (?, ?, ?, ?)'
      );
  
      db.transaction(() => {
        initialQuestions.forEach((question, index) => {
          const questionExists = db
            .prepare('SELECT 1 FROM Questions WHERE text = ?')
            .get(question.text);
          if (!questionExists) {
            insertQuestion.run(
              question.text,
              question.type,
              question.options ? JSON.stringify(question.options) : null,
              index + 1
            );
          }
        });
      })(); // Immediately execute the transaction
  
      console.log('Database initialized successfully.');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error; // Important: Re-throw the error to prevent the app from starting
    }
  }

  return db;
}
