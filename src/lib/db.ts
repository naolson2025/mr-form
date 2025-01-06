import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'surveys.sqlite'); // Store in project root
let db: DatabaseType;

interface QuestionData {
  text: string;
  type: string;
  options?: { value: string; label: string }[];
}

const initialQuestions: QuestionData[] = [
  {
    text: 'How likely are you to throw our product directly in the trash?',
    type: 'multiple-choice',
    options: [
      { value: 'never', label: 'Never' },
      { value: 'unlikely', label: 'Unlikely' },
      { value: 'indifferent', label: 'Indifferent' },
      { value: 'probably', label: 'Probably' },
      { value: 'already_in_trash', label: "It's already in the trash" },
    ],
  },
  {
    text: 'How would you feel if you found out Banana smartphone company was using slave labor overseas?',
    type: 'multiple-choice',
    options: [
      { value: 'angry', label: 'Angry' },
      { value: 'happy', label: 'Happy' },
      { value: 'sad', label: 'Sad' },
      { value: 'confused', label: 'Confused' },
      { value: 'emotionless', label: 'Emotionless' },
    ],
  },
  {
    text: 'If you could add one feature to the banana smartphone what would it be?',
    type: 'text',
  },
  {
    text: 'How was your experience setting up your banana smartphone?',
    type: 'multiple-choice',
    options: [
      { value: 'very_easy', label: 'Very Easy' },
      { value: 'easy', label: 'Easy' },
      { value: 'normal', label: 'Normal' },
      { value: 'hard', label: 'Hard' },
      { value: 'extremely_painful', label: 'Extremely Painful' },
    ],
  },
];

function initializeDatabase() {
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
          user_id INTEGER,
          response TEXT,
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

// Export the database instance and the initialization function
export { db, initializeDatabase };
