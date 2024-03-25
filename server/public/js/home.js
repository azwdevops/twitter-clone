$(document).ready(() => {
  $.get("/api/posts/", (postsResults) => {
    outputPosts(postsResults, $(".postsContainer"));
  });
});

function outputPosts(results, container) {
  container.html("");

  let index = 0;
  for (const item of results) {
    container.append(createPostHtml(item));
  }

  if (results.length == 0) {
    container.append("<span class='no-results'>No posts found</span>");
  }
}
