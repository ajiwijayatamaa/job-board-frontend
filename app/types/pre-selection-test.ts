export interface TestOption {
  id: number;
  questionId: number;
  optionText: string;
  isCorrect: boolean;
}

export interface TestQuestion {
  id: number;
  testId: number;
  questionText: string;
  correctAnswer: string;
  options: TestOption[];
}

export interface PreSelectionTest {
  id: number;
  jobId: number;
  title: string;
  questions: TestQuestion[];
}

// USER — opsi tanpa isCorrect (backend tidak kirim field ini ke user)
export interface TestOptionForUser {
  id: number;
  optionText: string;
}

export interface TestQuestionForUser {
  id: number;
  questionText: string;
  options: TestOptionForUser[];
}

export interface PreSelectionTestForUser {
  id: number;
  jobId: number;
  title: string;
  questions: TestQuestionForUser[];
}

// RESULTS
export interface TestResultUser {
  id: number;
  fullName: string | null;
  email: string;
  profilePhoto: string | null;
  education: string | null;
}

export interface TestResult {
  id: number;
  userId: number;
  preSelectionTestId: number;
  score: number;
  createdAt: string;
  user: TestResultUser;
}

export interface SubmitTestResponse {
  score: number;
  passed: boolean;
  testResultId: number;
}
