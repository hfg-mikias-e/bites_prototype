export const categories = [
  {
    name: "Thinking",
    skills: [
      "Self-Management",
      "Communication & Conflict Resolution",
      "Innovation & Creativity",
      "Systemic & Critical Thinking",
    ],
  },
  {
    name: "Acting",
    skills: [
      "Collaboration",
      "Teaching",
      "Inspire Others",
      "Sense of Responsibility",
      "Self-confidence",
    ],
  },
  {
    name: "Feeling",
    skills: [
      "Emotional Empathy",
      "Foster Relationships",
      "Personal Well-being",
      "Appreciation",
    ],
  },
];

export const content = [
  {
    name: "Introduction to the Pomodoro Technique",
    skill: categories[0].skills[0],
    minutes: 3,
    description: "Boost your productivity through focused work and break intervals",
    practical: false,
    type: "book",
    quiz: [
      {
        question: "The Pomodoro-technique trains your time management.",
        answer: true,
      },
      {
        question:
          "After every other Pomodoro (25-minute unit), you should take a longer break of 15-30 minutes.",
        answer: false,
      },
    ]
  },
  {
    name: "Using the Pomodoro Technique",
    skill: categories[0].skills[0],
    tag: "working with a timer",
    description: "Boost your productivity through focused work and break intervals",
    practical: true,
    type: "clock",
    locked_by: 0,
  },
  {
    name: "The 4-7-8 Breathing Technique",
    skill: categories[2].skills[2],
    practical: true,
    type: "headphones",
    minutes: 4,
    description: "Relax and reduce your stress by regulating your breath"
  },
  {
    name: "The Massive Transformative Purpose",
    skill: categories[1].skills[2],
    practical: false,
    description: "Fuel your team’s alignment and innovation for sustained success",
    type: "film",
    minutes: 5
  },
];
