import React from 'react'
import { navigate } from '../lib/redirect'

const PresentationThumbnail = ( {index, presentation, handleDelete} ) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='presentation-thumbnail'>

      </div>
      <div className='flex flex-col items-center gap-2'>
        <p>{presentation.name}</p>
        <button className='button text-white w-[100px]' onClick={() => navigate(`/pages/presentation/${presentation._id}`)}>Join</button>
        <button className='red-button text-white w-[100px]' onClick={(e) => handleDelete(e, presentation)}>Delete</button>
      </div>
    </div>
  )
}

export default PresentationThumbnail