import React, { useState } from "react";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";

const Download = () => {
  const [link, setLink] = useState("");
  const [vdInfo, setVdInfo] = useState("");
  const [resu, setResu] = useState("");
  const [loader, setLoader] = useState(false);

  // get video id from video link
  const videoIdOne = link.split("https://youtu.be/")[1];
  const videoIdTwo = link.split("https://www.youtube.com/watch?v=")[1];

  //   for get input valu with onChange
  const handleChange = (e) => {
    setLink(e.target.value);
  };

  // form submit
  const videoDetailsGet = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/get-video-info/${videoIdOne || videoIdTwo}`
      );
      setLoader(false);
      setVdInfo(data.videoInfo);
      setResu(data.videoInfo.lastResu);
    } catch (error) {
      console.log(error.response);
    }
  };

  // console.log(vdInfo);
  // console.log(resu)

  // video download function
  const handleVideoDownload = () => {
    const url = `http://localhost:5000/download-video/?id=${videoIdOne || videoIdTwo}&resolution=${resu}`;
    window.location.href = url;
  };

  return (
    <div className="w-[800px] h-[600px] bg-gray-900 flex flex-col justify-start items-center p-4 relative">
      <h1 className="text-white text-4xl py-6 uppercase">
        YT Video downloader
      </h1>

      {/* input section */}
      <div className="mt-8">
        <form onSubmit={videoDetailsGet}>
          <input
            onChange={handleChange}
            required
            type="text"
            placeholder="Input the video link here"
            className="text-white outline-none bg-transparent w-[465px] h-[40px] px-3 overflow-hidden border border-yellow-600"
          />

          <button type="submit" className="button animation">
            Click
          </button>
        </form>
      </div>

      {/* video info */}
      <div className="mt-14">
        {loader ? (
          <div className="w-full py-20 text-center">
            <ScaleLoader color="#d9a521" />
          </div>
        ) : (
          vdInfo && (
            <div className="flex gap-3 my-10 w-[470px]">
              {/* thumbnail img */}
              <img
                src={vdInfo.thumbnailUrl}
                alt="video thumbnail"
                className="w-56 h-44 rounded-lg border-2 border-yellow-600 p-2"
              />

              {/* info */}
              <div className="text-white flex flex-col gap-3">
                <h2>{vdInfo.title.slice(0, 50)}...</h2>
                <span>Time : 08:33</span>

                {/* resu */}
                <div>
                  <select
                    onChange={(e) => setResu(e.target.value)}
                    defaultValue={vdInfo.lastResu}
                    className="px-3 py-2 outline-none bg-transparent border border-yellow-600 w-full"
                  >
                    {vdInfo.videoResu.length > 0 &&
                      vdInfo.videoResu.map((data, index) => (
                        <option
                          key={index}
                          value={data}
                          className="bg-gray-900"
                        >
                          {data}p
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={handleVideoDownload}
                    className="button animation"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Download;
