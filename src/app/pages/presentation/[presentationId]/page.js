'use client'
import Canvas from '@/app/components/Canvas';
import { useAppContext } from '@/app/components/ContextProvider';
import Slides from '@/app/components/Slides';
import { createSlide, getPresentationById } from '@/app/lib/actions/presentationActions';
import { useEffect} from 'react';
import Menu from '@/app/components/Menu';
import { emitJoinPresentation, emitLeavePresentation, emitNewSlide } from '@/app/lib/actions/socketActions';
import { getAndSetSession } from '@/app/lib/actions/userActions';

const PresentationPage = ({ params }) => {

    const { presentation, setPresentation, isUserViewer, activeUser } = useAppContext();

    useEffect(() => {
        const setUserConnection = async () => {
            const { user } = await getAndSetSession();
            await emitJoinPresentation(user, presentation?._id, presentation);
        };
        setUserConnection()

        return () => {
            const disconnectUser = async () => {
                const { user } = await getAndSetSession();
                await emitLeavePresentation(user, presentation?._id)
            };
            disconnectUser();
        };
    }, [presentation]);

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
                            { !isUserViewer(presentation, activeUser) ? (
                                <button className="button w-[90px] md:w-[110px] lg:w-[150px] flex-shrink-0 text-white font-bold" onClick={handleSlideCreation}>+</button>
                            ) : (
                                null
                            ) }
                        </div>
                    ) : (
                        <div className='h-full flex flex-row md:flex-col items-center justify-start gap-2'>
                            <Slides/>
                            { !isUserViewer(presentation, activeUser) ? (
                                <button className="button w-[90px] md:w-[110px] lg:w-[150px] flex-shrink-0 text-white font-bold" onClick={handleSlideCreation}>+</button>
                            ) : (
                                null
                            ) }
                        </div>
                    ) }
                </div>


                <div className='border-[1px] border-black w-full md:w-[80%] h-full flex items-center justify-center p-5 bg-slate-400'>
                    { presentation?.slides?.length ? ( <Canvas /> ) : ( <></> )}
                </div>


                <div className='fixed bottom-5 left-[50%] right-[50%] flex flex-col items-center justify-center gap-2'>
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