import React, { useState } from 'react';

function UploadVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, url }),
      });
      if (response.ok) {
        alert('Видео успешно загружено!');
        setTitle('');
        setDescription('');
        setUrl('');
      } else {
        alert('Ошибка при загрузке видео');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Ошибка при загрузке видео');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название видео"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание видео"
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL видео"
        required
      />
      <button type="submit">Загрузить видео</button>
    </form>
  );
}

export default UploadVideo;