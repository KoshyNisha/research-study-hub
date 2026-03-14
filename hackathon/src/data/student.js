export const PROFILE_STORAGE_KEY = "labbridge.profile";

export const student = {
  id: "stu_001",
  name: "Jane Doe",
  email: "janedoe@umich.edu",
  major: "Computer Science",
  year: "Junior",
  gpa: 3.8,
  interests: ["Machine Learning", "Computer Vision", "HCI", "Robotics"],
  skills: ["Python", "PyTorch", "React", "JavaScript", "C++", "OpenCV"],
  experience: [
    {
      title: "Software Engineering Intern",
      company: "TechCorp",
      duration: "Summer 2024",
      description: "Built ML pipelines for recommendation systems"
    },
    {
      title: "Research Assistant",
      company: "UMich Data Science Lab",
      duration: "2023-2024",
      description: "Assisted with data preprocessing and visualization"
    }
  ],
  coursework: [
    "EECS 445: Machine Learning",
    "EECS 442: Computer Vision",
    "EECS 370: Intro to Computer Architecture",
    "STATS 412: Advanced Data Analysis"
  ],
  availability: "10-15 hours/week",
  startDate: "January 2025",
  resumeUrl: "/resume.pdf",
  linkedIn: "linkedin.com/in/janedoe",
  profileComplete: 85
};

export const getStoredProfile = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const getStudentProfile = () => {
  const stored = getStoredProfile();
  if (!stored) {
    return {
      ...student,
      interestsByDepartment: {}
    };
  }

  return {
    ...student,
    ...stored,
    interests: stored.interests || student.interests,
    interestsByDepartment: stored.interestsByDepartment || {}
  };
};

export default student;
