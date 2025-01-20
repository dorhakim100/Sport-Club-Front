import React from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  minWidth: '300px',
  minHeight: '400px',
  width: '30vw',
  height: '40vw',
  maxWidth: '1000px',
  maxHeight: '1000px',

  borderRadius: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
}

const center = {
  lat: 32.18663495395672,
  lng: 34.82008816740497,
}

const apiKey = import.meta.env.VITE_GOOGLE_MAP

export function GoogleMapCmp() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    language: 'he',
  })

  // const [map, setMap] = React.useState(null)
  const mapRef = useRef()

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    // mapRef.current.fitBounds(bounds)

    // mapRef.current.setZoom(15) // Adjust the zoom level here as needed
    // setMap(map)
  }, [])

  setTimeout(() => {
    // mapRef.current.setZoom(15) // Set a specific zoom after a brief delay
  }, 300) // Adjust the delay as needed

  const onUnmount = React.useCallback(function callback(map) {
    // setMap(null)
  }, [])

  return isLoaded ? (
    <div className='map-container'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        ref={mapRef}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}
