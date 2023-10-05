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
    canvas.addEventListener('mousedown', (e) => {
      isDrawing.current = true;
      [lastX.current, lastY.current] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing.current = false);
    canvas.addEventListener('mouseout', () => isDrawing.current = false);

    return () => {
      canvas.removeEventListener('mousedown', () => {});
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', () => {});
      canvas.removeEventListener('mouseout', () => {});
    }
  }, [])

  function draw(e) {
    if (!isDrawing.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.strokeStyle = 'black'; // Line color
    context.lineWidth = 2;       // Line width
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(lastX.current, lastY.current); // Start from
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop); // Draw to
    context.stroke();

    [lastX.current, lastY.current] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
    
    socket.emit("draw",{x:lastX.current,y:lastY.current})
  }
  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);   
  }

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
