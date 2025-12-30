const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const { Resend } = require("resend");

/* =====================
   RESEND CONFIG
===================== */
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   CREATE MESSAGE (PUBLIC)
========================= */
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      message,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("CONTACT CREATE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* =========================
   GET ALL MESSAGES (ADMIN)
========================= */
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/* =========================
   TOGGLE READ / UNREAD
========================= */
router.put("/:id/read", async (req, res) => {
  try {
    const { isRead } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to update read status" });
  }
});

/* =========================
   DELETE MESSAGE (ADMIN)
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

/* =========================
   SEND REPLY (EMAIL ONLY)
========================= */
router.post("/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply is required" });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: message.email,
      subject: "Reply from WellSpa",
      html: `
        <p>Hello ${message.firstName},</p>
        <p>${reply}</p>
        <br />
        <p>Regards,<br/>WellSpa Team</p>
      `,
    });

    message.reply = reply;
    message.isRead = true;
    await message.save();

    res.json({ success: true, message: "Reply sent successfully" });
  } catch (err) {
    console.error("REPLY ERROR:", err);
    res.status(500).json({ message: "Failed to send reply" });
  }
});

module.exports = router;
