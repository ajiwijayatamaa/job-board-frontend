// Overview
export interface AnalyticsOverview {
  totalJobs: number;
  totalPublishedJobs: number;
  totalApplications: number;
  applicationsByStatus: {
    status: string;
    count: number;
  }[];
}

// Demographics
export interface AnalyticsDemographics {
  gender: Record<string, number>;
  ageGroups: Record<string, number>;
  locations: { city: string; count: number }[];
}

// Salary Trends
export interface SalaryByCategory {
  category: string;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  totalApplicants: number;
}

export interface SalaryByCity {
  city: string;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  totalApplicants: number;
}

export interface AnalyticsSalaryTrends {
  byCategory: SalaryByCategory[];
  byCity: SalaryByCity[];
}

// Applicant Interests
export interface AnalyticsApplicantInterests {
  byCategory: { category: string; count: number }[];
  topJobs: { title: string; jobId: number; count: number }[];
}
