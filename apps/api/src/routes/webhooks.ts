import { Router } from "express";
import { prisma } from "@repo/database";

const router = Router();

// Slack Webhook
router.post("/slack", async (req, res) => {
  const { type, challenge, event } = req.body;

  // Handle URL verification challenge
  if (type === "url_verification") {
    return res.status(200).json({ challenge });
  }

  console.log("Slack event received:", type, event);
  
  // Example: Log external activity
  // await prisma.activity.create({ ... })
  
  res.status(200).send("OK");
});

// Zapier Webhook
router.post("/zapier", async (req, res) => {
  const payload = req.body;
  console.log("Zapier webhook received:", payload);
  res.status(200).json({ success: true });
});

// Notion Webhook
router.post("/notion", async (req, res) => {
  const payload = req.body;
  console.log("Notion webhook received:", payload);
  res.status(200).send("OK");
});

// Salesforce Webhook
router.post("/salesforce", async (req, res) => {
  const payload = req.body;
  console.log("Salesforce webhook received:", payload);
  res.status(200).send("OK");
});

// Google Pub/Sub Webhook
router.post("/google", async (req, res) => {
  const payload = req.body;
  console.log("Google webhook received:", payload);
  res.status(200).send("OK");
});

export default router;
