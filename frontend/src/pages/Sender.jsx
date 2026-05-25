import React from 'react'
import { useState } from 'react'
import Receiver from './Receiver';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import {
  MapPin,
  Search,
  Shield,
  Copy,
  Send,
  SquareX
} from 'lucide-react';

const Sender = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [code] = useState(Math.floor(100000 + Math.random() * 900000))
  const [reveal, setReveal] = useState(false);
  function handleGetCode() {
    setLoading(true);
    setReveal(true);


    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Latitude:', position.coords.latitude)
        console.log('Longitude:', position.coords.longitude)
        const newData = [
          code,
          position.coords.longitude,
          position.coords.latitude
        ];
        setData(newData);
        setLoading(false);
        localStorage.setItem("sharedData", JSON.stringify(newData));
        console.log("Stored locally");
        axios.post(
          'http://localhost:7000/share',
          {
            code: newData[0],
            longitude: newData[1],
            latitude: newData[2]
          }
        )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log("Error");
          })
      }

    )

  }
  const center = {
    lat: data[2],
    lng: data[1]
  };
  const containerStyle = {
    width: '100%',
    height: '400px'
  };
  function handleDraglocation(longitude, latitude) {
    console.log(longitude, latitude);
    const newData = [
      code,
      longitude,
      latitude
    ];
    setData(newData);
    localStorage.setItem("sharedData", JSON.stringify(newData));
    axios.post(
      'http://localhost:7000/share',
      {
        code: newData[0],
        longitude: longitude,
        latitude: latitude
      }
    )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error");
      })
  }
  async function handleDelete() {
    await axios.delete(
      `http://localhost:7000/delete/${data[0]}`
    );
    console.log("Deleted")
    setReveal(false);

  }
  return (
    <div className='m-3 grid grid-cols-1 md:grid-cols-2'>
      <div className='bg-white rounded p-2 mr-4'>
        <div className='flex items-center gap-1'>
            <Send size={40} color='white' className='bg-blue-500 rounded-full p-1'/>
            <h1 className='text-blue-800 text-2xl font-semibold'>Sending</h1>
            <h1 className='text-2xl font-semibold'>your location</h1>
        </div>
        <p className='text-sm text-gray-600'>Share this code with receiver to share your location(Click on current location or drag)</p>
        <button className='bg-blue-600 text-white p-2 rounded mt-7 ' onClick={() => handleGetCode()}>Get current location and code</button>
        {loading && <p>Loading...</p>}
        <div className='bg-purple-200 border-gray-400 border-2 rounded mt-2 pl-2 py-2 '>
          Your code
          <h1 className='text-blue-600 font-bold text-4xl'>{data[0]}</h1>
        </div>
        <div className='bg-purple-200 border-gray-400 border-2 rounded mt-2 pl-2 py-2 '>
           <div className='flex items-center'>
            <MapPin size={20}/>
            <p>Current Location</p>
           </div>
           <p className='ml-1 mt-2 font-bold'>{data[1]} ,{data[2]}</p>
        </div>
        
        <button className='bg-red-600 text-white p-2 rounded mt-4 w-full' onClick={() => handleDelete()}>Stop sharing</button>
      </div>
      <div className=''>

        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
          {reveal &&
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={18}
              mapTypeId="hybrid"
            >
              <Marker position={center} label="S" draggable={true} onDragEnd={(e) => handleDraglocation(e.latLng.lng(), e.latLng.lat())} />
            </GoogleMap>
          }
        </LoadScript>
        </div>
      
    </div>
  )
}

export default Sender