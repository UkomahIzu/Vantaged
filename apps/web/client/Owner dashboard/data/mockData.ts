import {
  QuickActionItem,
  NotificationItem,
  AssignmentItem,
  ScheduleEvent,
  DayItem,
  TaskProgressItem,
  CircularMetric,
  MeetingItem,
} from "../types";

export const quickActionList: QuickActionItem[] = [
  {
    id: "add-new",
    title: "",
    subtitle: "",
    iconType: "add",
    isAddButton: true,
  },
  {
    id: "stay-organized",
    title: "Stay organized",
    subtitle: "A clear structure for stages & proofs",
    iconType: "organize",
  },
  {
    id: "sync-notes",
    title: "Sync your notes",
    subtitle: "Ensure that site proofs are verified",
    iconType: "sync",
  },
  {
    id: "collaborate-share",
    title: "Collaborate and share",
    subtitle: "Share progress with family & reps",
    iconType: "collaborate",
    badge: "-5%",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Upcoming event",
    project: "Landing design meeting | Time: 120 min",
    timeRange: "11:00 AM – 11:45 AM",
    dateStr: "Sat, 10 May",
    isHighlighted: true,
    type: "event",
  },
  {
    id: "notif-2",
    title: "Message | Product design",
    project: "Site inspection batch notes uploaded",
    timeRange: "10:15 AM",
    dateStr: "Today",
    type: "message",
    sender: "Ken Smith",
    snippet: "Hey James, just uploaded the rebar test certs for foundation phase...",
  },
];

export const currentAssignment: AssignmentItem = {
  id: "asg-1",
  title: "Design a packaging concept for a new product",
  stageTag: "Package design",
  categoryTag: "Motion design",
  priority: "High",
  assignee: {
    name: "Rachel Lee",
    role: "Lead Designer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
  },
};

export const calendarDays: DayItem[] = [
  { dayNumber: 14, dayName: "Mon" },
  { dayNumber: 15, dayName: "Tue" },
  { dayNumber: 16, dayName: "Wed" },
  { dayNumber: 17, dayName: "Thu" },
  { dayNumber: 18, dayName: "Fri", isActive: true },
  { dayNumber: 19, dayName: "Sat" },
  { dayNumber: 20, dayName: "Sun" },
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "ev-1",
    timeSlot: "04:30–05:00 PM",
    title: "Team meeting",
    locationOrType: "12:00 - 12:30 PM • UI/UX design",
    category: "Site Milestone",
  },
  {
    id: "ev-2",
    timeSlot: "11:30–12:30 PM",
    title: "Meeting with new client",
    locationOrType: "12:30 - 01:30 PM • Job interview",
    category: "Contractor Review",
  },
];

export const todayTasks: TaskProgressItem[] = [
  {
    id: "task-1",
    title: "Conduct research",
    duration: "02 h 45 m",
    progressPercent: 90,
    commentsCount: 4,
    photosCount: 16,
  },
  {
    id: "task-2",
    title: "Schedule a meeting",
    duration: "06 h 55 m",
    progressPercent: 50,
    commentsCount: 4,
    deadline: "3 June",
  },
  {
    id: "task-3",
    title: "Send out reminders",
    duration: "01 h 30 m",
    progressPercent: 10,
    commentsCount: 16,
    deadline: "3 June",
  },
];

export const circularMetrics: CircularMetric[] = [
  {
    id: "metric-1",
    title: "Data Research",
    category: "Marketing",
    percentage: 90,
    accentColor: "#2E9E57", // Green
    summaryText: "You marked 5/5. All assignments are done!",
  },
  {
    id: "metric-2",
    title: "UI/UX Design",
    category: "Typography",
    percentage: 65,
    accentColor: "#EF5F18", // Orange
    summaryText: "You marked 3/5. 2 assignments left.",
    actionText: "Check",
  },
];

export const upcomingMeeting: MeetingItem = {
  title: "Board meeting",
  datetime: "March 24 at 4:00 PM",
  description: "Meeting with John Smith, 4th floor, room 159",
  location: "4th floor, room 159",
};
