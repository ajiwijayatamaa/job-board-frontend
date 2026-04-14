export type JobPostingStatus = "draft" | "published";
export type ApplicantStatus = "submitted" | "processed" | "interviewed" | "accepted" | "rejected";

export interface InterviewSchedule {
  id: number;
  jobId: number;
  applicantIds: number[];
  title: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: "Online" | "On-site";
  location: string;
  interviewer: string;
  notes?: string;
  reminderSent: boolean;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  banner?: string;
  category: string;
  city: string;
  salary?: string;
  tags: string[];
  deadline: string;
  status: JobPostingStatus;
  createdAt: string;
  applicantCount: number;
}

export interface Applicant {
  id: number;
  jobId: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  education: string;
  salaryExpectation: string;
  address: string;
  profilePicture: string;
  cvUrl: string;
  appliedAt: string;
  status: ApplicantStatus;
  rejectionReason?: string;
}

export const adminJobPostings: JobPosting[] = [
  { id: 1, title: "Senior Frontend Developer", description: "We are looking for an experienced Frontend Developer to join our team and build modern web applications using React, TypeScript, and Next.js. You will work closely with our design and backend teams.", banner: "", category: "Technology", city: "Jakarta", salary: "Rp 15M - 25M", tags: ["React", "TypeScript", "Frontend"], deadline: "2026-05-15", status: "published", createdAt: "2026-03-20", applicantCount: 14 },
  { id: 2, title: "Backend Engineer", description: "Design and implement scalable backend services using Node.js, Python, and cloud technologies. Work on microservices architecture.", banner: "", category: "Technology", city: "Jakarta", salary: "Rp 18M - 30M", tags: ["Node.js", "Python", "AWS"], deadline: "2026-05-20", status: "published", createdAt: "2026-03-22", applicantCount: 9 },
  { id: 3, title: "UI/UX Designer", description: "Create beautiful and intuitive user interfaces for web and mobile applications. Conduct user research and usability testing.", banner: "", category: "Design", city: "Bandung", salary: "Rp 10M - 16M", tags: ["Figma", "UI/UX", "Prototyping"], deadline: "2026-06-01", status: "published", createdAt: "2026-03-25", applicantCount: 7 },
  { id: 4, title: "DevOps Engineer", description: "Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability and scalability.", banner: "", category: "Technology", city: "Jakarta", salary: "Rp 20M - 32M", tags: ["Docker", "Kubernetes", "CI/CD"], deadline: "2026-06-10", status: "draft", createdAt: "2026-04-01", applicantCount: 0 },
  { id: 5, title: "Digital Marketing Specialist", description: "Plan and execute marketing campaigns across social media, SEO, and paid advertising channels.", banner: "", category: "Marketing", city: "Surabaya", tags: ["SEO", "Social Media", "Analytics"], deadline: "2026-05-30", status: "draft", createdAt: "2026-04-03", applicantCount: 0 },
  { id: 6, title: "Data Analyst", description: "Analyze business data, generate reports, and provide actionable insights to stakeholders.", banner: "", category: "Technology", city: "Jakarta", salary: "Rp 12M - 20M", tags: ["SQL", "Python", "Tableau"], deadline: "2026-06-15", status: "published", createdAt: "2026-04-05", applicantCount: 5 },
];

export const adminApplicants: Applicant[] = [
  { id: 1, jobId: 1, name: "Ahmad Rizky", email: "ahmad.rizky@email.com", age: 28, gender: "Male", education: "S1 Computer Science", salaryExpectation: "Rp 20M", address: "Jakarta Selatan", profilePicture: "👨‍💻", cvUrl: "#", appliedAt: "2026-03-21", status: "interviewed" },
  { id: 2, jobId: 1, name: "Siti Nurhaliza", email: "siti.nur@email.com", age: 25, gender: "Female", education: "S1 Information Technology", salaryExpectation: "Rp 18M", address: "Jakarta Barat", profilePicture: "👩‍💻", cvUrl: "#", appliedAt: "2026-03-22", status: "processed" },
  { id: 3, jobId: 1, name: "Budi Santoso", email: "budi.s@email.com", age: 32, gender: "Male", education: "S2 Software Engineering", salaryExpectation: "Rp 25M", address: "Tangerang", profilePicture: "👨‍🎓", cvUrl: "#", appliedAt: "2026-03-23", status: "accepted" },
  { id: 4, jobId: 1, name: "Dewi Lestari", email: "dewi.l@email.com", age: 26, gender: "Female", education: "S1 Computer Science", salaryExpectation: "Rp 17M", address: "Bekasi", profilePicture: "👩‍🎓", cvUrl: "#", appliedAt: "2026-03-24", status: "rejected", rejectionReason: "Insufficient experience with TypeScript and React ecosystem." },
  { id: 5, jobId: 1, name: "Reza Pratama", email: "reza.p@email.com", age: 30, gender: "Male", education: "S1 Informatics", salaryExpectation: "Rp 22M", address: "Depok", profilePicture: "👨‍💼", cvUrl: "#", appliedAt: "2026-03-25", status: "submitted" },
  { id: 6, jobId: 2, name: "Andi Wijaya", email: "andi.w@email.com", age: 29, gender: "Male", education: "S1 Computer Science", salaryExpectation: "Rp 22M", address: "Jakarta Pusat", profilePicture: "👨‍💻", cvUrl: "#", appliedAt: "2026-03-23", status: "processed" },
  { id: 7, jobId: 2, name: "Maya Sari", email: "maya.s@email.com", age: 27, gender: "Female", education: "S2 Computer Science", salaryExpectation: "Rp 28M", address: "Bogor", profilePicture: "👩‍💻", cvUrl: "#", appliedAt: "2026-03-24", status: "interviewed" },
  { id: 8, jobId: 2, name: "Fajar Nugroho", email: "fajar.n@email.com", age: 31, gender: "Male", education: "S1 Information Systems", salaryExpectation: "Rp 20M", address: "Jakarta Timur", profilePicture: "👨‍🎓", cvUrl: "#", appliedAt: "2026-03-25", status: "submitted" },
  { id: 9, jobId: 3, name: "Lisa Permata", email: "lisa.p@email.com", age: 24, gender: "Female", education: "S1 Visual Communication Design", salaryExpectation: "Rp 14M", address: "Bandung", profilePicture: "👩‍🎨", cvUrl: "#", appliedAt: "2026-03-26", status: "processed" },
  { id: 10, jobId: 3, name: "Dimas Prasetyo", email: "dimas.p@email.com", age: 26, gender: "Male", education: "S1 Design", salaryExpectation: "Rp 12M", address: "Bandung", profilePicture: "👨‍🎨", cvUrl: "#", appliedAt: "2026-03-27", status: "submitted" },
  { id: 11, jobId: 6, name: "Putri Handayani", email: "putri.h@email.com", age: 25, gender: "Female", education: "S1 Statistics", salaryExpectation: "Rp 15M", address: "Jakarta Selatan", profilePicture: "👩‍💼", cvUrl: "#", appliedAt: "2026-04-06", status: "submitted" },
  { id: 12, jobId: 6, name: "Hendra Kusuma", email: "hendra.k@email.com", age: 28, gender: "Male", education: "S2 Data Science", salaryExpectation: "Rp 19M", address: "Jakarta Utara", profilePicture: "👨‍💼", cvUrl: "#", appliedAt: "2026-04-06", status: "processed" },
];

export const adminInterviewSchedules: InterviewSchedule[] = [
  { id: 1, jobId: 1, applicantIds: [1, 2], title: "Technical Interview - Frontend", date: "2026-04-10", time: "10:00", duration: 60, type: "Online", location: "Google Meet - link will be sent via email", interviewer: "Budi Hartono - Tech Lead", notes: "Focus on React & TypeScript proficiency", reminderSent: true },
  { id: 2, jobId: 1, applicantIds: [3], title: "Final Interview - Culture Fit", date: "2026-04-12", time: "14:00", duration: 45, type: "On-site", location: "Office Jakarta, Sudirman Tower Lt. 10", interviewer: "Sari Dewi - HR Manager", notes: "Discuss team dynamics and career goals", reminderSent: false },
  { id: 3, jobId: 2, applicantIds: [6, 7], title: "Technical Assessment - Backend", date: "2026-04-15", time: "09:00", duration: 90, type: "Online", location: "Zoom - link will be sent via email", interviewer: "Reza Firmansyah - Senior Backend Engineer", notes: "Live coding session with Node.js", reminderSent: false },
  { id: 4, jobId: 3, applicantIds: [9], title: "Portfolio Review", date: "2026-04-18", time: "11:00", duration: 60, type: "Online", location: "Google Meet", interviewer: "Anisa Rahma - Design Lead", reminderSent: true },
];
