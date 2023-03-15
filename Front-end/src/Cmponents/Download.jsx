import React, { useState } from "react";
import axios from "axios";

const Download = () => {
  const [link, setLink] = useState("");
  const [vdInfo, setVdInfo] = useState("");

  //   for get input valu with onChange
  const handleChange = (e) => {
    setLink(e.target.value);
  };

  // form submit
  const videoDetailsGet = async (e) => {
    e.preventDefault();

    const videoIdOne = link.split("https://youtu.be/")[1];
    const videoIdTwo = link.split("https://www.youtube.com/watch?v=")[1];

    try {
      const { data } = await axios.get(`http://localhost:5000/api/get-video-info/${videoIdOne || videoIdTwo}`);

      console.log(data)
    } catch (error) {
     console.log(error.response)   
    }
  };

  return (
    <div className="w-[600px] h-[500px] bg-gray-900 flex flex-col justify-start items-center p-4 relative">
      <h1 className="text-white text-4xl py-6">Youtube Video downloader</h1>

      {/* input section */}
      <div className="mt-8">
        <form onSubmit={videoDetailsGet}>
          <input
            onChange={handleChange}
            required
            type="text"
            placeholder="Input the video link here"
            className="text-white outline-none bg-transparent w-[380px] h-[40px] px-3 overflow-hidden border border-yellow-600"
          />

          <button type="submit" className="button animation">
            Click
          </button>
        </form>
      </div>
    </div>
  );
};

export default Download;
