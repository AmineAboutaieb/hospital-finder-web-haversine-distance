import React, { useContext, useState } from "react";
import { PiFlagDuotone } from "react-icons/pi";
import { Sheet } from "react-modal-sheet";
import MapSheetOptionsContext from "./MapSheetOptionsContext";
import provinces from "./assets/provinces.json";
import CurrentUserPositionContext from "./CurrentUserPositionContext";
import { MdOutlineDirections } from "react-icons/md";
import HarvestineUtils from "./utils/Harvestine";
import polyline from "@mapbox/polyline";
import SidePanelOptionsContext from "./SidePanelOptionsContext";
import ResolutionContext from "./ResolutionContext";
import LoadingContext from "./LoadingContext";
import L from "leaflet";

function BottomSheet({ isSheetOpen, toggleSheet, hospitals, mapRef }) {
  let provincesNames = [
    "",
    "Rabat-Salé-Kenitra",
    "Laâyoune-Sakia El Hamra",
    "Tangier-Tetouan-Al Hoceima",
    "Oriental",
    "Drâa-Tafilalet",
    "Souss-Massa",
    "Guelmim-Oued Noun",
    "Casablanca-Settat",
    "Marrakech-Safi",
    "Dakhla-Oued Ed-Dahab",
    "Fez-Meknes",
    "Béni Mellal-Khénifra",
  ];

  const { mapSheetOptions, setMapSheetOptions } = useContext(MapSheetOptionsContext);
  const { setSidePanelOptions } = useContext(SidePanelOptionsContext);
  const { screenResolution } = useContext(ResolutionContext);
  const { setAppLoading } = useContext(LoadingContext);

  const { currentUserPosition } = useContext(CurrentUserPositionContext);
  const getProvinceByName = (name) => {
    return provinces?.features?.find((prv) => prv?.properties?.name === name);
  };
  const getHospitalsByProvinceName = (provinceName) => {
    let provinceHospitals = hospitals?.filter((hsp) => hsp?.province === provinceName);
    return provinceHospitals;
  };
  const provinceChangeHandler = (data) => {
    if (data?.target?.value) {
      //   setLoading(true);
      let province = getProvinceByName(data?.target?.value);
      let hospitalsByProvince = getHospitalsByProvinceName(data?.target?.value);
      console.log(hospitalsByProvince);
      let sortedHospitals = HarvestineUtils.sortByDistance({ lat: currentUserPosition?.latitude, long: currentUserPosition?.longitude }, hospitalsByProvince);
      console.log("sorted by distance", sortedHospitals);
      setMapSheetOptions((prevState) => {
        return { ...prevState, city: data?.target?.value, province: province, hospitals: sortedHospitals, routePoints: null, routeHospital: null, routeHospitalDistance: null };
      });
      //   setLoading(false);
    }
  };
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
  const getDirectionsHandler = async (hsp) => {
    // setAppLoading(true);
    let directions = await HarvestineUtils.graphhopperDirections(currentUserPosition?.latitude, currentUserPosition?.longitude, hsp?.lat, hsp?.long);
    let points = directions?.data?.paths?.[0]?.points;
    let distance = directions?.data?.paths?.[0]?.distance;
    let instructions = directions?.data?.paths?.[0]?.instructions;
    // console.log(points)
    if (directions && points) {
      setMapSheetOptions((prevState) => {
        return { ...prevState, routePoints: points, routeHospital: hsp, routeHospitalDistance: distance };
      });
      fitTwoPoints(currentUserPosition?.latitude, currentUserPosition?.longitude, hsp?.lat, hsp?.long);
      toggleSheet();
    }
    if (instructions) {
      setSidePanelOptions((prevState) => {
        return { ...prevState, instructions: instructions };
      });
    }
    // setAppLoading(false);
  };
  return (
    <Sheet isOpen={isSheetOpen} onClose={toggleSheet}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div style={{ padding: "0 0.5rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", columnGap: "1rem", paddingBottom: "0.8rem", justifyContent: `${screenResolution <= 425 ? "center" : "flex-start"}` }}
            >
              <PiFlagDuotone style={{ fontSize: "2rem" }} color="#ea4335" />
              <p>Où souhaitez-vous aller ?</p>
            </div>
            <div style={{ margin: `0.5rem ${screenResolution <= 425 ? "auto" : "0"}`, width: screenResolution <= 425 ? "90%" : "300px" }}>
              <p style={{ marginBottom: "0.4rem" }}>Choisissez une province</p>
              <select
                defaultValue="Pick a color"
                className="select"
                style={{ outline: "none", width: "100%" }}
                value={mapSheetOptions?.city || ""}
                onChange={provinceChangeHandler}
              >
                {/* <option disabled={true}>Pick a color</option> */}
                {provincesNames?.map((prv) => {
                  return <option>{prv}</option>;
                })}
              </select>
            </div>
            {/* Suggestions */}
            <div style={{ margin: "0.5rem 0 0 0", height: "100%", overflow: "scroll" }}>
              <ul className="list bg-base-100 rounded-box shadow-md" style={{ overflow: "scroll", maxHeight: "58vh" }}>
                {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Hopitaux du plus proche au plus loin</li> */}

                {mapSheetOptions?.hospitals?.map((hsp) => {
                  return (
                    <li className="list-row" style={{ padding: "8px 5px", margin: "4px 0" }}>
                      <div>
                        <img className="size-10 rounded-box" src={hsp?.avatar} />
                      </div>
                      <div>
                        <div>{hsp?.name}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">{hsp?.distance?.toFixed(2)} km</div>
                      </div>
                      <button className="btn btn-square btn-ghost">
                        <MdOutlineDirections size={30} color="#ea4335" onClick={() => getDirectionsHandler(hsp)} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}

export default BottomSheet;
