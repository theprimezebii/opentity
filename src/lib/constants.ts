export const APP_NAME = "Opentity";
export const APP_DESCRIPTION = "Discover global hackathons, tech competitions, and AI events. Built for students and developers worldwide.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://opentity.com";

// Sorted A-Z
export const EVENT_TYPES = [
  "Bootcamp",
  "Competition",
  "Conference",
  "Hackathon",
  "Other",
  "Webinar",
  "Workshop"
] as const;

// Sorted A-Z
export const EVENT_CATEGORIES = [
  "AI",
  "Blockchain",
  "Cybersecurity",
  "Data Science",
  "Game Development",
  "IoT",
  "Mobile",
  "Other",
  "Web Development"
] as const;

// Sorted A-Z
export const EVENT_FORMATS = [
  "Hybrid",
  "In-person",
  "Online"
] as const;

// Sorted A-Z globally
export const GLOBAL_CITIES = [
  "Abu Dhabi",
  "Amsterdam",
  "Austin",
  "Bangalore",
  "Beijing",
  "Berlin",
  "Chicago",
  "Delhi",
  "Doha",
  "Dubai",
  "Faisalabad",
  "Hong Kong",
  "Hyderabad",
  "Islamabad",
  "Karachi",
  "Lahore",
  "London",
  "Los Angeles",
  "Multan",
  "Mumbai",
  "New York",
  "Online",
  "Other",
  "Paris",
  "Peshawar",
  "Pune",
  "Quetta",
  "Rawalpindi",
  "Riyadh",
  "San Francisco",
  "Seattle",
  "Shanghai",
  "Shenzhen",
  "Singapore",
  "Sydney",
  "Tokyo",
  "Toronto"
] as const;

export const PAKISTAN_CITIES = GLOBAL_CITIES; // Alias for backwards compatibility

export const EVENT_STATUSES = ["upcoming", "ongoing", "past", "cancelled"] as const;
export const SUBMISSION_STATUSES = ["pending", "approved", "rejected"] as const;
