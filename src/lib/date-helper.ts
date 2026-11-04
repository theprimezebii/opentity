// Returns a consistent local date string (YYYY-MM-DD) based on user's timezone
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Returns a stable local day index (for deterministic selections)
export function getLocalDayIndex(date: Date = new Date()): number {
  // Use local date components to avoid UTC offset issues
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return year * 1000 + month * 100 + day;
}
