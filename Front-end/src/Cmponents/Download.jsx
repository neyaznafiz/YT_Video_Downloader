import React, { useState } from "react";

const Download = () => {
  const [link, setLink] = useState("");
  const [vdInfo, setVdInfo]= useState('')

  const handleChange = (e) => {
    e.preventDefault();
    setLink(e.target.value);
  };


  return (
    <div className="w-[600px] h-[500px] bg-gray-900 flex flex-col justify-start items-center p-4 relative">
      <h1 className="text-white text-4xl py-6">Youtube Video downloader</h1>

      {/* input section */}
      <div className="mt-8">
        <form>
          <input
            type="text"
            placeholder="Input the video link here"
            onChange={handleChange}
            className="text-white outline-none bg-transparent w-[380px] h-[40px] px-3 overflow-hidden border border-yellow-600"
          />

          <button className="button animation">Click</button>
        </form>
      </div>
    </div>
  );
};

export default Download;
