import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import {bufferToImage } from 'face-api.js';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      await faceapi.loadFaceExpressionModel(MODEL_URL);
    }

    loadModels();
  }, []);

  async function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    const imageUrl = URL.createObjectURL(imageFile);
    setImageUrl(imageUrl);

    const detections = await detectEmotions(imageUrl);
    setEmotions(detections[0].expressions);
  }

  async function detectEmotions(imageUrl) {
    const image = await faceapi.fetchImage(imageUrl);
    const detections = await faceapi.detectAllFaces(image).withFaceExpressions();
    return detections;
  }

  return (
    <div className="App">
      <h1>Emotion Detection App</h1>
      <div>
        <input type="file" accept="/public/logo512.png" onChange={handleImageUpload} />
      </div>
      <div>
        {imageUrl && (
          <img src={imageUrl} alt="Uploaded Image" className="uploaded-image" />
        )}
      </div>
      <div>
        {emotions.length > 0 && (
          <ul className="emotions-list">
            <li>Angry: {emotions.angry.toFixed(2)}</li>
            <li>Disgusted: {emotions.disgusted.toFixed(2)}</li>
            <li>Fearful: {emotions.fearful.toFixed(2)}</li>
            <li>Happy: {emotions.happy.toFixed(2)}</li>
            <li>Neutral: {emotions.neutral.toFixed(2)}</li>
            <li>Sad: {emotions.sad.toFixed(2)}</li>
            <li>Surprised: {emotions.surprised.toFixed(2)}</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
