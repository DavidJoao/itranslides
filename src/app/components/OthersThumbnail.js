import React from 'react'
import { navigate } from '../lib/redirect'

const OthersThumbnail = ({ presentation }) => {
  return (
<div className='flex flex-col items-center justify-center'>
    <div className='presentation-thumbnail'></div>
    <div className='flex flex-col items-center gap-2'>
      <p>{presentation.name}</p>
      <p>{presentation.creatorNickname}</p>
      <button className='button text-white w-[100px]' onClick={() => navigate(`/pages/presentation/${presentation._id}`)}>Join</button>
    </div>
</div>
  )
}

export default OthersThumbnail