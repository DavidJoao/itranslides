import React from 'react'

const OthersThumbnail = ({ presentation }) => {
  return (
<div className='flex flex-col items-center justify-center'>
    <div className='presentation-thumbnail'></div>
    <p>{presentation.name}</p>
    <p>{presentation.creatorNickname}</p>
</div>
  )
}

export default OthersThumbnail