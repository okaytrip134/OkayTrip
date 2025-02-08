const express = require("express");
const router = express.Router();
const { getBanner, updateBanner } = require("../../controllers/bannerController")
const upload = require("../../middlewares/uploadBannersMiddleware");

router.get("/", getBanner);
router.put("/", upload.single("image"), updateBanner);

module.exports = router;
