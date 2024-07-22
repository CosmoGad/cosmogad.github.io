import React, { useState } from 'react';
import { addVideo } from '../api';

function UploadVideo() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVideo({ url, title, description });
      alert('Video uploaded successfully!');
      setUrl('');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Video URL"
        required
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Upload Video</button>
    </form>
  );
}

export default UploadVideo;