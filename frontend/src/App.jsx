import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sender from './pages/Sender'
import Receiver from './pages/Receiver'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();

  return (
    <>
      <div className='m-3  border-b-2 rounded flex justify-between'>
         <div className='flex items-center'>
          <MapPin className='hidden md:block' color='blue' size={30}/>
          <h1 className='text-xl font-bold text-blue-700'>Easy Share</h1>
         </div>
        <div className='flex items-center gap-4'>
          <button className='text-blue-800 font-semibold'  onClick={()=>navigate('/sender')}>Send Location</button>
          <button onClick={()=>navigate('/receiver')}>Receive location</button>
        </div>
        <div>
          <h1 className='hidden md:block'>safe.secure.fast</h1>
        </div>

      </div>
       <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sender' element={<Sender/>}/>
          <Route path='/receiver' element={<Receiver/>}/>
       </Routes>
    </>
  )
}

export default App
