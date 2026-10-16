const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.post("/", postController.create);
router.put("/:id", postController.update);
router.patch("/:id", postController.patch);
router.delete("/:id", postController.remove);

module.exports = router;
