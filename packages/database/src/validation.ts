import { z } from "zod";

// User validation
export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  onboarding: z.record(z.any()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  image: z.string().url().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  image: z.string().url().optional(),
  onboarding: z.record(z.any()).optional(),
});

// Agent validation
export const AgentSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string(),
  role: z.string(),
  status: z.enum(["IDLE", "RUNNING", "PAUSED", "ERROR"]).default("IDLE"),
  config: z.record(z.any()).default({}),
  instructions: z.string().optional(),
  model: z.string().optional(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAgentSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Agent type is required"),
  role: z.string().min(1, "Agent role is required"),
  instructions: z.string().optional(),
  model: z.string().optional(),
  config: z.record(z.any()).optional(),
});

export const UpdateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["IDLE", "RUNNING", "PAUSED", "ERROR"]).optional(),
  config: z.record(z.any()).optional(),
  instructions: z.string().optional(),
  model: z.string().optional(),
});

// Task validation
export const TaskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
});

// Workflow validation
export const WorkflowSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  definition: z.record(z.any()).default({}),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().optional(),
  definition: z.record(z.any()).optional(),
});

// Error response
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type Agent = z.infer<typeof AgentSchema>;
export type CreateAgent = z.infer<typeof CreateAgentSchema>;
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>;

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;

export type Workflow = z.infer<typeof WorkflowSchema>;
export type CreateWorkflow = z.infer<typeof CreateWorkflowSchema>;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
