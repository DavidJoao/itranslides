'use client'
import axios from 'axios'

export default function Home() {

  const handleHello = (e) => {
    e.preventDefault()
    axios.get("/pages/api/helloworld/").then(res => console.log(res))
  }
  return (
    <div className="bg-black w-full h-screen text-white flex flex-col items-center justify-center">
      <h1 className="font-bold text-[50px]">ITranslide</h1>
      <h2 className="font-semibold text-[20px]">The Ideal Website For Your Presentations</h2>
      <form className="flex flex-col items-center justify-center gap-3 mt-4">
        <label>Nickname:</label>
        <input required placeholder="SpongeBob" className="input w-[300px]"/>
        <button type="submit" className="button w-[300px]" onClick={handleHello}>Enter</button>
      </form>
    </div>
  );
}
