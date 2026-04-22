export interface InterviewUser {
  id: number;
  fullName: string | null;
  email: string;
  profilePhoto: string | null;
}

export interface InterviewUserDetail extends InterviewUser {
  dateOfBirth: string | null;
  gender: string | null;
  education: string | null;
  city: string | null;
}

export interface InterviewJob {
  id: number;
  title: string;
  category: string;
  city: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  interviewDate: string;
  locationLink: string | null;
  reminderSent: boolean;
  createdAt: string;
  application: {
    user: InterviewUser;
  };
}

export interface InterviewDetail extends Omit<Interview, "application"> {
  application: {
    user: InterviewUserDetail;
    job: InterviewJob;
  };
}
