'use client'
import React, { useState, useEffect } from 'react'
import { updateSlide } from '../lib/actions/presentationActions';
import { useAppContext } from './ContextProvider';
import { getPresentationById } from '../lib/actions/presentationActions';
import { emitChange } from '../lib/actions/socketActions';

const Menu = () => {

    const { currentSlide, setCurrentSlide, presentation, setPresentation, connectedUsers } = useAppContext()
    
    const initialElement = {
        type: 'text',
        color: '',
        content: '',
    }
    
    const [newElement, setNewElement] = useState(initialElement)
    const [menu, setMenu] = useState(false)
    const [pendingAction, setPendingAction] = useState(null);
    
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setNewElement({
            ...newElement,
            [name]: value
        })
    }

    useEffect(() => {
        if (pendingAction) {
            const { type } = pendingAction;
    
            const element = {
                id: Date.now(),
                type,
                content: type === "text" ? newElement.content : "",
                position: { x: 50, y: 50 },
                size: type === "rect" ? { width: 100, height: 100, radius: 0 } : { width: 0, height: 0, radius: 50 },
                color: newElement.color || "black",
            };
    
            const updatedElements = [...currentSlide?.elements, element];
            const tempSlide = currentSlide;
    
            const executePendingAction = async () => {
                try {
                    await updateSlide(presentation?._id, currentSlide._id, updatedElements);
                    const res = await getPresentationById(presentation?._id);
                    await setPresentation(res?.data?.presentation);
                    await setCurrentSlide(tempSlide);
                    await emitChange();
                    setNewElement({...newElement, ['content']: ''})
                    setMenu(!menu);
                } catch (error) {
                    console.error("Error updating elements:", error);
                } finally {
                    setPendingAction(null);
                }
            };
            executePendingAction();
        }
    }, [newElement, pendingAction]);
    
    const handleCreateElement = (e, type) => {
        e.preventDefault();
        setPendingAction({ type });
        setNewElement((prev) => ({ ...prev, type }));
    };

  return (
    <>
    <div className={`rounded bg-slate-600 w-[270px] h-[600px] flex flex-col items-center justify-start p-2 text-white gap-3 ${menu === false ? 'hidden' : ''} mb-2`}>
        <form className='menu-section' onSubmit={(e) => {handleCreateElement(e, 'text')}}>
            <input required name='content' value={newElement.content} className='input p-1 w-full text-black' onChange={handleChange} placeholder='New Text'/>
            <button type='submit' className='button p-1'>Create</button>
        </form>
        <div className='menu-section'>
            <p className='text-center'>Create Square</p>
            <input className='input p-0 w-full' name='color' type='color' onChange={handleChange}/>
            <button className='button p-1' onClick={(e) => handleCreateElement(e, 'rect')}>Create</button>
        </div>
        <div className='menu-section '>
            <button className='button bg-slate-400 p-1'>Eraser</button>
        </div>
        <div className='menu-section h-full'>
            <p className='text-center'>Connected Users</p>
            <div className='border-[1px] border-slate-200/50 rounded w-full h-full overflow-y-auto p-2 flex flex-col gap-2'>
            {connectedUsers?.map((user, index) => {
                const isViewer = presentation?.viewers.some(viewerId => viewerId === user._id);
                const isEditor = presentation?.editors.some(editorId => editorId === user._id);
                const isCreator = user._id === presentation.creator;

                return (
                    <p key={index} className='flex items-center p-1 border bg-slate-500 rounded w-full'>
                        <span className="flex w-3 h-3 me-3 bg-green-600 rounded-full"></span>
                        {user?.nickname}
                        {isCreator && " (Creator)"}
                        {isEditor && " (Editor)"}
                        {isViewer && " (Viewer)"}
                    </p>
                );
            })}
            </div>
        </div>
    </div>
    <button className='bg-slate-600 text-white rounded p-1 w-[100px]' onClick={() => setMenu(!menu)}>Menu</button>
    </>
  )
}

export default Menu