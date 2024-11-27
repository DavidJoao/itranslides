import React from 'react'
import { navigate } from '../lib/redirect'
import { useAppContext } from './ContextProvider'
import { getPresentationById } from '../lib/actions/presentationActions'

const PresentationThumbnail = ( {index, presentation, handleDelete} ) => {

  const { setPresentation } = useAppContext()

  const handleSelectPresentation = async () => {
    const res = await getPresentationById(presentation?._id);
    await setPresentation(res?.data?.presentation);
    await navigate(`/pages/presentation/${presentation._id}`)
};

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='presentation-thumbnail'>

      </div>
      <div className='flex flex-col items-center gap-2'>
        <p>{presentation.name}</p>
        <button className='button text-white w-[100px]' onClick={handleSelectPresentation}>Join</button>
        <button className='red-button text-white w-[100px]' onClick={(e) => handleDelete(e, presentation)}>Delete</button>
      </div>
    </div>
  )
}

export default PresentationThumbnail