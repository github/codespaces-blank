import { Router } from "express";

const router = Router();

// In-memory task storage (will be replaced by database)
let tasks: any[] = [];

router.get("/", async (req, res) => {
  const { userId, status } = req.query;

  let filteredTasks = tasks;

  if (userId) {
    filteredTasks = filteredTasks.filter(task => task.assigneeId === userId);
  }

  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }

  // Sort by updatedAt desc like the real implementation
  filteredTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  res.json(filteredTasks);
});

router.post("/", async (req, res) => {
  const { title, description, status = 'TODO', priority = 'MEDIUM', assigneeId, dueDate } = req.body;

  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description,
    status,
    priority,
    assigneeId,
    dueDate: dueDate ? new Date(dueDate) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update the task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

export default router;
