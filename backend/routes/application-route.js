const express = require("express")
const {applyJob, getAppliedJobs, getApplications, updateStatus} = require("../controllers/application-controller")
const isAuthenticated = require("../middlewares/isAuthenticated")

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob)
router.route("/get").get(isAuthenticated, getAppliedJobs)
router.route("/:id/applicants").get(isAuthenticated, getApplications)
router.route("/status/:id/update").post(isAuthenticated, updateStatus)

module.exports = router;
