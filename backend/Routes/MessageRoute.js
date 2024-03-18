const express = require("express");
const router = express.Router();
const Message = require("../Models/Message");
const History = require("../Models/History");
const Product = require("../Models/Products");
const User = require("../Models/User");

// Endpoint to fetch messages for admin user
router.get("/toAdmin/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userMessages = await Message.find({
      from: userId,
      toAdmin: true,
    }).sort({ createdAt: 1 });

    const adminMessages = await Message.find({
      role: "admin",
      to: userId,
    }).sort({ createdAt: 1 });

    const allMessages = [...userMessages, ...adminMessages].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    res.json(allMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/support", async (req, res) => {
  try {
    // Find user messages sent to admin
    const userMessages = await Message.find({ toAdmin: true }).sort({
      createdAt: 1,
    });

    // Group user messages by user ID
    const userMessagesGrouped = userMessages.reduce((acc, message) => {
      const userId = message.from;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(message);
      return acc;
    }, {});

    // Find admin responses to user messages
    const adminMessages = await Message.find({ role: "admin" }).sort({
      createdAt: 1,
    });

    // Group admin responses by user ID
    const adminMessagesGrouped = adminMessages.reduce((acc, message) => {
      const userId = message.to;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(message);
      return acc;
    }, {});

    // Combine user messages and admin responses
    const allMessages = Object.keys(userMessagesGrouped)
      .flatMap((userId) => {
        const userMsgs = userMessagesGrouped[userId] || [];
        const adminMsgs = adminMessagesGrouped[userId] || [];
        return [...userMsgs, ...adminMsgs];
      })
      .concat(
        adminMessages.filter((msg) => !msg.to || !userMessagesGrouped[msg.to])
      );

    // Sort all messages by createdAt timestamp
    allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.json(allMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/merchants", async (req, res) => {
    try {
        const merchants = await Product.find({}).populate('userId'); // Populate the 'userId' field

        console.log(merchants)
        // Initialize a set to store unique user details
        const userDetailsSet = new Set();

        // Extract userId and associated user details from each product
        merchants.forEach(product => {
            const userDetails = {
                id: product.userId._id,
                name: product.userId.name,
                email: product.userId.email,
            };
            userDetailsSet.add(userDetails);
        });

        res.json([...userDetailsSet]);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
