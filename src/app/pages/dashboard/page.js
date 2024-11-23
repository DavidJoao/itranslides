'use client'
import { useAppContext } from '@/app/components/ContextProvider'
import OthersThumbnail from '@/app/components/OthersThumbnail'
import PresentationThumbnail from '@/app/components/PresentationThumbnail'
import { createPresentation } from '@/app/lib/actions/presentationActions'
import React, { useEffect, useState } from 'react'
import { checkSession, getAndSetSession, logoutUser } from '@/app/lib/actions/userActions'
import { navigate } from '@/app/lib/redirect'

const page = () => {

  const { activeUser, setActiveUser } = useAppContext()

  const [creationStatus, setCreationStatus] = useState(false)
  const [presentationName, setPresentationName] = useState("")

  useEffect(() => {
    const getSession = async () => {
      const res = await checkSession()
      if (res.status === 401) { 
        navigate('/')
      } else if (res.status === 200) {
        const user = await getAndSetSession();
        if (user) setActiveUser(user)
      }
    }
    getSession()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreationStatus(!creationStatus)
    createPresentation(presentationName, activeUser._id)
  }

  return (
    <div className="border-[1px] border-black lg:w-screen h-auto lg:h-screen flex flex-col">
      { activeUser ? (
        <>
        <div className='flex flex-col items-start p-5 gap-3'>
          <div className='flex flex-row items-center justify-between p-2 gap-3 w-full '>
            <button className='bg-blue-500 rounded p-2 text-white font-bold' onClick={() => setCreationStatus(!creationStatus)}>Create Presentation</button>
            <button className='bg-red-500 rounded p-2 text-white font-bold' onClick={() => logoutUser()}>Log Out</button>
          </div>
          <form className={`${creationStatus === true ? 'flex' : 'hidden'} items-center p-5 gap-3`} onSubmit={handleSubmit}>
              <label>Presentation Name:</label>
              <input value={presentationName} required className='input border bg-slate-100' onChange={(e) => setPresentationName(e.target.value)}/>
              <button type='submit' className='button text-white font-bold'>Create</button>
          </form>
        </div>
        
        <div className='border-[1px] border-black w-full h-auto flex flex-col p-5'>
          <p className='font-bold'>My Presentations</p>
          <div className='border-[1px] border-black w-full flex flex-row h-auto items-center justify-start gap-3 p-5 overflow-auto'>
              {/* Presentation container example */}
              <PresentationThumbnail />
          </div>
        </div>

        <div className='border-[1px] border-black w-full h-auto flex flex-col p-5'>
          <p className='font-bold'>All Presentations:</p>
          <div className='border-[1px] border-black w-full flex flex-row h-auto items-center justify-start gap-3 p-5 overflow-auto'>
            <OthersThumbnail user={"UserX"}/>
            <OthersThumbnail user={"UserA"}/>
            <OthersThumbnail user={"UserB"}/>
            <OthersThumbnail user={"UserC"}/>
            <OthersThumbnail user={"UserD"}/>
            <OthersThumbnail user={"UserE"}/>
          </div>
        </div>
        </>
      ) : (
        <>Loading...</>
      ) }


    </div>
  )
}

export default page