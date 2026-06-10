const router = require("express").Router();
const Project = require("../models/Project");

router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description
    });

    res.json(project);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project Deleted"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;