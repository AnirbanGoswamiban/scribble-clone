import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const socket = io('http://localhost:9000/');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const handleMouseDown = (e) => {
      isDrawing.current = true;
      [lastX.current, lastY.current] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
      socket.emit("mousedown")
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current) return;

      context.strokeStyle = 'black'; // Line color
      context.lineWidth = 2; // Line width
      context.lineCap = 'round';

      context.beginPath();
      context.moveTo(lastX.current, lastY.current); // Start from
      context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop); // Draw to
      context.stroke();

      [lastX.current, lastY.current] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];

      // Send canvas position along with drawing data
      socket.emit("draw", { x: lastX.current, y: lastY.current, canvasX: canvas.offsetLeft, canvasY: canvas.offsetTop });
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
      // Trigger an event or function when the mouse button is released
      // For example, you can call a function here:
      handleMouseUpAction();
    };

    const handleMouseOut = () => {
      isDrawing.current = false;
    };
      
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);

    // Cleanup event listeners when the component unmounts
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear-canvas")
  }

  // Function to handle the mouse up action
  const handleMouseUpAction = () => {
    socket.emit("mouseup", { x: lastX.current, y: lastY.current });
  };

  return (
    <div className="canv">
      <h1>Scribble V3.1</h1>
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        style={{ border: '1px solid black' }}
      ></canvas>
      <div className="buttond">
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
}

export default DrawingCanvas;
