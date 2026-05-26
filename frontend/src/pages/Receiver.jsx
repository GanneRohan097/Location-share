import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const Receiver = () => {

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const[value,setValue] = useState(0)
  const [reveal,setReveal] = useState(false);
  const [data,setData] = useState({});
  const [receiverLocation, setReceiverLocation] = useState(null);

  useEffect(()=>{
     navigator.geolocation.getCurrentPosition(

    (position) => {

      setReceiverLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

    },

    (error) => {
      console.log(error);
    }

  );
  },[])

  async function handleRequest(enteredCode){
          setInterval(() => {
            fetchLocation(enteredCode);
          }, 3000);
  }
  async function fetchLocation(enteredCode) {
    const response = await axios.post(
      'https://location-share-f1m3.onrender.com/receive',
      {
        code:enteredCode
      }
    );
    setData(response.data);
    setReveal(true);
    
  }

  
  const center = {
    lat: data.latitude,
    lng: data.longitude
  };

  return (
    <div>
        <h1>Receive location</h1>  
        <p>Enter code</p>
        <input onChange={(e)=>setValue(e.target.value)} type='number'></input>
        <button onClick={()=>handleRequest(value)}>Find location</button>
        {reveal && (
          <div>
            <p>Code matches</p>
            <h3>Longitude: {data.longitude}</h3>
            <h3>Latitude: {data.latitude}</h3>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
        <GoogleMap
         mapContainerStyle={containerStyle}
         center={center}
         zoom={18}
         mapTypeId="hybrid"
        >
          <Marker position={center} label="S" onDragEnd={(e)=>console.log(e.latLng.lat(),e.latLng.lng())}/>
            {
              receiverLocation && (
                <Marker position={receiverLocation} label="R"/>
              )
            }
        </GoogleMap>
      </LoadScript>
              </div>
      )}
      
    </div>
  )
}

export default Receiver