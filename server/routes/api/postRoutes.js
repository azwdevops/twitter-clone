const express = require("express");
const {
  getPosts,
  createPost,
  likePost,
  retweetPost,
} = require("../../controllers/postsController");

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.put("/:postId/like", likePost);
router.post("/:postId/retweet", retweetPost);

module.exports = router;
