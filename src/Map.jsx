import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup, LayerGroup, Circle, Polyline, GeoJSON } from "react-leaflet";
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
import CurrentUserPositionContext from "./CurrentUserPositionContext";
import provinces from "./assets/provinces.json";
import MapSheetOptionsContext from "./MapSheetOptionsContext";
import MeAndTarget from "./MeAndTarget";
import SidePanelOptionsContext from "./SidePanelOptionsContext";
import { GiPositionMarker } from "react-icons/gi";

// Convert the React icon to static HTML
const hospitalIconHTML = renderToStaticMarkup(
  <div
    style={{
      backgroundColor: "#ea4335",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "35px",
      width: "35px",
      height: "35px",
      border: "1px solid #fff",
    }}
  >
    <FaHospital fontSize={18} style={{ color: "#fff", padding: "0", margin: "0", width: "100%" }} />
  </div>
);

const hospitalIcon = L.divIcon({
  html: hospitalIconHTML,
  className: "", // No default Leaflet styles
  // iconSize: [24, 24],
  // iconAnchor: [12, 12],
});

// Convert the React icon to static HTML
const MeIconHTML = renderToStaticMarkup(<GiPositionMarker style={{ color: "#0b57d0", fontSize: "26px" }} />);

const MeIcon = L.divIcon({
  html: MeIconHTML,
  className: "", // No default Leaflet styles
  iconSize: [28, 28],
  iconAnchor: [17, 17],
});

const Map = ({ hospitals, isOpen, setOpen, chosenHospital, setChosenHospital, chosenHospitalDistance, setChosenHospitalDistance, toggleSheet, mapRef, setMapRef }) => {
  // const mapRef = useRef(null);
  const latitude = 33.9693338;
  const longitude = -6.9396652;

  const [instructions, setInstructions] = useState([]);
  const { currentUserPosition } = useContext(CurrentUserPositionContext);

  const { mapSheetOptions, setMapSheetOptions } = useContext(MapSheetOptionsContext);
  const { sidePanelOptions, setSidePanelOptions } = useContext(SidePanelOptionsContext);
  const [showGeoJson, setShowGeoJson] = useState(false);

  const panToPosition = (lat, long) => {
    // map.panTo([lat, lng], { animate: true, duration: 1 });
    if (mapRef) {
      mapRef.panTo([lat, long], { animate: true, duratin: 1 });
    }
  };

  const getDirectionsHandler = async (hsp) => {
    let directions = await HarvestineUtils.graphhopperDirections(currentUserPosition?.latitude, currentUserPosition?.longitude, hsp?.lat, hsp?.long);
    let points = directions?.data?.paths?.[0]?.points;
    let distance = directions?.data?.paths?.[0]?.distance;
    let instructions = directions?.data?.paths?.[0]?.instructions;
    // console.log(points)
    if (directions && points) {
      setMapSheetOptions((prevState) => {
        return { ...prevState, routePoints: points, routeHospital: hsp, routeHospitalDistance: distance };
      });
      // toggleSheet();
    }

    if (instructions) {
      setSidePanelOptions((prevState) => {
        return { ...prevState, instructions: instructions };
      });
    }
    console.log("got here");
  };

  // useEffect(() => {
  //   console.log("MAP SHEET ROUTE POINTS CHANGED");
  //   if (mapSheetOptions?.routePoints) {
  //     fitTwoPoints(currentUserPosition?.latitude, currentUserPosition?.longitude, mapSheetOptions?.routeHospital?.lat, mapSheetOptions?.routeHospital?.long);
  //   }
  // }, [mapSheetOptions?.routePoints]);

  const fitTwoPoints = (lat1, long1, lat2, long2) => {
    // console.log("FIT TWO POINTS", lat1, long1, lat2, long2);
    if (mapRef) {
      const bounds = L.latLngBounds([
        [lat1, long1],
        [lat2, long2],
      ]);
      mapRef.fitBounds(bounds, {
        // padding: [30, 30], // optional padding
        animate: true, // smooth transition
      });
    }
  };

  useEffect(() => {
    setShowGeoJson(false);
    setTimeout(() => {
      setShowGeoJson(true);
      if (mapRef) {
        const layer = new L.GeoJSON(mapSheetOptions?.province);
        const bounds = layer.getBounds();
        mapRef?.fitBounds(bounds, { maxZoom: 20 });
      }
    }, 10);
  }, [mapSheetOptions?.province]);

  useEffect(() => {
    if (mapSheetOptions?.routeHospital) {
      getDirectionsHandler(mapSheetOptions?.routeHospital);
    }
  }, [currentUserPosition]);

  return (
    <MapContainer
      ref={setMapRef}
      center={[latitude, longitude]}
      zoom={5}
      whenCreated={setMapRef}
      style={{ height: "100vh", overflow: "hidden" }}
      // maxBounds={[
      //   [33.187949, -7.117014],
      //   [35.010163, -5.304844],
      // ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

      {mapSheetOptions?.province && showGeoJson && (
        <GeoJSON
          style={() => ({
            color: "green", // Line color
            weight: 2, // Line width
            opacity: 0.8, // Line opacity
            fillColor: "green", // Fill color
            fillOpacity: 0.2, // Fill opacity
          })}
          // attribution="&copy; credits due..."
          data={mapSheetOptions?.province}
        />
      )}

      {/* {mapSheetOptions?.routeHospital && (
        <Circle
          center={[mapSheetOptions?.routeHospital?.lat, mapSheetOptions?.routeHospital?.long]}
          radius={200} // Radius in meters
          pathOptions={{ color: "#81c452", fillColor: "#81c452", fillOpacity: 0.5 }}
        />
      )} */}

      {/* <GeoJSON attribution="&copy; credits due..." data={provinces} /> */}

      {currentUserPosition && currentUserPosition?.latitude && currentUserPosition?.longitude && (
        <Marker icon={MeIcon} position={[currentUserPosition?.latitude, currentUserPosition?.longitude]}>
          <Popup>Moi</Popup>
        </Marker>
      )}

      {mapSheetOptions?.hospitals &&
        mapSheetOptions?.hospitals?.length > 0 &&
        mapSheetOptions?.hospitals?.map((hsp) => {
          return (
            // setOpen
            <Marker
              key={hsp?.id}
              position={[hsp?.lat, hsp?.long]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => {
                  getDirectionsHandler(hsp);
                  fitTwoPoints(currentUserPosition?.latitude, currentUserPosition?.longitude, hsp?.lat, hsp?.long);
                },
              }}
            >
              <Popup>{hsp?.name}</Popup>
            </Marker>
          );
        })}

      <SidePanel
        isOpen={isOpen}
        setOpen={setOpen}
        chosenHospital={chosenHospital}
        setChosenHospital={setChosenHospital}
        chosenHospitalDistance={chosenHospitalDistance}
        instructions={instructions}
      />
      {mapSheetOptions?.routePoints && <Polyline positions={polyline.decode(mapSheetOptions?.routePoints).map(([lat, lng]) => [lat, lng])} color="blue" weight={3} />}
      <MeAndTarget panToPosition={panToPosition} />
    </MapContainer>
  );
};

export default Map;
