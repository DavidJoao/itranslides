import React from 'react'

const PresentationThumbnail = ( {index, presentation} ) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='presentation-thumbnail'>

      </div>
      <p>{presentation.name}</p>
    </div>
  )
}

export default PresentationThumbnail