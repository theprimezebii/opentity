"use server";

export async function generateAIBio(profile: any) {
  // In a real production app, you would call OpenAI/Gemini here using an API key.
  // For now, we use a smart template that generates a highly professional bio.
  
  const skills = profile.skills && profile.skills.length > 0 ? profile.skills.join(", ") : "software development";
  const major = profile.major || "Computer Science";
  const uni = profile.university || "my university";
  
  const templates = [
    `${major} student at ${uni} with a strong passion for building innovative solutions using ${skills}. Actively seeking opportunities to collaborate and solve real-world problems.`,
    `Aspiring developer based in ${profile.city || "Pakistan"}, specializing in ${skills}. I love turning complex challenges into elegant, user-friendly applications.`,
    `Detail-oriented ${major} student at ${uni}. Proficient in ${skills} with a proven track record of building impactful projects during hackathons and beyond.`
  ];

  // Pick a random template
  const randomBio = templates[Math.floor(Math.random() * templates.length)];
  
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  return { bio: randomBio };
}
