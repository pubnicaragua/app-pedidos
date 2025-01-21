// import type React from "react"
// import { useEffect, useRef } from "react"
// import { Loader } from "@googlemaps/js-api-loader"

// interface MapSelectorProps {
//   location: { lat: number | null; lng: number | null }
//   setLocation: (location: { lat: number; lng: number }) => void
// }

// const MapSelector: React.FC<MapSelectorProps> = ({ location, setLocation }) => {
//   const mapRef = useRef<HTMLDivElement>(null)
//   const markerRef = useRef<google.maps.Marker | null>(null)

//   useEffect(() => {
//     const loader = new Loader({
//       apiKey: "TU_API_KEY_DE_GOOGLE_MAPS",
//       version: "weekly",
//     })

//     loader.load().then(() => {
//       if (mapRef.current) {
//         const map = new google.maps.Map(mapRef.current, {
//           center: { lat: location.lat || 12.136389, lng: location.lng || -86.251389 },
//           zoom: 15,
//         })

//         markerRef.current = new google.maps.Marker({
//           position: { lat: location.lat || 12.136389, lng: location.lng || -86.251389 },
//           map: map,
//           draggable: true,
//         })

//         google.maps.event.addListener(markerRef.current, "dragend", () => {
//           const position = markerRef.current?.getPosition()
//           if (position) {
//             setLocation({ lat: position.lat(), lng: position.lng() })
//           }
//         })

//         // Usar geolocalización del navegador si está disponible
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const pos = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude,
//               }
//               map.setCenter(pos)
//               if (markerRef.current) {
//                 markerRef.current.setPosition(pos)
//               }
//               setLocation(pos)
//             },
//             () => {
//               console.log("Error: The Geolocation service failed.")
//             },
//           )
//         }
//       }
//     })
//   }, [location, setLocation])

//   return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
// }

// export default MapSelector

