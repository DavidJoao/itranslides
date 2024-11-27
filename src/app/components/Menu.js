'use client'
import React, { useState, useEffect } from 'react'
import { updateSlide } from '../lib/actions/presentationActions';
import { useAppContext } from './ContextProvider';
import { getPresentationById } from '../lib/actions/presentationActions';

const Menu = () => {

    const { currentSlide, setCurrentSlide, presentation, setPresentation } = useAppContext()
    
    const initialElement = {
        type: 'text',
        color: '',
        content: '',
    }
    
    const [newElement, setNewElement] = useState(initialElement)
    const [menu, setMenu] = useState(false)
    
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setNewElement({
            ...newElement,
            [name]: value
        })
    }

    const handleCreateElement = async (e) => {
        e.preventDefault();
    
        const element = {
            id: Date.now(),
            type: newElement.type,
            content: newElement.type === "text" ? newElement.content : "",
            position: { x: 50, y: 50 },
            size: newElement.type === "rect" ? { width: 100, height: 100, radius: 0 } : { width: 0, height: 0, radius: 50 },
            color: newElement.color || "black",
        };
    
        const updatedElements = [...currentSlide?.elements, element];
        const tempSlide = currentSlide;
        try {
            await updateSlide(presentation?._id, currentSlide._id, updatedElements);
            const res = await getPresentationById(presentation?._id)
            await setPresentation(res?.data?.presentation)
            await setCurrentSlide(tempSlide)
            setMenu(!menu);
        } catch (error) {
            console.error("Error updating elements:", error);
        }
    };
    
    

  return (
    <>
    <div className={`rounded bg-slate-600 w-[250px] h-[200px] flex flex-col items-center justify-start p-2 text-white gap-3 ${menu === false ? 'hidden' : ''} mb-2`}>
        <div className='flex gap-3 w-full'>
            <button name='text' className='button w-1/2' onClick={() => setNewElement({...newElement, ['type']: 'text'})}>Text</button>
            <button name='rect' className='button w-1/2' onClick={() => setNewElement({...newElement, ['type']: 'rect'})}>Rect</button>
        </div>
        <div className='flex flex-col items-center justify-center gap-3 w-full'>
            { newElement?.type === 'text' ? (
                <input name='content' value={newElement.content} className='input w-full text-black' onChange={handleChange} placeholder='New Text'/>
            ) :
            <></> 
        }
            <div className='flex items-center justify-center w-full'>
                <p>Color:</p>
                <input className='input p-0 w-full' name='color' type='color' onChange={handleChange}/>
            </div>
            <button className='button' onClick={handleCreateElement}>Create</button>
        </div>
    </div>
    <button className='bg-slate-600 text-white rounded p-1 w-[60px]' onClick={() => setMenu(!menu)}>Menu</button>
    </>
  )
}

export default Menu