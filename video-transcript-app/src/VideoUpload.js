import React, { useState } from 'react';
import axios from 'axios';

function VideoUpload() {
  const [video, setVideo] = useState(null);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video) {
      alert('Please select a video to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);

    // Placeholder for upload logic
    console.log('Video uploaded:', video.name);
    // You'll replace this log with actual upload logic later
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button onClick={handleUpload}>Upload Video</button>
    </div>
  );
}

export default VideoUpload;
