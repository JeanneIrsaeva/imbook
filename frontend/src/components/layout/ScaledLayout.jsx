// src/components/layout/ScaledLayout.jsx
import { useEffect, useState } from 'react';

const DESIGN_WIDTH = 1920;   // ширина макета Figma (сделавть в будущем номр адаптив)

export default function ScaledLayout({ children }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const currentWidth = window.innerWidth;
      const newScale = Math.min(currentWidth / DESIGN_WIDTH, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        minHeight: `${100 / scale}vh`,
      }}
    >
      {children}
    </div>
  );
}