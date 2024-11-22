"use server"

import { redirect } from "next/navigation"

export const navigate = async ( route ) => {
    redirect(`${route}`)
}