export type CohortStatus =
  | "upcoming"
  | "accepting_applications"
  | "selection_in_progress"
  | "active"
  | "completed";

export type SelectionMethod = "google_meet" | "form";

export type UserRole = "student" | "admin" | "founder";

export type ApplicationStatus =
  | "pending"
  | "meet_scheduled"
  | "meet_completed"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "enrolled";

export type ProjectStatus =
  | "idea"
  | "in_progress"
  | "shipped"
  | "featured"
  | "demo_day_ready";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type ContentType =
  | "video"
  | "reading"
  | "exercise"
  | "quiz"
  | "live_session"
  | "assignment";

export type PointReasonCode =
  | "lesson_complete"
  | "quiz_passed"
  | "project_shipped"
  | "project_live"
  | "streak_7day"
  | "streak_14day"
  | "founder_feedback"
  | "demo_day"
  | "bonus"
  | "first_project"
  | "early_bird";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "announcement"
  | "session_reminder";

export type HearFrom =
  | "instagram"
  | "youtube"
  | "friend"
  | "linkedin"
  | "twitter"
  | "google"
  | "other";

export interface Cohort {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  max_seats: number;
  enrolled_count: number;
  selection_method: SelectionMethod;
  google_meet_link: string | null;
  meet_schedule: MeetScheduleSlot[];
  start_date: string | null;
  end_date: string | null;
  status: CohortStatus;
  is_founding_cohort: boolean;
  created_at: string;
}

export interface MeetScheduleSlot {
  date: string;
  time: string;
  slots_available: number;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  class: "11" | "12" | null;
  city: string | null;
  state: string | null;
  school: string | null;
  about_self: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_handle: string | null;
  role: UserRole;
  cohort_id: string | null;
  avatar_url: string | null;
  avatar_color: string;
  streak_days: number;
  last_active_at: string | null;
  total_points: number;
  cohort_rank: number | null;
  current_week: number | null;
  current_project: string | null;
  is_active: boolean;
  notes_by_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  class: "11" | "12";
  city: string;
  state: string | null;
  school: string;
  age: number | null;
  why_nextera: string;
  built_before: string | null;
  dream_project: string | null;
  heard_from: HearFrom;
  meet_slot_requested: string | null;
  meet_slot_confirmed: string | null;
  meet_completed: boolean;
  meet_notes: string | null;
  meet_recording_url: string | null;
  status: ApplicationStatus;
  cohort_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  internal_notes: string | null;
  rating: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetSession {
  id: string;
  cohort_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  session_type: "group" | "individual";
  google_meet_link: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
}

export interface MeetRegistration {
  id: string;
  session_id: string;
  application_id: string;
  confirmed: boolean;
  attended: boolean | null;
  notes: string | null;
  created_at: string;
}

export interface CurriculumWeek {
  id: string;
  cohort_id: string | null;
  week_number: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  what_you_build: string | null;
  live_session_date: string | null;
  live_session_link: string | null;
  unlock_on_date: string | null;
  is_locked: boolean;
  is_demo_week: boolean;
  order_index: number | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  week_id: string;
  title: string;
  description: string | null;
  content_type: ContentType;
  content_url: string | null;
  content_body: string | null;
  duration_minutes: number | null;
  order_index: number | null;
  is_locked: boolean;
  points_on_complete: number;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent_minutes: number;
  notes: string | null;
}

export interface Project {
  id: string;
  student_id: string;
  cohort_id: string | null;
  title: string;
  description: string | null;
  problem_solved: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  demo_video_url: string | null;
  thumbnail_url: string | null;
  status: ProjectStatus;
  week_number: number | null;
  is_capstone: boolean;
  feedback_by_vishal: string | null;
  feedback_by_naman: string | null;
  points_earned: number;
  is_public: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface PointsLog {
  id: string;
  student_id: string;
  cohort_id: string | null;
  points: number;
  reason: string;
  reason_code: PointReasonCode;
  reference_id: string | null;
  awarded_by: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  student_id: string;
  session_date: string;
  messages: ChatMessage[];
  message_count: number;
  topics_discussed: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  cohort_id: string | null;
  title: string;
  message: string;
  type: NotificationType;
  action_label: string | null;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  application_id: string | null;
  student_id: string | null;
  original_price: number;
  coupon_code: string | null;
  discount_amount: number;
  final_amount: number;
  currency: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  original_price: number;
  final_price: number | null;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  applies_to_cohort: string | null;
  created_at: string;
}
