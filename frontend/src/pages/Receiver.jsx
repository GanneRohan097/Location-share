import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import {
  MapPin,
  Search,
  Send,
  CheckCircle2
} from 'lucide-react';

const Receiver = () => {

  const containerStyle = {
    width: '100%',
    height: '70vh'
  };

  const [value, setValue] = useState(0)
  const [reveal, setReveal] = useState(false);
  const [data, setData] = useState({});
  const [receiverLocation, setReceiverLocation] = useState(null);

  useEffect(() => {

    const interval = setInterval(() => {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          setReceiverLocation({

            lat: position.coords.latitude,
            lng: position.coords.longitude

          });

        },

        (error) => {

          console.log(error.message);

        },

        {

          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0

        }

      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  async function handleRequest(enteredCode) {

    fetchLocation(enteredCode);

    setInterval(() => {

      fetchLocation(enteredCode);

    }, 3000);

  }

  async function fetchLocation(enteredCode) {

    const response = await axios.post(
      'https://location-share-f1m3.onrender.com/receive',
      {
        code: enteredCode
      }
    );

    setData(response.data);

    setReveal(true);

  }

  const center = {
    lat: data.latitude || 17.3850,
    lng: data.longitude || 78.4867
  };

  return (

    <div className='min-h-screen bg-gray-100 p-3 grid grid-cols-1 md:grid-cols-2 gap-4'>

      <div className='bg-white rounded-2xl shadow-lg p-4'>

        <div className='flex items-center gap-2'>

          <Send
            size={40}
            color='white'
            className='bg-blue-500 rounded-full p-2'
          />

          <div>

            <h1 className='text-2xl font-bold text-blue-700'>
              Receive Location
            </h1>

            <p className='text-sm text-gray-500'>
              Enter the code shared by the sender
            </p>

          </div>

        </div>

        <div className='flex items-center gap-2 mt-5'>

          <input
            className='border-2 border-gray-300 rounded-lg p-3 text-lg w-full outline-none focus:border-blue-500'
            onChange={(e) => setValue(e.target.value)}
            type='number'
            placeholder='Enter code here'
          />

          <button
            onClick={() => handleRequest(value)}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition'
          >

            <Search size={20} />

            Find

          </button>

        </div>

        {

          reveal && (

            <div className='mt-5 space-y-3'>

              <div className='bg-green-100 border border-green-300 rounded-xl p-4'>

                <div className='flex items-center gap-2 text-green-700'>

                  <CheckCircle2 size={22} />

                  <p className='font-semibold'>
                    Code matched successfully
                  </p>

                </div>

              </div>

              <div className='bg-purple-100 border border-purple-300 rounded-xl p-4'>

                <div className='flex items-center gap-2 mb-2'>

                  <MapPin size={18} />

                  <p className='font-semibold'>
                    Sender Location
                  </p>

                </div>

                <p className='text-sm font-medium'>
                  Longitude: {data.longitude}
                </p>

                <p className='text-sm font-medium mt-1'>
                  Latitude: {data.latitude}
                </p>

              </div>

              <div className='bg-blue-100 border border-blue-300 rounded-xl p-4'>

                <div className='flex items-center gap-2 mb-2'>

                  <MapPin size={18} />

                  <p className='font-semibold'>
                    Receiver Location
                  </p>

                </div>

                <p className='text-sm font-medium'>
                  {receiverLocation?.lat}
                </p>

                <p className='text-sm font-medium mt-1'>
                  {receiverLocation?.lng}
                </p>

              </div>

            </div>

          )

        }

      </div>

      <div className='rounded-2xl overflow-hidden shadow-lg bg-white'>

        {

          reveal && data.latitude && data.longitude && (

            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
            >

              <GoogleMap
                mapContainerStyle={containerStyle}
                 center={center}
                zoom={18}
                mapTypeId="hybrid"
              >

                <Marker
                  position={center}
                  label="S"
      
                />

                {

                  receiverLocation && (

                    <Marker
                      position={receiverLocation}
                      label="R"
                      
                    />

                  )

                }

              </GoogleMap>

            </LoadScript>

          )

        }

      </div>

    </div>

  )

}

export default Receiver