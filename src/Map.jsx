import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap, LayerGroup, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MdGpsFixed } from "react-icons/md";

import { FaHospital } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { PiGpsFill, PiGpsFixDuotone } from "react-icons/pi";
import HarvestineUtils from "./utils/Harvestine";
import Search from "./Search";
import SidePanel from "./SidePanel";
import polyline from "@mapbox/polyline";

// Convert the React icon to static HTML
const hospitalIconHTML = renderToStaticMarkup(<FaHospital style={{ color: "green", fontSize: "26px" }} />);

const hospitalIcon = L.divIcon({
  html: hospitalIconHTML,
  className: "", // No default Leaflet styles
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Convert the React icon to static HTML
const MeIconHTML = renderToStaticMarkup(<PiGpsFill style={{ color: "#0b57d0", fontSize: "26px" }} />);

const MeIcon = L.divIcon({
  html: MeIconHTML,
  className: "", // No default Leaflet styles
  iconSize: [28, 28],
  iconAnchor: [17, 17],
});

const Map = ({ hospitals, isOpen, setOpen, chosenHospital, setChosenHospital, chosenHospitalDistance, setChosenHospitalDistance }) => {
  const mapRef = useRef(null);
  const latitude = 33.9693338;
  const longitude = -6.9396652;

  const [target, setTarget] = useState(null);
  const [hospitalsToShow, setHospitalsToShow] = useState([]);
  const [menuFocused, setMenuFocused] = useState(false);
  const [closestHospitalName, setClosestHospitalName] = useState("");
  const [decodedPolylineRoute, setDecodedPolylineRoute] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {}, [menuFocused]);

  const getGeoPosition = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position?.coords);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true, // Try to get GPS-level accuracy if available
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const getPositionAndCalcHospitalsDistanceOnMount = async () => {
    try {
      let pos = await getGeoPosition();
      let posData = { position: [pos?.latitude, pos?.longitude] };
      setTarget(posData);
      if (posData?.position?.length > 0 && hospitals?.length > 0) {
        let sortedHospitals = compareHospitalsWithMe(posData, hospitals);
        let closestHospital = sortedHospitals[0];
        setHospitalsToShow([closestHospital]);
        fitTwoPoints(pos?.latitude, pos?.longitude, closestHospital?.lat, closestHospital?.long);
        setChosenHospital(closestHospital);
        // let distance = HarvestineUtils.harvesineDistance(pos?.latitude, pos?.longitude, closestHospital?.lat, closestHospital?.long);
        // TEST DIRECTIONS START
        let directions = await HarvestineUtils.graphhopperDirections(pos?.latitude, pos?.longitude, closestHospital?.lat, closestHospital?.long);
        console.log("directions ->", directions, directions?.data?.paths?.[0]?.points);

        setDecodedPolylineRoute(polyline.decode(directions?.data?.paths?.[0]?.points));
        let metersDistance = directions?.data?.paths?.[0]?.distance;
        let kmsDistance = directions?.data?.paths?.[0]?.distance / 1000;
        setChosenHospitalDistance(kmsDistance);
        setInstructions(directions?.data?.paths?.[0]?.instructions);
        // TEST DIRECTIONS STOP
        // setChosenHospitalDistance(distance);
        setOpen(true);
        setClosestHospitalName(closestHospital?.name);
      }
    } catch (e) {
      alert("Veuillez Activer la Localisation et rafraichir la page !");
    }
  };

  const getPositionAndCalcHospitalsDistanceOnSearchClick = async (hsp) => {
    try {
      let pos = await getGeoPosition();
      let posData = { position: [pos?.latitude, pos?.longitude] };
      setTarget(posData);
      if (posData?.position?.length > 0) {
        setHospitalsToShow([hsp]);
        fitTwoPoints(pos?.latitude, pos?.longitude, hsp.lat, hsp.long);
        // let distance = HarvestineUtils.harvesineDistance(pos?.latitude, pos?.longitude, hsp?.lat, hsp?.long);
        // TEST DIRECTIONS START
        let directions = await HarvestineUtils.graphhopperDirections(pos?.latitude, pos?.longitude, hsp?.lat, hsp?.long);
        console.log("directions ->", directions, directions?.data?.paths?.[0]?.points);
        setDecodedPolylineRoute(null);
        setDecodedPolylineRoute(polyline.decode(directions?.data?.paths?.[0]?.points));
        let metersDistance = directions?.data?.paths?.[0]?.distance;
        let kmsDistance = directions?.data?.paths?.[0]?.distance / 1000;
        setChosenHospitalDistance(kmsDistance);
        setInstructions(directions?.data?.paths?.[0]?.instructions);
        // TEST DIRECTIONS STOP
        // setChosenHospitalDistance(distance);
      }
    } catch (e) {
      alert("Veuillez Activer la Localisation et rafraichir la page !");
    }
  };

  const compareHospitalsWithMe = (mePos, hospitalsPos) => {
    let res = HarvestineUtils.sortByDistance({ lat: mePos?.position?.[0], long: mePos?.position?.[1] }, hospitalsPos);
    return res;
  };
  const panAndZoom = (lat, long, zoom) => {
    const map = mapRef.current;
    if (map) {
      map.setView([lat, long], zoom); // or map.flyTo(...)
    }
  };

  const fitTwoPoints = (lat1, long1, lat2, long2) => {
    const map = mapRef.current;
    if (map) {
      const bounds = L.latLngBounds([
        [lat1, long1],
        [lat2, long2],
      ]);
      map.fitBounds(bounds, {
        padding: [30, 30], // optional padding
        animate: true, // smooth transition
      });
      // map.eachLayer((layer) => {
      //   if (layer instanceof L.Polyline) {
      //     map.removeLayer(layer);
      //   }
      // });

      // // Create the line using Leaflet's native polyline method
      // const line = L.polyline(
      //   [
      //     [lat1, long1],
      //     [lat2, long2],
      //   ],
      //   {
      //     color: "red",
      //     weight: 4,
      //   }
      // );

      // // Add the line to the map
      // line.addTo(map);
    }
  };

  useEffect(() => {
    getPositionAndCalcHospitalsDistanceOnMount();
  }, []);

  useEffect(() => {
    setShowRoute(false);
    setTimeout(() => {
      setShowRoute(true);
    }, 500);
  }, [decodedPolylineRoute]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // Attach event listeners
      map.on("click", () => {
        setMenuFocused(false);
      });
      map.on("dragstart", () => {
        setMenuFocused(false);
      });

      // Cleanup on unmount
      return () => {
        map.off("click");
        map.off("dragstart");
      };
    }
  }, [mapRef.current]); // Dependency to ensure it runs when mapRef updates

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={12}
      ref={mapRef}
      style={{ height: "100vh", overflow: "hidden" }}
      maxBounds={[
        [33.187949, -7.117014],
        [35.010163, -5.304844],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" minZoom={10} />

      {target && (
        <Marker position={target?.position} icon={MeIcon}>
          <Popup>Moi</Popup>
        </Marker>
      )}

      {hospitalsToShow?.length > 0 &&
        hospitalsToShow?.map((hsp) => {
          return (
            // setOpen
            <Marker
              key={hsp?.id}
              position={[hsp?.lat, hsp?.long]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => {
                  setOpen(true);
                },
              }}
            >
              <Popup>{hsp?.name}</Popup>
            </Marker>
          );
        })}

      <Search
        hospitals={hospitals}
        setOpen={setOpen}
        chosenHospital={chosenHospital}
        setChosenHospital={setChosenHospital}
        getPositionAndCalcHospitalsDistanceOnSearchClick={getPositionAndCalcHospitalsDistanceOnSearchClick}
        menuFocused={menuFocused}
        setMenuFocused={setMenuFocused}
        closestHospitalName={closestHospitalName}
      />
      <SidePanel
        isOpen={isOpen}
        setOpen={setOpen}
        chosenHospital={chosenHospital}
        setChosenHospital={setChosenHospital}
        chosenHospitalDistance={chosenHospitalDistance}
        instructions={instructions}
      />
      {decodedPolylineRoute && showRoute && <Polyline positions={decodedPolylineRoute.map(([lat, lng]) => [lat, lng])} color="#0b57d0" weight={3} />}
    </MapContainer>
  );
};

export default Map;
