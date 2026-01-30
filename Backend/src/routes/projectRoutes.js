const express = require("express");
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  addMember,
} = require("../controllers/projectController");
const { auth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.use(auth);

router.get("/", listProjects);
router.post("/", requireRole("admin", "manager"), createProject);
router.get("/:id", getProject);
router.patch("/:id", requireRole("admin", "manager"), updateProject);
router.post("/:id/members", requireRole("admin", "manager"), addMember);

module.exports = router;
