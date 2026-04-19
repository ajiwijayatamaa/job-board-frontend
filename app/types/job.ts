export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Job {
  id: number;
  companyId: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  banner: string | null;
  salary: string | null;
  city: string;
  deadline: string;
  status: JobStatus;
  preTest: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    applications: number;
  };
}
