import React, { use, useEffect } from 'react'
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
  SquareX,
  CheckCircle,
  Clock3,
  LocateFixed,
  Users,
  RefreshCcw
} from 'lucide-react';

const Sender = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [code] = useState(Math.floor(100000 + Math.random() * 900000))
  const [reveal, setReveal] = useState(false);
  const [receiverLocation, setReceiverLocation] = useState([]);
  const [copied, isCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [date, setDate] = useState([]);
  const [spin, setSpin] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [autoClick, setAutoClick] = useState(false);
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
        axios.post(
          'https://location-share-f1m3.onrender.com/share',
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
    setSharing(true);
    const now = new Date()
    setDate([now.getDate(), now.getMonth(), now.getFullYear(), now.getHours(), now.getMinutes(), now.getSeconds()])
  }
  async function handleReceiver() {
    setSpin(true);
    const response = await axios.post(
      'https://location-share-f1m3.onrender.com/sendReceiver', {
      code: code
    }
    )
    setReceiverLocation(response.data);
    console.log(response.data);
    console.log(receiverLocation);
    setSpin(false);
  }

  //  useEffect(()=>{
  //   const interval = setInterval(() => {
  //      handleReceiver();
  //   }, 5000);
  //   return ()=>clearInterval(interval);
  //  },[])
  const center = {
    lat: data[2],
    lng: data[1]
  };
  const rData = {
    lat: receiverLocation.latitude,
    lng: receiverLocation.longitude
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
    axios.post(
      'https://location-share-f1m3.onrender.com/share',
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
    const now = new Date()
    setDate([now.getDate(), now.getMonth(), now.getFullYear(), now.getHours(), now.getMinutes(), now.getSeconds()])
  }
  async function handleDelete() {
    await axios.delete(
      `https://location-share-f1m3.onrender.com/delete/${data[0]}`
    );
    console.log("Deleted")
    setData([0, 0, 0]);
    setReveal(false);
    setSharing(false);
    setReceiverLocation([]);

  }

  async function handleCopy() {
    await navigator.clipboard.writeText(data[0]);
    isCopied(true);
    setTimeout(() => {
      isCopied(false);
    }, 5000);
  }

  useEffect(() => {
    const intervalid = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(intervalid);
        return;
      }
      if (seconds === 0) {
        setMinutes(prev => prev - 1);
        setSeconds(59)

      }
      else {
        setSeconds(prev => prev - 1)
      }

    }, 1000);
    return () => clearInterval(intervalid)
  }, [minutes, seconds]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      handleDelete();
      setAutoClick(true);
      setTimeout(() => {
        setAutoClick(false);
      }, 1000);
    }
  }, [minutes, seconds]);

  const today = new Date()
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <div className="flex items-center  gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Send size={28} color="white" />
            </div>
            <div className='flex items-center justify-between w-full'>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Share Your Location
                </h1>
                <p className="text-gray-500 text-sm">
                  Generate a code and share your live location
                </p>
              </div>

              {sharing &&
                <div className='flex items-center bg-green-200 p-1 pl-2 pr-2 rounded-3xl '>
                  <div className='bg-green-600 h-3 w-3 rounded-full'></div>
                  <div className='relative right-3 bg-green-400 h-3 w-3 rounded-full animate-ping'></div>
                  <p>Sharing active</p>
                </div>
              }
              {!sharing &&
                <div className='flex items-center bg-gray-200 p-1 pl-2 pr-2 rounded-3xl '>
                  <div className='bg-gray-600 h-3 w-3 rounded-full'></div>
                  <div className='relative right-3 bg-gray-400 h-3 w-3 rounded-full'></div>
                  <p className='text-gray-400'>Sharing Inactive</p>
                </div>
              }
            </div>


          </div>

          <p className="text-gray-600 bg-slate-100 p-4 rounded-xl mb-6">
            Share this code with the receiver to share your location. You can
            drag the marker to update your position.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              className="flex-1 items-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300"
              onClick={() => handleGetCode()}
            >

              Get Current Location
            </button>

            <button
              className="flex-1 bg-black hover:bg-green-800 text-white py-3 rounded-xl font-medium transition-all duration-300"
              onClick={() => handleReceiver()}
            >
              Get Receiver Data
            </button>
          </div>

          {loading && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-xl mb-4">
              Loading...
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white mb-4">
            <p className="text-sm opacity-80">Your Code</p>
            <div className='flex items-center justify-between'>
              <h1 className="text-5xl font-bold tracking-widest mt-2">
                {data[0]}
              </h1>
              <button onClick={() => handleCopy()}>
                {copied ? <CheckCircle /> : <Copy />}
              </button>
            </div>

          </div>
          <div className="bg-white border rounded-2xl p-5 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Set Timer(Auto stop)
              </h2>

              <div className="bg-blue-50 px-4 py-2 rounded-xl">
                <p className="text-3xl font-bold text-blue-700">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => {
                  setMinutes(10);
                  setSeconds(0);
                }}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-gray-300 text-black py-3 rounded font-medium transition-all duration-300 "
              >
                10:00
              </button>

              <button
                onClick={() => {
                  setMinutes(5);
                  setSeconds(0);
                }}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-gray-300 text-black py-3 rounded font-medium transition-all duration-300 "
              >
                05:00
              </button>

              <button
                onClick={() => {
                  setMinutes(3);
                  setSeconds(0);
                }}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-gray-300 text-black py-3 rounded font-medium transition-all duration-300 "
              >
                03:00
              </button>
            </div>

            <button
              onClick={() => {
                setMinutes(0);
                setSeconds(0);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[0.98]"
            >
              Cancel Timer
            </button>
          </div>
          <div className="bg-slate-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-red-500" />
              <h2 className="font-semibold text-gray-800">
                Current Location
              </h2>
            </div>

            <p className="font-mono text-sm break-all text-gray-700">
              {data[1]}, {data[2]}
            </p>
          </div>
          <div className='flex items-center border w-fit pr-2 mb-3 rounded'>
            <Clock3 className='text-blue-700 ml-2 bg-blue-100 h-8 w-8 p-1 rounded-md' />
            <div className='ml-4'>
              <p className=''>Last Updated</p>
              <p className='font-bold text-lg'>{date[0]}/{date[1]}/{date[2]}  {date[3]}:{date[4]}:{date[5]}</p>
            </div>
          </div>
          <div className='border-2 p-2 mb-2'>
            <div className='flex justify-between'>
              <Users className='bg-blue-600 p-1 rounded-lg  text-white' size={30} />
              <h1 className='text-2xl font-bold'>Active Receivers ({receiverLocation.length})</h1>
              <RefreshCcw onClick={() => handleReceiver()} className={`text-blue-800 ${spin ? `animate-spin` : `animate-none`}   `} size={27} />
            </div>
            {receiverLocation.map((receiver, index) => (
              <div className='flex items-center mt-4 py-2 rounded-md   bg-green-50'>
                <MapPin className='text-red-800' />
                <h1 className='font-semibold text-xl'>{receiver.name}</h1>
              </div>
            ))}

          </div>
          <button
            className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium ${autoClick? "scale-90 opacity-70":"scale-100 opacity-100"} transition-all duration-300`}
            onClick={() => handleDelete()}
          >
            Stop Sharing
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <h2 className="text-white text-xl font-semibold">
              Live Tracking
            </h2>
            <p className="text-blue-100 text-sm">
              Sender & Receiver Locations
            </p>
          </div>

          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
            {reveal && (
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '800px'
                }}
                center={center}
                zoom={18}
                mapTypeId="hybrid"
              >
                <Marker
                  position={center}
                  label="S"
                  draggable={true}
                  onDragEnd={(e) =>
                    handleDraglocation(
                      e.latLng.lng(),
                      e.latLng.lat()
                    )
                  }
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new window.google.maps.Size(50, 50)
                  }}
                />


                {receiverLocation.map((receiver, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: receiver.latitude,
                      lng: receiver.longitude
                    }}
                    label={receiver.name[0]}
                  />
                ))}
              </GoogleMap>
            )}
          </LoadScript>

          {!reveal && (
            <div className="h-[650px] flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-600">
                  No Location Shared Yet
                </h3>
                <p className="text-gray-500">
                  Generate your location to start tracking
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Sender