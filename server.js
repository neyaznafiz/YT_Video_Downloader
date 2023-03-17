const express = require("express");
const app = express();
const cors = require("cors");
const ytdl = require("ytdl-core");
const { chain, forEach } = require("lodash");
const ffmpegPath = require("ffmpeg-static");
const { spawn } = require("child_process");
const sanitize = require("sanitize-filename");

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

// video download api
app.get("/download-video", async (req, res) => {
  const { id, resolution } = req.query;

  try {
    const {
      videoDetails: { title },
      formats,
    } = await ytdl.getInfo(id);

    const vFormate = chain(formats)
      .filter(
        ({ height, codecs }) =>
          height &&
          height === parseInt(resolution) &&
          codecs?.startsWith("avc1")
      )
      .orderBy("fps", "desc")
      .head()
      .value();

    const strems = {};
    strems.video = ytdl(id, { quality: vFormate.itag });
    strems.audio = ytdl(id, { quality: "highestaudio" });

    const pipes = {
      out: 1,
      err: 2,
      video: 3,
      audio: 4
    };

    const ffmpegInputOption = {
      video: [
        "-i",
        `pipe:${pipes.video}`,
        "-i",
        `pipe:${pipes.audio}`,
        "-map",
        "0:v",
        "-map",
        "1:a",
        "-c:v",
        "copy",
        "-c:a",
        "libmp3lame",
        "-crf",
        "27",
        "-preset",
        "veryfast",
        "-movflags",
        "frag_keyframe+empty_moov",
        "-f",
        "mp4",
      ],
    };

    const ffmpegOption = [
      ...ffmpegInputOption.video,
      "-loglevel",
      "error",
      "-",
    ];

    const ffmpegProcess = spawn(ffmpegPath, ffmpegOption, {
      stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
    });

    const errorHandle = (err) => console.log(err);

    forEach(strems, (stream, format) => {
      const dest = ffmpegProcess.stdio[pipes[format]];
      stream.pipe(dest).on("error", errorHandle);
    });

    ffmpegProcess.stdio[pipes.out].pipe(res);
    let ffmpegLog = "";

    ffmpegProcess.stdio[pipes.err].on(
      "data",
      (chunk) => (ffmpegLog += chunk.toString())
    );

    ffmpegProcess.on("exit", (exitCode) => {
      if (exitCode === 1) {
        console.log(ffmpegLog);
      }
      res.end();
    });

    ffmpegProcess.on("close", () => ffmpegProcess.kill());

    const fileName = `${encodeURI(sanitize(title))}.mp4`;

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}; fileName*=uft-8''${fileName}`
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello Downloader");
});

app.listen(port, () => {
  console.log(`Downloader app server is running on port ${port}`);
});
