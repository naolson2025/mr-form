import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'surveys.sqlite'); // Store in project root
let db: DatabaseType | null = null;

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
          survey_id INTEGER NOT NULL,
          text TEXT NOT NULL,
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

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Important: Re-throw the error to prevent the app from starting
  }
}

// Export the database instance and the initialization function
export { db, initializeDatabase };
