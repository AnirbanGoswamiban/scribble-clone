import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

function Clientcanvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socket = io('http://localhost:9000/');
  const lastX = useRef(null);
  const lastY = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;

    socket.on('broadcast-points',(e)=>{
      console.log(e);
       const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.strokeStyle = 'black'; // Line color
    context.lineWidth = 2;       // Line width
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(lastX.current, lastY.current); // Start from
    context.lineTo(e.x - canvas.offsetLeft, e.y - canvas.offsetTop); // Draw to
    context.stroke();

    [lastX.current, lastY.current] = [e.x - canvas.offsetLeft, e.y - canvas.offsetTop];
    })

    
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
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
      ></canvas>
      <div className="buttond">
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
}

export default Clientcanvas;
