const express = require("express");
const app = express();
const cors = require("cors");
const ytdl = require("ytdl-core");

const port = 5000;

app.use(express.json());
app.use(cors());

// resu formats
const getResu = (formats) => {
  let resuArray = [];

  for (let i = 0; i < formats.length; i++) {
    if (formats[i].qualityLabel !== null) {
      resuArray.push(formats[i]);
    }
  }

  return [...new Set(resuArray.map((v) => v.height))];
};

// get video info api
app.get("/api/get-video-info/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const { videoDetails, formats } = await ytdl.getInfo(videoId);

  const { title, thumbnails } = videoDetails;
  const videoResu = getResu(formats);

  return res.status(200).json({
    videoInfo: {
      title,
      thumbnailUrl: thumbnails[thumbnails.length - 1].url,
      videoResu,
      lastResu: videoResu[0],
    },
  });
});

app.get("/", (req, res) => {
  res.send("Hello Downloader");
});

app.listen(port, () => {
  console.log(`Downloader app server is running on port ${port}`);
});
