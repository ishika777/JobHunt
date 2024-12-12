const express = require("express")
const {postJob, getAllJob, geJobById, getAdminJobs} = require("../controllers/job-controller")
const isAuthenticated = require("../middlewares/isAuthenticated")

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob)
router.route("/get").get(isAuthenticated, getAllJob)
router.route("/get/:id").get(isAuthenticated, geJobById)
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs)

module.exports = router;