export type ApplicationStatus = "submitted" | "reviewed" | "shortlisted" | "interview" | "accepted" | "rejected";

export interface TrackingStep {
  label: string;
  date: string | null;
  completed: boolean;
}

export interface InterviewSchedule {
  date: string;
  time: string;
  type: "Online" | "On-site";
  location: string;
  interviewer: string;
  reminderSent?: boolean;
}

export interface Application {
  id: number;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  tracking: TrackingStep[];
  interview?: InterviewSchedule;
  rejectionReason?: string;
  rejectionFeedback?: string;
}

export const applications: Application[] = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechVista Solutions",
    companyLogo: "🏢",
    location: "Jakarta",
    appliedDate: "2026-03-15",
    status: "interview",
    tracking: [
      { label: "CV Submitted", date: "2026-03-15", completed: true },
      { label: "CV Reviewed", date: "2026-03-18", completed: true },
      { label: "Shortlisted", date: "2026-03-20", completed: true },
      { label: "Interview Scheduled", date: "2026-03-25", completed: true },
      { label: "Final Decision", date: null, completed: false },
    ],
    interview: {
      date: "2026-04-05",
      time: "10:00 AM",
      type: "Online",
      location: "Google Meet (link will be sent via email)",
      interviewer: "Andi Wijaya - Engineering Manager",
      reminderSent: true,
    },
  },
  {
    id: 2,
    jobTitle: "Data Scientist",
    company: "DataStream Analytics",
    companyLogo: "📊",
    location: "Jakarta",
    appliedDate: "2026-03-10",
    status: "accepted",
    tracking: [
      { label: "CV Submitted", date: "2026-03-10", completed: true },
      { label: "CV Reviewed", date: "2026-03-12", completed: true },
      { label: "Shortlisted", date: "2026-03-14", completed: true },
      { label: "Interview Scheduled", date: "2026-03-18", completed: true },
      { label: "Final Decision", date: "2026-03-22", completed: true },
    ],
    interview: {
      date: "2026-03-25",
      time: "02:00 PM",
      type: "On-site",
      location: "DataStream Office, Sudirman Tower Lt. 15, Jakarta",
      interviewer: "Sari Putri - Head of Data",
      reminderSent: true,
    },
  },
  {
    id: 3,
    jobTitle: "Digital Marketing Manager",
    company: "GreenLeaf Digital",
    companyLogo: "🌿",
    location: "Bandung",
    appliedDate: "2026-03-08",
    status: "rejected",
    tracking: [
      { label: "CV Submitted", date: "2026-03-08", completed: true },
      { label: "CV Reviewed", date: "2026-03-11", completed: true },
      { label: "Shortlisted", date: null, completed: false },
      { label: "Interview Scheduled", date: null, completed: false },
      { label: "Final Decision", date: "2026-03-13", completed: true },
    ],
    rejectionReason: "Insufficient experience in SEO/SEM",
    rejectionFeedback: "Thank you for your interest. While your creative skills are strong, we require candidates with at least 3 years of hands-on SEO/SEM experience for this role. We encourage you to apply again in the future as you gain more experience in this area.",
  },
  {
    id: 4,
    jobTitle: "UI/UX Designer",
    company: "DesignCraft Studio",
    companyLogo: "🎨",
    location: "Yogyakarta",
    appliedDate: "2026-03-20",
    status: "reviewed",
    tracking: [
      { label: "CV Submitted", date: "2026-03-20", completed: true },
      { label: "CV Reviewed", date: "2026-03-28", completed: true },
      { label: "Shortlisted", date: null, completed: false },
      { label: "Interview Scheduled", date: null, completed: false },
      { label: "Final Decision", date: null, completed: false },
    ],
  },
  {
    id: 5,
    jobTitle: "Product Manager",
    company: "CloudNine Systems",
    companyLogo: "☁️",
    location: "Denpasar",
    appliedDate: "2026-03-28",
    status: "submitted",
    tracking: [
      { label: "CV Submitted", date: "2026-03-28", completed: true },
      { label: "CV Reviewed", date: null, completed: false },
      { label: "Shortlisted", date: null, completed: false },
      { label: "Interview Scheduled", date: null, completed: false },
      { label: "Final Decision", date: null, completed: false },
    ],
  },
  {
    id: 6,
    jobTitle: "Backend Engineer",
    company: "TechVista Solutions",
    companyLogo: "🏢",
    location: "Jakarta",
    appliedDate: "2026-02-20",
    status: "rejected",
    tracking: [
      { label: "CV Submitted", date: "2026-02-20", completed: true },
      { label: "CV Reviewed", date: "2026-02-23", completed: true },
      { label: "Shortlisted", date: "2026-02-25", completed: true },
      { label: "Interview Scheduled", date: "2026-02-28", completed: true },
      { label: "Final Decision", date: "2026-03-05", completed: true },
    ],
    rejectionReason: "Position filled by another candidate",
    rejectionFeedback: "You performed well in the interview process. Unfortunately, we decided to go with another candidate whose experience more closely matched our current project requirements. We'd love to consider you for future openings.",
  },
];
