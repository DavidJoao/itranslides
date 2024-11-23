'use client'
import OthersThumbnail from '@/app/components/OthersThumbnail'
import PresentationThumbnail from '@/app/components/PresentationThumbnail'
import React, { useState } from 'react'

const page = () => {

  const [creationStatus, setCreationStatus] = useState(false)
  const [presentationName, setPresentationName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreationStatus(!creationStatus)
  }

  return (
    <div className="border-[1px] border-black lg:w-screen h-auto lg:h-screen flex flex-col">

      <div className='p-5 flex flex-col items-start gap-3'>
        <button className='bg-blue-500 rounded p-2 text-white font-bold' onClick={() => setCreationStatus(!creationStatus)}>Create Presentation</button>
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

    </div>
  )
}

export default page