import { Router } from "express";
import { prisma } from "@repo/database";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, bio, image, onboarding } = req.body;
  try {
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        bio, 
        image,
        onboarding: onboarding || {}
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { 
        _count: { select: { tasks: true, messages: true, agents: true } },
        agents: {
          select: { id: true, name: true, status: true }
        }
      }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio, image, onboarding } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { 
        ...(name && { name }),
        ...(bio && { bio }),
        ...(image && { image }),
        ...(onboarding && { onboarding })
      }
    });
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Get user's agents
router.get("/:id/agents", async (req, res) => {
  const { id } = req.params;
  try {
    const agents = await prisma.agent.findMany({
      where: { userId: id },
      include: {
        integrations: true,
        monitoringLogs: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    res.json(agents);
  } catch (error) {
    console.error("Error fetching user agents:", error);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

export default router;
