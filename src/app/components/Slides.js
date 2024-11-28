import React from "react"
import { useAppContext } from "./ContextProvider"
import { icons } from "../lib/icons"
import { deleteSlide, getPresentationById } from "../lib/actions/presentationActions"
import { emitDeleteSlide } from "../lib/actions/socketActions"

const Slides = () => {
	const { presentation, setPresentation, currentSlide, setCurrentSlide, activeUser, isUserViewer } = useAppContext()

	const handleSelectSlide = slide => {
		setCurrentSlide(slide)
	}

    const handleDelete = async (e, slideId) => {
        e.preventDefault();
        await deleteSlide(presentation?._id, slideId)
        const res = await getPresentationById(presentation?._id)
        await setPresentation(res?.data?.presentation)
        await emitDeleteSlide();
    }

	return (
		<div className="flex flex-row md:flex-col items-center lg:items-center gap-2 h-full w-full overflow-y-auto lg:overflow-x-auto">
			{presentation.slides.map((slide, index) => (
				<div key={slide._id} className={`slide flex-shrink-0 text-black flex flex-row items-start justify-between p-2 ${currentSlide?._id === slide?._id ? "border-[3px] border-blue-500" : ""}`} onClick={() => handleSelectSlide(slide)}>
					<p>{index + 1}</p>
					{ !isUserViewer(presentation, activeUser) ? (
						<button className="red-button text-white" onClick={(e) => handleDelete(e, slide?._id)}>{icons.trash}</button>
                            ) : (
                    	null
                    ) }
				</div>
			))}
		</div>
	)
}

export default Slides
