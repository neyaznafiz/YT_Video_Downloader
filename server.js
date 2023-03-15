const express = require("express");
const app = express();
const cors = require("cors");
const ytdl = require('ytdl-core')

const port = 5000;

app.use(express.json());
app.use(cors());

// get video info api
app.get("/api/get-video-info/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const {videoDetails, formats} = await ytdl.getInfo(videoId)
  console.log(formats)
});

app.get("/", (req, res) => {
  res.send("Hello Downloader");
});

app.listen(port, () => {
  console.log(`Downloader app server is running on port ${port}`);
});
