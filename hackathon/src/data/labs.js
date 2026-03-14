import generatedLabs from './labs.generated.json' with { type: 'json' };

// Static fallback labs in case scraping fails
const fallbackLabs = [
  {
    id: "lab_001",
    name: "Michigan AI Lab",
    department: "Computer Science",
    pi: "Dr. Rada Mihalcea",
    piEmail: "mihalcea@umich.edu",
    description: "The Michigan AI Lab conducts cutting-edge research in natural language processing, computer vision, and machine learning. We focus on developing AI systems that are interpretable, fair, and aligned with human values.",
    researchAreas: ["Natural Language Processing", "Computer Vision", "Machine Learning", "AI Ethics"],
    requirements: ["Python", "Machine Learning basics", "Statistics"],
    timeCommitment: "10-15 hours/week",
    credit: true,
    paid: true,
    matchScore: 92,
    image: "/lab-images/ai-lab.jpg",
    location: "Beyster Building",
    website: "ai.umich.edu",
    openPositions: 3,
    postedDate: "2025-01-15"
  },
  {
    id: "lab_002",
    name: "Robotics Institute",
    department: "Robotics",
    pi: "Dr. Jessy Grizzle",
    piEmail: "grizzle@umich.edu",
    description: "Developing the next generation of autonomous robots for locomotion and manipulation. Our work spans from theoretical control algorithms to real-world deployment on legged robots.",
    researchAreas: ["Robotics", "Control Systems", "Autonomous Systems", "Legged Locomotion"],
    requirements: ["C++", "ROS", "Linear Algebra", "Control Theory"],
    timeCommitment: "15-20 hours/week",
    credit: true,
    paid: true,
    matchScore: 78,
    image: "/lab-images/robotics.jpg",
    location: "Ford Robotics Building",
    website: "robotics.umich.edu",
    openPositions: 2,
    postedDate: "2025-01-10"
  }
];

// Student profile for match score calculation
const getStudentProfile = () => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("labbridge.profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          major: parsed.major || "Computer Science",
          interests: parsed.interests || ["Machine Learning", "Computer Vision", "HCI", "Robotics"],
          skills: parsed.skills || ["Python", "PyTorch", "React", "JavaScript", "C++", "OpenCV"]
        };
      } catch (error) {
        console.warn('Failed to parse stored profile:', error);
      }
    }
  }
  return {
    major: "Computer Science",
    interests: ["Machine Learning", "Computer Vision", "HCI", "Robotics"],
    skills: ["Python", "PyTorch", "React", "JavaScript", "C++", "OpenCV"]
  };
};

function calculateMatchScore(lab, studentProfile) {
  let score = 0;

  // Department matching with higher base scores
  const studentMajor = studentProfile.major.toLowerCase();
  const labDept = lab.department.toLowerCase();

  if (studentMajor.includes('computer science') &&
      (labDept.includes('computer science') || labDept.includes('ai') || labDept.includes('cse'))) {
    score += 60 + Math.random() * 15; // 60-75 points for perfect major match
  } else if (labDept.includes('electrical') || labDept.includes('ece')) {
    score += 45 + Math.random() * 15; // 45-60 points for ECE
  } else if (labDept.includes('life sciences') || labDept.includes('biology')) {
    score += 25 + Math.random() * 10; // 25-35 points for life sciences
  } else {
    score += 20 + Math.random() * 10; // 20-30 points for other departments
  }

  // Enhanced keyword matching with much higher weighting
  const keywords = studentProfile.interests.map(interest => interest.toLowerCase());
  const textToCheck = `${lab.name} ${lab.description} ${lab.researchAreas?.join(' ') || ''}`.toLowerCase();

  let keywordScore = 0;
  let hasInterestMatch = false;

  keywords.forEach(keyword => {
    if (textToCheck.includes(keyword)) {
      hasInterestMatch = true;
      // Much higher points for exact matches in research areas vs general text
      const researchAreasText = lab.researchAreas?.join(' ').toLowerCase() || '';
      if (researchAreasText.includes(keyword)) {
        keywordScore += 25 + Math.random() * 15; // 25-40 points for research area match
      } else {
        keywordScore += 15 + Math.random() * 10; // 15-25 points for general match
      }
    }
  });

  // If no interest matches at all, significantly reduce score
  if (!hasInterestMatch) {
    score *= 0.2; // Reduce score by 80% if no interest alignment
    score = Math.max(score, 12); // But keep minimum at 12%
  } else {
    // Bonus for having interest matches
    score += 15;
  }

  // Cap keyword score but allow higher maximum
  score += Math.min(keywordScore, 60);

  // Skills matching with higher weighting
  const relevantSkills = studentProfile.skills.map(skill => skill.toLowerCase());
  const skillsText = lab.requirements?.join(' ').toLowerCase() || '';
  let skillScore = 0;

  relevantSkills.forEach(skill => {
    if (skillsText.includes(skill)) {
      skillScore += 12 + Math.random() * 8; // 12-20 points per skill match
    }
  });

  score += Math.min(skillScore, 30);

  // Research area alignment bonus - higher for better alignment
  if (lab.researchAreas && lab.researchAreas.length > 0) {
    const researchAlignment = lab.researchAreas.filter(area =>
      studentProfile.interests.some(interest =>
        area.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(area.toLowerCase())
      )
    ).length;

    if (researchAlignment > 0) {
      score += researchAlignment * (8 + Math.random() * 7); // 8-15 points per aligned research area
    }
  }

  // Reduced random variation (±3 points) to prevent irrelevant labs from ranking higher
  score += (Math.random() - 0.5) * 6;

  // More nuanced scoring based on match quality
  let finalScore = score;

  if (hasInterestMatch) {
    // Calculate match quality based on multiple factors (0-100 scale)
    let matchQuality = 0;

    // Base quality from keyword matches (0-30 points)
    matchQuality += Math.min(keywordScore * 0.5, 30);

    // Department alignment bonus (0-25 points)
    if (studentMajor.includes('computer science') &&
        (labDept.includes('computer science') || labDept.includes('ai') || labDept.includes('cse'))) {
      matchQuality += 25;
    } else if (labDept.includes('electrical') || labDept.includes('ece')) {
      matchQuality += 15;
    } else if (labDept.includes('life sciences') || labDept.includes('biology')) {
      matchQuality += 5; // Small bonus for related fields
    }

    // Research area alignment bonus (0-25 points)
    if (lab.researchAreas && lab.researchAreas.length > 0) {
      const researchMatchCount = lab.researchAreas.filter(area =>
        studentProfile.interests.some(interest =>
          area.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(area.toLowerCase())
        )
      ).length;
      matchQuality += researchMatchCount * 8; // 8 points per matching research area
    }

    // Skills alignment bonus (0-20 points)
    const skillMatchCount = relevantSkills.filter(skill =>
      skillsText.includes(skill)
    ).length;
    matchQuality += skillMatchCount * 5; // 5 points per matching skill

    // Convert match quality to final score (40-95 range based on quality)
    // Higher quality = higher score, but with more variation
    if (matchQuality >= 60) {
      finalScore = 85 + (matchQuality - 60) * 0.25; // 85-95% for excellent matches
    } else if (matchQuality >= 40) {
      finalScore = 70 + (matchQuality - 40) * 0.5; // 70-85% for good matches
    } else if (matchQuality >= 20) {
      finalScore = 55 + (matchQuality - 20) * 0.75; // 55-70% for decent matches
    } else {
      finalScore = 40 + matchQuality * 0.75; // 40-55% for poor matches
    }

    finalScore += (Math.random() - 0.5) * 6; // ±3 points randomization

  } else {
    // No interest matches - varied low scores
    finalScore = 20 + (Math.random() * 25); // 20-45% for non-matching labs
  }

  return Math.min(Math.max(Math.round(finalScore), 15), 95);
}

// Use generated labs if available, otherwise fallback to static data
let labsData = [];
try {
  if (generatedLabs && generatedLabs.length > 0) {
    const currentProfile = getStudentProfile();
    labsData = generatedLabs.map(lab => ({
      ...lab,
      matchScore: calculateMatchScore(lab, currentProfile)
    }));
  } else {
    labsData = fallbackLabs;
  }
} catch (error) {
  console.warn('Failed to load generated labs, using fallback data:', error);
  labsData = fallbackLabs;
}

// Function to recalculate match scores based on current student profile
export const recalculateMatchScores = () => {
  const currentProfile = getStudentProfile();
  labsData = labsData.map(lab => ({
    ...lab,
    matchScore: calculateMatchScore(lab, currentProfile)
  }));
  // Sort by match score (highest first)
  labsData.sort((a, b) => b.matchScore - a.matchScore);

  // Save updated scores back to the JSON file
  if (typeof window === 'undefined') {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'labs.generated.json');
    try {
      fs.writeFileSync(filePath, JSON.stringify(labsData, null, 2));
      console.log('Updated match scores saved to labs.generated.json');
    } catch (error) {
      console.error('Failed to save updated scores:', error);
    }
  }

  return labsData;
};

// Sort by match score (highest first)
labsData.sort((a, b) => b.matchScore - a.matchScore);

export { labsData as labs };
