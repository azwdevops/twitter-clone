const Post = require("../models/postModel");
const User = require("../models/userModel");

module.exports.createPost = async (req, res, next) => {
  if (!req.body.content) {
    console.log("Content param not sent with request");
    return res.sendStatus(400);
  }
  var postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };
  Post.create(postData)
    .then(async (newPost) => {
      // using populate below enables foreign key traversing  e.g user.email
      newPost = await User.populate(newPost, { path: "postedBy" });
      res.status(201).send(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
};

module.exports.getPosts = (req, res, next) => {
  Post.find()
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .then((postsResults) => {
      res.status(200).send(postsResults);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
};

module.exports.likePost = async (req, res, next) => {
  var postId = req.params.postId;
  var userId = req.session.user._id;
  var isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);

  // we use the option, is liked, then we use pull to remove the like, else we use addToSet to add to likes
  var option = isLiked ? "$pull" : "$addToSet";
  // insert user like
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
  });

  // insert post like
  var post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  res.status(200).send(post);
};
module.exports.retweetPost = async (req, res, next) => {
  var postId = req.params.postId;
  var userId = req.session.user._id;

  // try and delete retweet
  var deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId,
  }).catch((err) => {
    console.log(err);

    req.sendStatus(400);
  });

  // we use the option, is liked, then we use pull to remove the like, else we use addToSet to add to likes
  var option = deletedPost != null ? "$pull" : "$addToSet";

  var repost = deletedPost;
  if (repost == null) {
    repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
      (err) => {
        console.log(err);
        res.sendStatus(400);
      }
    );
  }

  // insert user like
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { retweets: repost._id } },
    { new: true }
  ).catch((err) => {
    console.log(err);
  });

  // insert post retweet
  var post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { retweetUsers: postId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  res.status(200).send(post);
};
