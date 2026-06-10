const router = require("express").Router();
const Activity = require("../models/Activity");

router.get("/", async (req, res) => {
  try {
    const activities =
      await Activity.find()
        .sort({ createdAt: -1 })
        .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;