export interface Job {
  id: number;
  title: string;
  company: string;
  companyId: number;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  category: string;
  experience: string;
  companyLogo: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: string;
  founded: string;
  description: string;
  logo: string;
  website: string;
  openPositions: number;
  benefits: string[];
}

export const categories = [
  "Technology", "Marketing", "Finance", "Design", "Engineering",
  "Sales", "Human Resources", "Operations", "Healthcare", "Education"
];

export const locations = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
  "Yogyakarta", "Makassar", "Denpasar", "Palembang", "Malang"
];

export const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Lead", "Executive"];

export const companies: Company[] = [
  { id: 1, name: "TechVista Solutions", industry: "Technology", location: "Jakarta", size: "500-1000", founded: "2015", description: "Leading software development company specializing in enterprise solutions and cloud computing. We build innovative products that transform businesses across Southeast Asia.", logo: "🏢", website: "techvista.com", openPositions: 12, benefits: ["Health Insurance", "Remote Work", "Stock Options", "Learning Budget", "Gym Membership"] },
  { id: 2, name: "GreenLeaf Digital", industry: "Marketing", location: "Bandung", size: "50-200", founded: "2018", description: "Creative digital marketing agency focused on sustainable brands and eco-friendly businesses. Our campaigns have reached millions across the region.", logo: "🌿", website: "greenleaf.id", openPositions: 5, benefits: ["Flexible Hours", "Health Insurance", "Team Events", "Creative Budget"] },
  { id: 3, name: "FinanceHub Asia", industry: "Finance", location: "Jakarta", size: "1000-5000", founded: "2010", description: "One of Southeast Asia's fastest-growing fintech companies, providing innovative payment and banking solutions to millions of users.", logo: "💰", website: "financehub.asia", openPositions: 18, benefits: ["Performance Bonus", "Health Insurance", "Education Allowance", "Stock Options", "Parental Leave"] },
  { id: 4, name: "DesignCraft Studio", industry: "Design", location: "Yogyakarta", size: "20-50", founded: "2019", description: "Boutique design studio creating beautiful digital experiences for startups and enterprise clients alike.", logo: "🎨", website: "designcraft.co", openPositions: 3, benefits: ["Remote Work", "Creative Freedom", "Conference Budget", "Flexible Hours"] },
  { id: 5, name: "BuildRight Engineering", industry: "Engineering", location: "Surabaya", size: "200-500", founded: "2012", description: "Civil and structural engineering firm delivering world-class infrastructure projects across Indonesia.", logo: "🏗️", website: "buildright.co.id", openPositions: 8, benefits: ["Health Insurance", "Project Bonuses", "Training Programs", "Transportation Allowance"] },
  { id: 6, name: "MedCare Indonesia", industry: "Healthcare", location: "Jakarta", size: "2000-5000", founded: "2008", description: "Leading healthcare technology provider, connecting patients with quality medical services through our digital platform.", logo: "🏥", website: "medcare.id", openPositions: 15, benefits: ["Full Medical Coverage", "Wellness Programs", "Parental Leave", "Professional Development"] },
  { id: 7, name: "EduStar Learning", industry: "Education", location: "Semarang", size: "100-500", founded: "2016", description: "EdTech company revolutionizing education in Indonesia with interactive learning platforms and AI-powered tutoring.", logo: "📚", website: "edustar.id", openPositions: 7, benefits: ["Learning Budget", "Flexible Work", "Health Insurance", "Childcare Support"] },
  { id: 8, name: "CloudNine Systems", industry: "Technology", location: "Denpasar", size: "100-300", founded: "2017", description: "Cloud infrastructure company helping businesses migrate and scale their operations in the cloud.", logo: "☁️", website: "cloudnine.tech", openPositions: 10, benefits: ["Remote First", "Stock Options", "Unlimited PTO", "Home Office Budget"] },
  { id: 9, name: "RetailMax Group", industry: "Sales", location: "Medan", size: "5000+", founded: "2005", description: "Indonesia's largest retail conglomerate, operating hundreds of stores nationwide with a strong e-commerce presence.", logo: "🛍️", website: "retailmax.co.id", openPositions: 25, benefits: ["Employee Discounts", "Health Insurance", "Career Growth", "Annual Bonus"] },
  { id: 10, name: "PeopleFirst HR", industry: "Human Resources", location: "Makassar", size: "50-100", founded: "2020", description: "HR consulting and talent management firm helping companies build exceptional teams and workplace cultures.", logo: "👥", website: "peoplefirst.id", openPositions: 4, benefits: ["Flexible Hours", "Remote Work", "Professional Certification", "Team Retreats"] },
  { id: 11, name: "DataStream Analytics", industry: "Technology", location: "Jakarta", size: "200-500", founded: "2016", description: "Big data analytics company providing actionable insights for enterprises through machine learning and AI.", logo: "📊", website: "datastream.io", openPositions: 9, benefits: ["Remote Work", "Stock Options", "Conference Budget", "Health Insurance"] },
  { id: 12, name: "SwiftLogistics", industry: "Operations", location: "Palembang", size: "1000-3000", founded: "2013", description: "End-to-end logistics solutions provider, ensuring seamless delivery across the Indonesian archipelago.", logo: "🚚", website: "swiftlogistics.id", openPositions: 14, benefits: ["Health Insurance", "Performance Bonus", "Transportation", "Meal Allowance"] },
];

export const jobs: Job[] = [
  { id: 1, title: "Senior Frontend Developer", company: "TechVista Solutions", companyId: 1, location: "Jakarta", type: "Full-time", salary: "Rp 15M - 25M", posted: "2 days ago", description: "We are looking for an experienced Frontend Developer to join our team and build modern web applications using React, TypeScript, and Next.js.", requirements: ["5+ years React experience", "TypeScript proficiency", "CSS/Tailwind expertise", "Git workflow knowledge"], category: "Technology", experience: "Senior", companyLogo: "🏢" },
  { id: 2, title: "Digital Marketing Manager", company: "GreenLeaf Digital", companyId: 2, location: "Bandung", type: "Full-time", salary: "Rp 12M - 18M", posted: "1 day ago", description: "Lead our digital marketing efforts across multiple channels, including social media, SEO, SEM, and content marketing.", requirements: ["3+ years marketing experience", "SEO/SEM expertise", "Analytics proficiency", "Team leadership"], category: "Marketing", experience: "Mid Level", companyLogo: "🌿" },
  { id: 3, title: "Financial Analyst", company: "FinanceHub Asia", companyId: 3, location: "Jakarta", type: "Full-time", salary: "Rp 18M - 28M", posted: "3 days ago", description: "Analyze financial data, prepare reports, and provide strategic recommendations to support business decision-making.", requirements: ["CFA preferred", "Advanced Excel skills", "Financial modeling", "2+ years experience"], category: "Finance", experience: "Mid Level", companyLogo: "💰" },
  { id: 4, title: "UI/UX Designer", company: "DesignCraft Studio", companyId: 4, location: "Yogyakarta", type: "Full-time", salary: "Rp 10M - 16M", posted: "5 days ago", description: "Create beautiful and intuitive user interfaces for web and mobile applications. Work closely with development teams.", requirements: ["Figma proficiency", "Portfolio required", "User research skills", "Prototyping experience"], category: "Design", experience: "Mid Level", companyLogo: "🎨" },
  { id: 5, title: "Backend Engineer", company: "TechVista Solutions", companyId: 1, location: "Jakarta", type: "Full-time", salary: "Rp 18M - 30M", posted: "1 day ago", description: "Design and implement scalable backend services using Node.js, Python, and cloud technologies.", requirements: ["Node.js/Python expertise", "Database design", "API development", "Cloud services (AWS/GCP)"], category: "Technology", experience: "Senior", companyLogo: "🏢" },
  { id: 6, title: "Civil Engineer", company: "BuildRight Engineering", companyId: 5, location: "Surabaya", type: "Full-time", salary: "Rp 12M - 20M", posted: "1 week ago", description: "Lead structural analysis and design for major infrastructure projects across Indonesia.", requirements: ["PE license preferred", "AutoCAD/Revit", "5+ years experience", "Project management"], category: "Engineering", experience: "Senior", companyLogo: "🏗️" },
  { id: 7, title: "Sales Representative", company: "RetailMax Group", companyId: 9, location: "Medan", type: "Full-time", salary: "Rp 6M - 10M + Commission", posted: "3 days ago", description: "Drive retail sales and build customer relationships in our expanding store network.", requirements: ["Sales experience", "Communication skills", "Target-driven", "Customer service"], category: "Sales", experience: "Entry Level", companyLogo: "🛍️" },
  { id: 8, title: "Data Scientist", company: "DataStream Analytics", companyId: 11, location: "Jakarta", type: "Full-time", salary: "Rp 20M - 35M", posted: "2 days ago", description: "Build machine learning models and derive insights from large datasets to drive business decisions.", requirements: ["Python/R proficiency", "ML frameworks", "Statistics background", "SQL expertise"], category: "Technology", experience: "Senior", companyLogo: "📊" },
  { id: 9, title: "HR Coordinator", company: "PeopleFirst HR", companyId: 10, location: "Makassar", type: "Full-time", salary: "Rp 7M - 12M", posted: "4 days ago", description: "Support recruitment, onboarding, and employee engagement initiatives across the organization.", requirements: ["HR background", "Communication skills", "HRIS experience", "1+ years experience"], category: "Human Resources", experience: "Entry Level", companyLogo: "👥" },
  { id: 10, title: "Product Manager", company: "CloudNine Systems", companyId: 8, location: "Denpasar", type: "Remote", salary: "Rp 18M - 28M", posted: "1 day ago", description: "Define product strategy and roadmap for our cloud infrastructure platform. Work with engineering and design teams.", requirements: ["3+ years PM experience", "Technical background", "Agile methodology", "Data-driven mindset"], category: "Technology", experience: "Mid Level", companyLogo: "☁️" },
  { id: 11, title: "Content Writer", company: "GreenLeaf Digital", companyId: 2, location: "Bandung", type: "Part-time", salary: "Rp 4M - 7M", posted: "6 days ago", description: "Create engaging content for blogs, social media, and marketing campaigns focused on sustainability.", requirements: ["Writing portfolio", "SEO knowledge", "Creative mindset", "English proficiency"], category: "Marketing", experience: "Entry Level", companyLogo: "🌿" },
  { id: 12, title: "DevOps Engineer", company: "TechVista Solutions", companyId: 1, location: "Jakarta", type: "Full-time", salary: "Rp 20M - 32M", posted: "3 days ago", description: "Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability.", requirements: ["Docker/Kubernetes", "CI/CD tools", "Cloud platforms", "Linux administration"], category: "Technology", experience: "Senior", companyLogo: "🏢" },
  { id: 13, title: "Registered Nurse", company: "MedCare Indonesia", companyId: 6, location: "Jakarta", type: "Full-time", salary: "Rp 8M - 14M", posted: "2 days ago", description: "Provide quality patient care in our digital-first healthcare clinics across Jakarta.", requirements: ["Nursing license", "Clinical experience", "Patient care skills", "EMR proficiency"], category: "Healthcare", experience: "Mid Level", companyLogo: "🏥" },
  { id: 14, title: "Curriculum Developer", company: "EduStar Learning", companyId: 7, location: "Semarang", type: "Contract", salary: "Rp 10M - 15M", posted: "5 days ago", description: "Design and develop interactive learning curricula for K-12 students using our digital platform.", requirements: ["Education background", "Curriculum design", "EdTech experience", "Content creation"], category: "Education", experience: "Mid Level", companyLogo: "📚" },
  { id: 15, title: "Logistics Coordinator", company: "SwiftLogistics", companyId: 12, location: "Palembang", type: "Full-time", salary: "Rp 7M - 12M", posted: "1 week ago", description: "Coordinate shipping routes and manage logistics operations for our regional distribution network.", requirements: ["Logistics experience", "Problem-solving", "Excel proficiency", "Communication skills"], category: "Operations", experience: "Entry Level", companyLogo: "🚚" },
  { id: 16, title: "Mobile Developer", company: "CloudNine Systems", companyId: 8, location: "Denpasar", type: "Remote", salary: "Rp 16M - 26M", posted: "4 days ago", description: "Build cross-platform mobile applications using React Native for our cloud management tools.", requirements: ["React Native", "iOS/Android", "REST APIs", "TypeScript"], category: "Technology", experience: "Mid Level", companyLogo: "☁️" },
  { id: 17, title: "Accounting Manager", company: "FinanceHub Asia", companyId: 3, location: "Jakarta", type: "Full-time", salary: "Rp 15M - 22M", posted: "2 days ago", description: "Oversee accounting operations, financial reporting, and compliance for the organization.", requirements: ["CPA preferred", "5+ years accounting", "ERP systems", "Team management"], category: "Finance", experience: "Senior", companyLogo: "💰" },
  { id: 18, title: "Graphic Designer", company: "DesignCraft Studio", companyId: 4, location: "Yogyakarta", type: "Internship", salary: "Rp 3M - 5M", posted: "3 days ago", description: "Join our creative team to design marketing materials, social media assets, and brand identities.", requirements: ["Adobe Creative Suite", "Design portfolio", "Creative thinking", "Attention to detail"], category: "Design", experience: "Entry Level", companyLogo: "🎨" },
  { id: 19, title: "Area Sales Manager", company: "RetailMax Group", companyId: 9, location: "Surabaya", type: "Full-time", salary: "Rp 15M - 22M + Bonus", posted: "1 day ago", description: "Manage sales teams across multiple retail locations and drive regional revenue growth.", requirements: ["5+ years sales management", "Retail industry", "Leadership skills", "Strategic planning"], category: "Sales", experience: "Lead", companyLogo: "🛍️" },
  { id: 20, title: "Machine Learning Engineer", company: "DataStream Analytics", companyId: 11, location: "Jakarta", type: "Full-time", salary: "Rp 25M - 40M", posted: "1 day ago", description: "Develop and deploy production ML models for real-time analytics and predictive systems.", requirements: ["Python/TensorFlow/PyTorch", "MLOps", "Computer Science degree", "3+ years ML experience"], category: "Technology", experience: "Senior", companyLogo: "📊" },
  { id: 21, title: "Medical Doctor", company: "MedCare Indonesia", companyId: 6, location: "Jakarta", type: "Full-time", salary: "Rp 25M - 40M", posted: "4 days ago", description: "Provide telemedicine consultations and in-person care at our healthcare facilities.", requirements: ["Medical license", "Clinical experience", "Telemedicine skills", "Patient communication"], category: "Healthcare", experience: "Mid Level", companyLogo: "🏥" },
  { id: 22, title: "Online Tutor", company: "EduStar Learning", companyId: 7, location: "Semarang", type: "Part-time", salary: "Rp 5M - 9M", posted: "6 days ago", description: "Teach and mentor students through our online learning platform in various subjects.", requirements: ["Teaching experience", "Subject expertise", "Communication skills", "Tech-savvy"], category: "Education", experience: "Entry Level", companyLogo: "📚" },
  { id: 23, title: "Operations Manager", company: "SwiftLogistics", companyId: 12, location: "Palembang", type: "Full-time", salary: "Rp 15M - 24M", posted: "3 days ago", description: "Lead daily operations and process optimization for our regional logistics hub.", requirements: ["Operations management", "Team leadership", "Process improvement", "5+ years experience"], category: "Operations", experience: "Lead", companyLogo: "🚚" },
  { id: 24, title: "QA Engineer", company: "TechVista Solutions", companyId: 1, location: "Jakarta", type: "Full-time", salary: "Rp 12M - 20M", posted: "5 days ago", description: "Ensure product quality through automated and manual testing strategies.", requirements: ["Test automation", "Selenium/Cypress", "API testing", "CI/CD integration"], category: "Technology", experience: "Mid Level", companyLogo: "🏢" },
];
