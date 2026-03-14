const studies = [
  {
    title: "Human-AI Interaction Study",
    reward: "$15 Amazon Gift Card",
    duration: "30 minutes",
    location: "Remote (Zoom)",
    age: "18+",
    eligibility: "EECS Students",
    description:
      "Participate in a study exploring how students interact with AI tools for programming.",
    apply: "https://example.com/apply1"
  },

  {
    title: "Mobile App Usability Study",
    reward: "$20 Cash",
    duration: "45 minutes",
    location: "North Campus Lab",
    age: "18+",
    eligibility: "Any U-M student",
    description:
      "Help researchers evaluate the usability of a new mobile learning platform.",
    apply: "https://example.com/apply2"
  },

  {
    title: "AR Learning Experiment",
    reward: "$25 Gift Card",
    duration: "1 hour",
    location: "EECS Building",
    age: "18-30",
    eligibility: "Students interested in AR/VR",
    description:
      "Test an augmented reality learning environment designed for engineering education.",
    apply: "https://example.com/apply3"
  }
];

const container = document.getElementById("studiesContainer");
const filterCheckbox = document.getElementById("remoteFilter");

function renderStudies() {

  container.innerHTML = "";

  const filtered = studies.filter(study => {
    if (!filterCheckbox.checked) return true;
    return study.location.toLowerCase().includes("remote");
  });

  filtered.forEach(study => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${study.title}</h2>
      <p><b>Reward:</b> ${study.reward}</p>
      <p><b>Duration:</b> ${study.duration}</p>
      <p><b>Location:</b> ${study.location}</p>
      <p><b>Age Requirement:</b> ${study.age}</p>
      <p><b>Eligibility:</b> ${study.eligibility}</p>
      <p>${study.description}</p>
      <a class="applyBtn" href="${study.apply}" target="_blank">Apply for Study</a>
    `;

    container.appendChild(card);
  });
}

filterCheckbox.addEventListener("change", renderStudies);

renderStudies();