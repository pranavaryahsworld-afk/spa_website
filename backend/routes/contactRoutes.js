const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");

/* =========================
   CREATE MESSAGE (USER)
========================= */
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // 🔥 VALIDATION (FIX)
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone, // 🔥 FIXED
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("CONTACT CREATE ERROR:", error);
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
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/* =========================
   TOGGLE READ / UNREAD
========================= */
router.put("/:id/read", async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.isRead = req.body.isRead;
    await message.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update read status" });
  }
});

/* =========================
   DELETE MESSAGE
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

/* =========================
   SEND REPLY (EMAIL)
========================= */
router.post("/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "Reply is required" });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.reply = reply;
    message.isRead = true;
    await message.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WellSpa" <${process.env.EMAIL_USER}>`,
      to: message.email,
      subject: "Reply from WellSpa",
      text: reply,
    });

    res.json({ success: true, message: "Reply sent" });
  } catch (err) {
    console.error("REPLY ERROR:", err);
    res.status(500).json({ message: "Failed to send reply" });
  }
});

module.exports = router;
