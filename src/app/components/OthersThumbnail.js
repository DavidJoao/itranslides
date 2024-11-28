import React from 'react'
import { navigate } from '../lib/redirect'
import { useAppContext } from './ContextProvider'
import { getPresentationById, addUserToPresentation } from '../lib/actions/presentationActions'
import { updateUserRole } from '../lib/actions/userActions'

const OthersThumbnail = ({ presentation }) => {

  const { setPresentation, activeUser } = useAppContext()

  const handleSelectPresentation = async () => {
    if (activeUser?._id !== presentation?.creator) updateUserRole(activeUser?._id, presentation?._id, 'viewers')
    const res = await getPresentationById(presentation?._id);
    await setPresentation(res?.data?.presentation);
    await navigate(`/pages/presentation/${presentation._id}`)
};

  return (
<div className='flex flex-col items-center justify-center'>
    <div className='presentation-thumbnail'></div>
    <div className='flex flex-col items-center gap-2'>
      <p>{presentation.name}</p>
      <p>{presentation.creatorNickname}</p>
      <button className='button text-white w-[100px]' onClick={handleSelectPresentation}>Join</button>
    </div>
</div>
  )
}

export default OthersThumbnail