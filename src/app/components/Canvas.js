import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import { updateSlide } from '../lib/actions/presentationActions';
import { useAppContext } from './ContextProvider';
import { getPresentationById } from '../lib/actions/presentationActions';
import { emitChange } from '../lib/actions/socketActions';

const Canvas = ({ }) => {

  const { currentSlide, setCurrentSlide, presentation, setPresentation } = useAppContext();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef(null);

  const handleDragEnd = async (id, x, y) => {
      const updatedElements = currentSlide?.elements.map((el) =>
        el.id === id ? { ...el, position: { x, y } } : el
    );
    setCurrentSlide({ ...currentSlide, elements: updatedElements });
    await updateSlide(presentation?._id, currentSlide._id, updatedElements);
    const res = await getPresentationById(presentation?._id);
    await setPresentation(res?.data?.presentation);
    await emitChange()
  };

  const renderElement = (element, index) => {
    switch (element.type) {
      case "text":
        return (
          <Text key={element.id} text={element.content} x={element.position.x} y={element.position.y} draggable fill="black" onDragEnd={(e) =>
              handleDragEnd(element.id, e.target.x(), e.target.y())
            }/>
        );
      case "rect":
        return (
          <Rect key={element.id} x={element.position.x} y={element.position.y} width={element.size.width} height={element.size.height} fill={element.color} draggable onDragEnd={(e) =>
              handleDragEnd(element.id, e.target.x(), e.target.y())
            }/>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            setDimensions({
                width: rect.width * 0.9,
                height: rect.height * 0.9,
            });
        }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (parentRef.current) {
        resizeObserver.observe(parentRef.current);
    }
    return () => {
        resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={parentRef} className='p-5 flex items-center justify-center w-full h-full'>
      <Stage width={dimensions.width} height={dimensions.height} className='border rounded bg-white'>
        <Layer>
          {Array.isArray(currentSlide?.elements) && currentSlide?.elements.map((element) => renderElement(element))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
