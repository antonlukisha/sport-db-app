import React from 'react';
import '../styles/FloatingShapes.css';
import ball from '../assets/ball.png';
import balls from '../assets/balls.png';
import box from '../assets/box.png';
import football from '../assets/football.png';
import golf from '../assets/golf.png';
import place from '../assets/place.png';
import table from '../assets/table.png';
import balling from '../assets/balling.png';
import shadow from '../assets/shadow.png';

interface Shape {
  id: number;
  img: string;
  alt: string;
  className: string;
}

const FloatingShapes: React.FC = () => {
  const shapes: Shape[] = [
    { id: 1, img: box, alt: 'FridgeMate', className: 'floating-box' },
    { id: 2, img: table, alt: 'FridgeMate', className: 'floating-table' },
    { id: 3, img: balls, alt: 'FridgeMate', className: 'floating-balls' },
    { id: 4, img: football, alt: 'FridgeMate', className: 'floating-football' },
    { id: 5, img: balling, alt: 'FridgeMate', className: 'floating-balling' },
    { id: 6, img: golf, alt: 'FridgeMate', className: 'floating-golf' },
    { id: 7, img: ball, alt: 'FridgeMate', className: 'floating-ball' },
  ];

  return (
    <div className="splash-container">
      <img
        src={shadow}
        alt="FridgeMate"
        className="floating-shadow"
      />
      {shapes.map((shape) => (
        <img
          key={shape.id}
          src={shape.img}
          alt={shape.alt}
          className={`floating-shape ${shape.className}`}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
