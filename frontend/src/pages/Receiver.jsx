import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import {
  MapPin,
  Search,
  Send,
  CheckCircle2,
  Clock3
} from 'lucide-react';
import { MdDownloading } from "react-icons/md";

const Receiver = () => {

  const containerStyle = {
    width: '100%',
    height: '70vh'
  };

  const [value, setValue] = useState(0)
  const [reveal, setReveal] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [data, setData] = useState({});
  const [receiverLocation, setReceiverLocation] = useState(null);
  const [findLoading, setFindLoading] = useState(false);
  const [sent, setSent] = useState(false);

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

  async function sendData() {
    await axios.post(
      'https://location-share-f1m3.onrender.com/receiverShare', {
      code: value,
      name: "Rohan",
      longitude: receiverLocation.lng,
      latitude: receiverLocation.lat
    }
    )
    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 5000);

  }

  async function handleRequest(enteredCode) {
    setFindLoading(true);
    setInterval(() => {

      fetchLocation(enteredCode);

    }, 5000);

  }

  async function fetchLocation(enteredCode) {

    const response = await axios.post(
      'https://location-share-f1m3.onrender.com/receive',
      {
        code: enteredCode
      }
    );
    if (response.data == "Incorrect") {
      console.log("Wrong code");
      setWrong(true);
      setReveal(true);
      setFindLoading(false);
      return;
    }
    setData(response.data);
    console.log(response);
    setReveal(true);
    setWrong(false);
    setFindLoading(false);
    return response.data;

  }

  const center = {
    lat: data.latitude || 17.3850,
    lng: data.longitude || 78.4867
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl shadow-2xl p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <MdDownloading size={28} color="white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Receive Location
              </h1>
              <p className="text-gray-500">
                Enter the sender code to track location
              </p>
            </div>
          </div>

          <div className="bg-slate-100 rounded-2xl p-4 mb-6">
            <p className="text-gray-600 text-sm">
              Enter the code shared by the sender and start live tracking.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg outline-none focus:border-blue-500 transition"
              onChange={(e) => setValue(e.target.value)}
              type="number"
              placeholder="Enter sharing code"
            />

            <button
              onClick={() => handleRequest(value)}
              className="bg-blue-600  hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Find

              {findLoading && <div className="w-8 h-8 rounded-full border-[3px] border-white  border-t-blue-800 border-b-blue-800 animate-spin"></div>}

            </button>

            <button
              onClick={() => sendData()}
              className="
              px-6 py-3
              text-base text-white
              border-none
              cursor-pointer
              rounded-[15px]
              text-center
              bg-[length:800%_800%]
              bg-[linear-gradient(90deg,#0f2027,#203a43,#5b727c,#0f2027)]
              animate-gradient
              transition-transform
              duration-200
              active:scale-95
            "
            >
              {!sent && <p>Send</p>}
              {sent &&
                <div className='flex items-center'>
                  <CheckCircle2 size={22} />
                  <p className='ml-1'>Sent</p>
                </div>
              }

            </button>


          </div>
          <div className='flex items-center border w-fit pr-2 rounded mt-4'>
            <Clock3 className='text-blue-700 ml-2 bg-blue-100 h-8 w-8 p-1 rounded-md' />
            <div className='ml-4'>
              <p className=''>Last Updated</p>
              <p className='font-bold text-lg'>{data.updatedAt? new Date(data.updatedAt).toLocaleString(): "---"}</p>
            </div>
          </div>


          {reveal && (
            <div className="space-y-4 mt-6">

              {!wrong && <div className="bg-green-100 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={22} />
                  <p className="font-semibold">
                    Connection Established Successfully
                  </p>
                </div>
              </div>}

              {wrong && <div className="bg-red-400 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-white">
                  <p className="font-semibold">
                    Invalid code or the sender is no longer sharing.
                  </p>
                </div>
              </div>
              }

              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} />
                  <h3 className="font-semibold">
                    Sender Location
                  </h3>
                </div>

                <p className="text-sm">
                  Longitude: {data.longitude}
                </p>

                <p className="text-sm mt-1">
                  Latitude: {data.latitude}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} />
                  <h3 className="font-semibold">
                    Your Location
                  </h3>
                </div>

                <p className="text-sm">
                  Latitude: {receiverLocation?.lat}
                </p>

                <p className="text-sm mt-1">
                  Longitude: {receiverLocation?.lng}
                </p>
              </div>

            </div>
          )}

        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <h2 className="text-white text-xl font-semibold">
              Live Tracking Map
            </h2>
            <p className="text-blue-100 text-sm">
              Real-time sender and receiver locations
            </p>
          </div>

          {reveal && data.latitude && data.longitude ? (
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
            >
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "650px"
                }}
                center={center}
                zoom={18}
                mapTypeId="hybrid"
              >
                <Marker
                  position={center}
                  label="S"
                />

                {receiverLocation && (
                  <Marker
                    position={receiverLocation}
                    label="R"
                  />
                )}
              </GoogleMap>
            </LoadScript>
          ) : (
            <div className="h-[650px] flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <MapPin
                  size={48}
                  className="mx-auto text-gray-400 mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-600">
                  Waiting for Code
                </h3>
                <p className="text-gray-500">
                  Enter a valid sharing code to view the map
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );

}

export default Receiver