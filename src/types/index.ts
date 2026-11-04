export type EventCategory =
  | "AI"
  | "Web Development"
  | "Mobile"
  | "Data Science"
  | "Cybersecurity"
  | "Blockchain"
  | "IoT"
  | "Game Development"
  | "Other";

export type EventFormat = "Online" | "In-person" | "Hybrid";
export type EventStatus = "upcoming" | "ongoing" | "past" | "cancelled";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  format: EventFormat;
  city: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  prize_pool: string | null;
  eligibility: string | null;
  registration_url: string;
  source_url: string | null;
  source_name: string | null;
  organizer: string | null;
  image_url: string | null;
  status: EventStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  university: string | null;
  city: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface SavedEvent {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface EventSubmission {
  id: string;
  submitted_by: string | null;
  submitter_email: string | null;
  title: string;
  description: string;
  category: EventCategory;
  format: EventFormat;
  city: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  prize_pool: string | null;
  eligibility: string | null;
  registration_url: string;
  source_url: string | null;
  organizer: string | null;
  status: SubmissionStatus;
  reviewer_notes: string | null;
  created_at: string;
}
