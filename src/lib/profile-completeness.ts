export function getProfileCompleteness(profile: any, academicsCount: number = 0): number {
  if (!profile) return 0;
  
  const fields = [
    { value: profile.full_name, weight: 10 },
    { value: profile.username, weight: 10 },
    { value: profile.city, weight: 10 },
    { value: profile.bio, weight: 15 },
    { value: profile.linkedin_url, weight: 10 },
    { value: profile.github_url, weight: 10 },
    { value: academicsCount > 0, weight: 15 },
    { value: profile.skills && profile.skills.length > 0, weight: 10 },
    { value: profile.portfolio_url, weight: 5 },
    { value: profile.avatar_url, weight: 5 },
  ];

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
  const earnedWeight = fields.reduce((sum, f) => sum + (f.value ? f.weight : 0), 0);

  return Math.round((earnedWeight / totalWeight) * 100);
}
