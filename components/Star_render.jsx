import React, { useEffect, useRef, useState } from 'react';
import imgSrc from '../public/star.svg';

const Star_render = () => {
  const [stars, setStars] = useState([]);
  const [starCount, setStarCount] = useState(25);
  const [selectedStars, setSelectedStars] = useState([]);
  const canvasRef = useRef(null);

  const generateRandomStars = (count, width, height) => {
    const starsArray = [];
    for (let i = 0; i < count; i++) {
      starsArray.push({
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }
    return starsArray;
  };


  const drawStarsAndLines = (starsToDraw, connections = []) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imgSrc;

    img.onload = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsToDraw.forEach(star => {
        ctx.drawImage(img, star.x, star.y, 16, 16);

        // If star is selected, draw a highlight around it
        if (connections.includes(star)) {
          ctx.beginPath();
          ctx.arc(star.x + 8, star.y + 8, 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'yellow';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw lines between selected stars
      if (connections.length >= 2) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        for (let i = 1; i < connections.length; i++) {
          const a = connections[i - 1];
          const b = connections[i];
          ctx.beginPath();
          ctx.moveTo(a.x + 8, a.y + 8);
          ctx.lineTo(b.x + 8, b.y + 8);
          ctx.stroke();
        }
      }
    };
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const newStars = generateRandomStars(starCount, canvas.width, canvas.height);
    setStars(newStars);
    setSelectedStars([]);
  }, [starCount]);

  useEffect(() => {
    if (stars.length > 0) drawStarsAndLines(stars, selectedStars);
  }, [stars, selectedStars]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    stars.forEach(star => {
      if (
        x >= star.x && x <= star.x + 16 &&
        y >= star.y && y <= star.y + 16
      ) {
        setSelectedStars(prev => [...prev, star]);
      }
    });
  };

  const handleUndo = () => {
    setSelectedStars(prev => {
      const updated = prev.slice(0, -1);
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedStars([]);
  };

  const handleStarInputChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 500) {
      setStarCount(val);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 bg-transparent p-3 rounded text-white space-y-2">
        <label>
          Number of Stars:{" "}
          <input
            type="number"
            value={starCount}
            onChange={handleStarInputChange}
            className="bg-white text-black px-2 py-1 rounded w-20"
            min="1"
            max="500"
          />
        </label>

        <div
          onClick={handleUndo}
          className="bg-red-500 w-fit px-3 py-1 rounded-xl cursor-pointer select-none text-white"
        >
          Undo
        </div>
        <div
          onClick={handleReset}
          className="bg-red-500 w-fit px-3 py-1 rounded-xl cursor-pointer select-none text-white"
        >
          reset
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full bg-black"
      />
    </div>
  );
};

export default Star_render;
