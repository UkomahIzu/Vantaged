export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: "add" | "organize" | "sync" | "collaborate";
  badge?: string;
  isAddButton?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  project: string;
  timeRange: string;
  dateStr: string;
  isHighlighted?: boolean;
  type: "event" | "message";
  sender?: string;
  snippet?: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  stageTag: string;
  categoryTag: string;
  priority: "High" | "Medium" | "Low";
  assignee: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface ScheduleEvent {
  id: string;
  timeSlot: string;
  title: string;
  locationOrType: string;
  category: string;
}

export interface DayItem {
  dayNumber: number;
  dayName: string;
  isActive?: boolean;
}

export interface TaskProgressItem {
  id: string;
  title: string;
  duration: string;
  progressPercent: number;
  commentsCount: number;
  photosCount?: number;
  deadline?: string;
}

export interface CircularMetric {
  id: string;
  title: string;
  category: string;
  percentage: number;
  accentColor: string;
  summaryText: string;
  actionText?: string;
}

export interface MeetingItem {
  title: string;
  datetime: string;
  description: string;
  location: string;
}
