const studies = [
{
title: "Human-AI Interaction Study",
reward: "$15 Amazon Gift Card",
duration: "30 minutes",
location: "Remote (Zoom)",
age: "18+",
eligibility: "EECS Students",
description: "Participate in a study exploring how students interact with AI tools for programming.",
apply: "https://example.com"
},

{
title: "Mobile App Usability Study",
reward: "$20 Cash",
duration: "45 minutes",
location: "North Campus Lab",
age: "18+",
eligibility: "Any U-M student",
description: "Help researchers evaluate the usability of a new mobile learning platform.",
apply: "https://example.com"
},

{
title: "AR Learning Experiment",
reward: "$25 Gift Card",
duration: "1 hour",
location: "EECS Building",
age: "18-30",
eligibility: "Students interested in AR/VR",
description: "Test an augmented reality learning environment designed for engineering education.",
apply: "https://example.com"
}
]

const container = document.getElementById("studiesContainer")
const filter = document.getElementById("remoteFilter")

function renderStudies(){

container.innerHTML=""

const filtered = studies.filter(study=>{
if(!filter.checked) return true
return study.location.toLowerCase().includes("remote")
})

filtered.forEach(study=>{

const card=document.createElement("div")

card.className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"

card.innerHTML=`

<h2 class="text-xl font-semibold mb-2">${study.title}</h2>

<p class="text-sm text-gray-600 mb-2">${study.description}</p>

<div class="space-y-1 text-sm mb-4">
<p><b>Reward:</b> ${study.reward}</p>
<p><b>Duration:</b> ${study.duration}</p>
<p><b>Location:</b> ${study.location}</p>
<p><b>Age:</b> ${study.age}</p>
<p><b>Eligibility:</b> ${study.eligibility}</p>
</div>

<a href="${study.apply}" target="_blank"
class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
Apply
</a>
`

container.appendChild(card)

})

}

filter.addEventListener("change",renderStudies)

renderStudies()