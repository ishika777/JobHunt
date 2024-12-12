const express = require("express")
const {registerCompany, getCompany, getCompanyById, updateCompany} = require("../controllers/company-controller")
const isAuthenticated = require("../middlewares/isAuthenticated")
const singleUpload = require("../middlewares/multer").singleUpload

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany)
router.route("/get").get(isAuthenticated, getCompany)
router.route("/get/:id").get(isAuthenticated, getCompanyById)
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany)

module.exports = router;