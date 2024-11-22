'use client'
import axios from 'axios'
import { navigate } from './lib/redirect'
import { useAppContext } from './components/ContextProvider'
import { useState } from 'react'
import { createUser } from './lib/actions/userActions'

export default function Home() {

  const { setActiveUser } = useAppContext()

  const [nickname, setNickname] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    await createUser(nickname)
      .then(res => {
        if (res?.data?.user?._id) {
          setActiveUser(res?.data?.user)
          navigate('/pages/dashboard')
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="bg-black w-full h-screen text-white flex flex-col items-center justify-center">
      <h1 className="font-bold text-[50px]">ITranslide</h1>
      <h2 className="font-semibold text-[20px]">The Ideal Website For Your Presentations</h2>
      <form className="flex flex-col items-center justify-center gap-3 mt-4">
        <label>Nickname:</label>
        <input required placeholder="SpongeBob" className="input w-[300px] text-black" onChange={(e) => setNickname(e.target.value)}/>
        <button type="submit" className="button w-[300px]" disabled={nickname === "" ? true : false} onClick={handleLogin}>Enter</button>
      </form>
    </div>
  );
}
