import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Define your enum for TodoStatus
export enum TodoStatus {
  Pending = 'pending',
  InProgress = 'in progress',
  Done = 'done',
}

// Define your enum for TaskType
export enum TaskType {
  Backlog = 'backlog',
  Tasks = 'tasks',
}

// Define your table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").notNull(),
  content: text("content").notNull(),
  userName: text("userName").notNull(),
  status: text("status").notNull().default(TodoStatus.Pending),
  type: text("type").notNull().default(TaskType.Tasks),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  
  
  
});