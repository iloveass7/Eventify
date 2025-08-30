// src/data/interests.js
export const interestsData = [
  { id: "conference", name: "Conference", icon: "🏛️" },
  { id: "workshop",   name: "Workshop",   icon: "🛠️" },
  { id: "seminar",    name: "Seminar",    icon: "🎓" },
  { id: "networking", name: "Networking", icon: "🤝" },
  { id: "concert",    name: "Concert",    icon: "🎤" },
  { id: "festival",   name: "Festival",   icon: "🎪" },
  { id: "sports",     name: "Sports",     icon: "🏅" },
  { id: "exhibition", name: "Exhibition", icon: "🖼️" },
  { id: "other",      name: "Other",      icon: "📚" },
];

export const getInterestById = (id) => interestsData.find((i) => i.id === id);
export const INTEREST_IDS = interestsData.map((i) => i.id);
export const INTEREST_SET = new Set(INTEREST_IDS);
