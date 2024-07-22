const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'docs')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});
function loadVideo(index) {
  const video = document.getElementById('videoPlayer');
  video.src = videos[index].url;
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);
