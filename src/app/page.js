'use client'
import { navigate } from './lib/redirect'
import { useAppContext } from './components/ContextProvider'
import { useEffect, useState } from 'react'
import { createUser } from './lib/actions/userActions'
import { checkSession } from './lib/actions/userActions'
import { getAndSetSession } from './lib/actions/userActions'

export default function Home() {

  const { setActiveUser } = useAppContext()

  const [nickname, setNickname] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const res = await checkSession()
      if (res.status === 200) {
          const user = await getAndSetSession();
          if (user) {
            navigate('/pages/dashboard')
          }
      }
      }
      getSession()
  })

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
    <div className="bg-black w-full h-screen text-white flex flex-col items-center justify-center p-5">
      <h1 className="font-bold text-[50px]">ITranslide</h1>
      <h2 className="font-semibold text-[20px] text-center">The Ideal Website For Your Presentations</h2>
      <form className="flex flex-col items-center justify-center gap-3 mt-4">
        <label>Nickname:</label>
        <input required placeholder="SpongeBob" className="input w-[250px] md:w-[300px] text-black" onChange={(e) => setNickname(e.target.value)}/>
        <button type="submit" className="button w-[250px] md:w-[300px]" disabled={nickname === "" ? true : false} onClick={handleLogin}>Enter</button>
      </form>
    </div>
  );
}
