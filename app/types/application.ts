export type ApplicationStatus =
  | "PENDING"
  | "PROCESSED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED";

export interface ApplicationUser {
  id: number;
  fullName: string | null;
  email: string;
  profilePhoto: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  education: string | null;
  city: string | null;
}

export interface ApplicationUserDetail extends ApplicationUser {
  address: string | null; // hanya ada di getApplicantById
}

export interface ApplicationCV {
  id: number;
  cvName: string;
  fileUrl: string;
  isPrimary: boolean;
}

export interface ApplicationTestResult {
  id: number;
  userId: number;
  preSelectionTestId: number;
  score: string; // Decimal dari Prisma → string di JSON
  createdAt: string;
}

export interface ApplicationInterview {
  id: number;
  applicationId: number;
  interviewDate: string;
  locationLink: string | null;
  reminderSent: boolean;
  createdAt: string;
}

export interface Application {
  id: number;
  userId: number;
  jobId: number;
  cvId: number;
  expectedSalary: string | null; // Decimal dari Prisma → string di JSON
  status: ApplicationStatus;
  rejectionReason: string | null;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  user: ApplicationUser;
  cv: ApplicationCV;
  testResult: ApplicationTestResult | null;
}

export interface ApplicationDetail extends Omit<Application, "user"> {
  user: ApplicationUserDetail;
  job: {
    id: number;
    title: string;
    category: string;
    city: string;
  };
  interview: ApplicationInterview | null;
}
