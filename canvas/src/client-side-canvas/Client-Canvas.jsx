import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

function Clientcanvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socket = io('https://scribble-clone.vercel.app')
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Store the initial point for drawing
    let lastPoint = null;
    let isDrawing = true; // Add this flag to control drawing
  
    // Function to draw points on the canvas
    const drawOnCanvas = (e) => {
      if (e.type === 'start') {
        isDrawing = true;
        lastPoint = { x: e.x, y: e.y }; // Store the starting point
        return;
      } else if (e.type === 'stop') {
        isDrawing = false;
        lastPoint = null;
        return;
      }
  
      if (!isDrawing) return;
  
      const canvasX = e.x; // Use the raw X coordinate sent from the server
      const canvasY = e.y; // Use the raw Y coordinate sent from the server
  
      if (lastPoint && isWithinCanvas(canvasX, canvasY, canvas)) {
        const { x: startX, y: startY } = lastPoint;
  
        context.strokeStyle = 'black'; // Line color
        context.lineWidth = 2; // Line width
        context.lineCap = 'round';
  
        context.beginPath();
        context.moveTo(startX, startY); // Start from
        context.lineTo(canvasX, canvasY); // Draw to
        context.stroke();
        lastPoint = { x: canvasX, y: canvasY };
      } else if (isWithinCanvas(canvasX, canvasY, canvas)) {
        lastPoint = { x: canvasX, y: canvasY };
      }
    };
  
    socket.on('broadcast-points', drawOnCanvas);
  
    socket.on('stop-points', () => {
      isDrawing = false;
      lastPoint = null;
    });
  
    socket.on('start-points', () => {
      isDrawing = true;
      lastPoint = null;
    });


    socket.on('clear-canvas', () => {
     clearCanvas()
    });
  
    // Cleanup event listener when the component unmounts
    return () => {
      socket.off('broadcast-points', drawOnCanvas);
    };
  }, []);
  

  // Function to check if a point is within the canvas boundaries
  const isWithinCanvas = (x, y, canvas) => {
    return x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height;
  };

  // Add a function to clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="canv">
      <h1>Client</h1>
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        style={{ border: '1px solid black' }}
      />
     
    </div>
  );
}

export default Clientcanvas;
