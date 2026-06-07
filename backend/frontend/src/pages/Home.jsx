import React from 'react'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
        {/* <h1>Location share</h1>
        <div>
            <button onClick={()=>navigate('/sender')}>Share my location</button>
            <button onClick={()=>navigate('/receiver')}>Access other location</button>
        </div> */}
    </div>
  )
}

export default Home