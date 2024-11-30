'use client'
import { useAppContext } from '@/app/components/ContextProvider'
import OthersThumbnail from '@/app/components/OthersThumbnail'
import PresentationThumbnail from '@/app/components/PresentationThumbnail'
import { createPresentation, getMyPresentations, getPresentations, deletePresentationById } from '@/app/lib/actions/presentationActions'
import React, { useEffect, useState } from 'react'
import { checkSession, getAndSetSession, logoutUser } from '@/app/lib/actions/userActions'
import { navigate } from '@/app/lib/redirect'
import { emitNewPresentation, emitDeletePresentation } from '@/app/lib/actions/socketActions'
import { socket } from '@/app/lib/socket'

const Dashboard = () => {
	
    const { activeUser, setActiveUser, myPresentations, setMyPresentations, presentations, setPresentations } = useAppContext()

    const [creationStatus, setCreationStatus] = useState(false)
    const [presentationName, setPresentationName] = useState("")

	useEffect(() => {
        const handlePresentationsLoad = async () => {
			await fetchPresentations(activeUser)
        };
        handlePresentationsLoad();
    }, [activeUser]);

    useEffect(() => {
        const getSession = async () => {
        const res = await checkSession()
        if (res.status === 401) { 
            navigate('/')
        } else if (res.status === 200) {
            const user = await getAndSetSession();
            if (user) {
            setActiveUser(user.user)
            fetchPresentations(user.user);
            }
        }
        }
        getSession()
    }, [])

    const fetchPresentations = async (user) => {
        const allRes = await getPresentations()
        setPresentations(allRes?.data?.presentations)
        const myRes = await getMyPresentations(user?._id)
        setMyPresentations(myRes?.data?.presentations)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreationStatus(!creationStatus);
        await createPresentation(presentationName, activeUser._id);
        await emitNewPresentation(presentationName, activeUser);
		setPresentationName("");
    };

	const handleDelete = async (e, presentation) => {
		e.preventDefault();
		await deletePresentationById(presentation?._id)
		await emitDeletePresentation(presentation?.name, activeUser)
	  }

  return (
		<div className="lg:w-screen h-auto lg:h-screen flex flex-col bg-slate-200">
			{activeUser ? (
				<>
					<div className="flex flex-col items-start p-5 gap-3 bg-white">
						<div className="flex flex-row items-center justify-between p-2 gap-3 w-full ">
							<button className="bg-blue-500 rounded p-2 text-white font-bold" onClick={() => setCreationStatus(!creationStatus)}>Create Presentation </button>
							<button className="bg-red-500 rounded p-2 text-white font-bold" onClick={() => logoutUser()}> Log Out </button>
						</div>
						<form className={`${creationStatus === true ? "flex" : "hidden"} flex-col lg:flex-row items-center p-5 gap-3`} onSubmit={handleSubmit}>
							<label>Presentation Name:</label>
							<input value={presentationName} required className="input border bg-slate-100" onChange={e => setPresentationName(e.target.value)}/>
							<button type="submit" className="button text-white font-bold"> Create </button>
						</form>
					</div>

					<div className="w-full h-auto flex flex-col p-5 bg-slate-200">
						<p className="font-bold">My Presentations</p>
						<div className="border-[1px] border-slate-400 bg-white rounded w-full flex flex-row h-auto items-center justify-start gap-3 p-5 overflow-auto">
							{myPresentations?.length !== 0 ? (
								<>
									{myPresentations?.map((presentation, index) => {
										return (
											<PresentationThumbnail key={index} presentation={presentation} handleDelete={handleDelete}/>
										)
									})}
								</>
							) : (
								<p>You have no presentations, start your journey creating one!</p>
							)}
						</div>
					</div>

					<div className="w-full h-auto flex flex-col p-5 bg-slate-200">
						<p className="font-bold">All Presentations:</p>
						<div className="border-[1px] border-slate-400 bg-white rounded w-full flex flex-row h-auto items-center justify-start gap-3 p-5 overflow-auto">
							{presentations.length !== 0 ? (
								<>
									{presentations?.map((presentation, index) => {
										return (
											<OthersThumbnail key={index} presentation={presentation} />
										)
									})}
								</>
							) : (
								<p>No Presentations...</p>
							)}
						</div>
					</div>
				</>
			) : (
				<>Loading...</>
			)}
		</div>
  )
}

export default Dashboard