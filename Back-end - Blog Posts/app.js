const express = require("express");
const app = express();
const axios = require("axios");

app.set("json spaces", 2);

// Routes
app.get("/api/ping", (_, res) => {
  res.json({
    success: true
  });
});

app.get("/api/posts", async (req, res) => {
  let { tags, sortBy, direction } = req.query;
  sortBy = sortBy ? sortBy.trim(" ") : "id";
  direction = direction ? direction.trim(" ") : "asc";
  const validSortBy = ["id", "reads", "likes", "popularity"];
  const validDirection = ["asc", "desc"];
  const seen = new Set();

  //   Return error message 
  if (!tags) {
    return res.status(400).json({ error: "Tags parameter is required" });
  }

  if (!validSortBy.includes(sortBy.toLowerCase())) {
    return res.status(400).json({ error: "sortBy parameter is invalid" });
  }

  if (!validDirection.includes(direction.toLowerCase())) {
    return res.status(400).json({ error: "direction parameter is invalid" });
  }

  // Perform fetching based on the number of tags that are provided
  tags = tags.split(",");
  try {
    let posts = [].concat.apply(
      [],
      await Promise.all(
        tags.map(async tag => {
          response = await axios(
            `https://hatchways.io/api/assessment/blog/posts?tag=${tag.trim(
              " "
            )}&sortBy=${sortBy}&direction=${direction}`
          );
          // Removes duplicate results
          return response.data.posts.filter(post => {
            const duplicate = seen.has(post.id);
            seen.add(post.id);
            return !duplicate;
          });
        })
      )
    );

    // sort the posts arraylist based on the sortby
    posts.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    // return reverse posts array if direction is desecnding
    if (direction === "desc") return res.json({ posts: posts.reverse() });

    return res.json({ posts });
  } catch (err) {
    res.json({ posts: [] });
  }
});

// Listening port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
