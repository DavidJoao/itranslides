'use client'
import Canvas from '@/app/components/Canvas';
import { useAppContext } from '@/app/components/ContextProvider';
import Slides from '@/app/components/Slides';
import { createSlide, getPresentationById } from '@/app/lib/actions/presentationActions';
import { useEffect } from 'react';
import Menu from '@/app/components/Menu';
import { emitNewSlide } from '@/app/lib/actions/socketActions';

const PresentationPage = ({ params }) => {

    const { presentation, setPresentation } = useAppContext();

    const initiatePresentation = async () => {
        const { presentationId } = await params;
        const res = await getPresentationById(presentationId);
        await setPresentation(res?.data?.presentation);
        return presentation
    }

    useEffect(() => {
        initiatePresentation();
    }, [])

    const handleSlideCreation = async () => {
        await createSlide(presentation?._id)
        const res = await getPresentationById(presentation?._id)
        await setPresentation(res?.data?.presentation)
        await emitNewSlide()
    }

    return (
        <>
        {presentation ? (
            <div className='flex flex-col md:flex-row w-screen h-screen'>
                <div className='w-full md:w-[20%] h-[20%] md:h-full p-5 bg-slate-600 text-white'>
                    { presentation?.slides?.length === 0 ? (
                        <div className='flex flex-col items-center justify-center p-1'>
                            <p>Empty Presentation</p>
                            <button className='button w-[150px] text-white font-bold'  onClick={handleSlideCreation}>Add Slide</button>
                        </div>
                    ) : (
                        <div className='h-full flex flex-row md:flex-col items-center justify-start p-1 gap-2 overflow-scroll'>
                            <Slides />
                            <button className='button w-[150px] text-white font-bold' onClick={handleSlideCreation}>Add Slide</button>
                        </div>
                    ) }
                </div>


                <div className='border-[1px] border-black w-full md:w-[80%] h-full flex items-center justify-center p-5 bg-slate-400'>
                    <Canvas />
                </div>


                <div className='fixed bottom-5 left-0 right-0 flex flex-col items-center justify-center'>
                    <Menu />
                </div>


            </div>
        ) : (
            <div className='flex flex-col md:flex-row w-screen h-screen'>
                <p>Loading Presentation...</p>
            </div>
        )}
        </>
    )
    }

    export default PresentationPage