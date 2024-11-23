import React from 'react'

const OthersThumbnail = ({user}) => {
  return (
<div className='flex flex-col items-center justify-center'>
    <div className='presentation-thumbnail'></div>
    <p>{user}</p>
</div>
  )
}

export default OthersThumbnail