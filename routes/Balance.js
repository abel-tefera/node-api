const express = require("express");

const router = express.Router();

const { sendCoin, checkBalance } = require("../controllers/balance");
const { protect } = require("../middleware/protect");

router.route("/send").post(protect, sendCoin);
router.route("/check").get(protect, checkBalance);

module.exports = router;