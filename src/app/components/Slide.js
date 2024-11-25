'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const Slide = () => {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        const { offsetWidth, offsetHeight } = parentRef.current;
        setDimensions({
          width: offsetWidth * 0.9,
          height: offsetHeight * 0.9,
        });
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={parentRef} className='p-5 flex items-center justify-center w-full h-full'>
      <Stage width={dimensions.width} height={dimensions.height} className='border rounded bg-white'>
        <Layer>
          <Rect x={20} y={20} width={100} height={100} fill="blue" draggable/>
        </Layer>
      </Stage>
    </div>
  );
};

export default Slide;