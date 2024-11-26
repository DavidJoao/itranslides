'use client'
import { createSlide, deleteSlide, getPresentationById } from '@/app/lib/actions/presentationActions';
import React, { useEffect, useState } from 'react'
import Slide from '@/app/components/Slide';
import { icons } from '@/app/lib/icons';
import io from 'socket.io-client'
import { emitDeleteSlide, emitNewSlide } from '@/app/lib/actions/socketActions';

const PresentationPage = ({ params }) => {

    const socket = io('http://localhost:3001');
        
    const [presentationId, setPresentationId] = useState("")
    const [presentation, setPresentation] = useState({})
    const [currentSlide, setCurrentSlide] = useState()

    const getParams = async () => {
        const { presentationId } = await params;
        setPresentationId(presentationId)
        return presentationId
    }

    useEffect(() => {
		const handleSocketCreation = async () => {
			socket.on("New Slide", async () => {
				await fetchPresentation(presentationId)
			})
		}
		handleSocketCreation()
		return () => {
			socket.off("New Slide")
		}
	}, [presentation])

    useEffect(() => {
		const handleSocketSlideDeletion = async () => {
			socket.on("Delete Slide", async () => {
				await fetchPresentation(presentationId)
			})
		}
		handleSocketSlideDeletion()
		return () => {
			socket.off("Delete Slide")
		}
	}, [presentation])

	useEffect(() => {
		fetchPresentation()
	}, [])

	const fetchPresentation = async () => {
		const id = await getParams()
		const res = await getPresentationById(id)
		setPresentation(res?.data?.presentation)
		console.log(res?.data?.presentation)
		return res
	}

	const handleSlideAddition = async e => {
		e.preventDefault()
		await createSlide(presentationId)
        await emitNewSlide()
		await fetchPresentation()
	}


    return (
        <div className='flex flex-col md:flex-row w-screen h-screen'>
            <div className='w-full md:w-[20%] h-[20%] md:h-full p-5 bg-slate-600 text-white'>
                { presentation?.slides?.length === 0 ? (
                    <div className='flex flex-col items-center justify-center p-1'>
                        <p>Empty Presentation</p>
                        <button className='button w-[150px] text-white font-bold' onClick={handleSlideAddition}>Add Slide</button>
                    </div>
                ) : (
                    <div className='h-full flex flex-row md:flex-col items-center justify-start p-1 gap-2 overflow-scroll'>
                        { presentation?.slides?.map((slide, index) => {
                            return (
                            <div key={index} className='slide flex-shrink-0 text-black flex flex-row items-start justify-between p-2'>
                                <p>{index + 1}</p>
                                <button className='red-button text-white' onClick={async (e) => {
                                    e.preventDefault();
                                    await deleteSlide(presentationId, slide._id);
                                    await emitDeleteSlide();
                                    await fetchPresentation();
                                    }}>{icons.trash}</button>
                            </div>    
                            )
                        }) }
                        <button className='button w-[150px] text-white font-bold' onClick={handleSlideAddition}>Add Slide</button>
                    </div>
                ) }
            </div>
            <div className='border-[1px] border-black w-full md:w-[80%] h-full flex items-center justify-center p-5 bg-slate-400'>
                <Slide />
            </div>
            <div className='border-[1px] border hidden'>
                {/* FLOATING TOOLS DIV */}
            </div>
        </div>
    )
    }

    export default PresentationPage