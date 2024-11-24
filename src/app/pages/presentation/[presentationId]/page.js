'use client'

import { getPresentationById } from '@/app/lib/actions/presentationActions';
import React, { useEffect, useState } from 'react'

const PresentationPage = ({ params }) => {

  const [presentationId, setPresentationId] = useState("")

  const getParams = async () => {
    const { presentationId } = await params;
    setPresentationId(presentationId)
    return presentationId
  }
    useEffect(() => {
      const fetchPresentation = async () => {
        const id = await getParams();
        const res = await getPresentationById(id)
        console.log(res?.data?.presentation)
        return res;
      }
      fetchPresentation()
    }, [])
  return (
    <div>{presentationId}</div>
  )
}

export default PresentationPage