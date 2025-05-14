import React, { useContext } from "react";
import { PiFlagDuotone, PiGpsFixFill } from "react-icons/pi";
import CurrentUserPositionContext from "./CurrentUserPositionContext";
import MapSheetOptionsContext from "./MapSheetOptionsContext";
import { BiDirections } from "react-icons/bi";
import SidePanelOptionsContext from "./SidePanelOptionsContext";

function MeAndTarget({ panToPosition }) {
  const { currentUserPosition } = useContext(CurrentUserPositionContext);
  const { mapSheetOptions } = useContext(MapSheetOptionsContext);
  const { setSidePanelOptions } = useContext(SidePanelOptionsContext);

  const goToMe = () => {
    if (currentUserPosition?.latitude && currentUserPosition?.longitude) {
      panToPosition(currentUserPosition?.latitude, currentUserPosition?.longitude);
    }
  };
  const goToFlag = () => {
    if (mapSheetOptions?.routeHospital?.lat && mapSheetOptions?.routeHospital?.long) {
      panToPosition(mapSheetOptions?.routeHospital?.lat, mapSheetOptions?.routeHospital?.long);
    }
  };

  const toggleSidePanel = () => {
    setSidePanelOptions((prevState) => {
      return { ...prevState, opened: !prevState?.opened };
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 11,
        top: "calc(20%)",
        zIndex: 999,
        backgroundColor: "#fff",
        width: "30px",
        height: "90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
        borderRadius: "2px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, borderBlock: "1px solid #ccc", width: "100%" }}>
        <PiGpsFixFill size={22} color={(currentUserPosition) ? "blue" : "#ccc"} onClick={goToMe} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, width: "100%" }}>
        <BiDirections size={22} color={mapSheetOptions?.routeHospital ? "blue" : "#ccc"} onClick={toggleSidePanel} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, borderBlock: "1px solid #ccc", width: "100%" }}>
        <PiFlagDuotone size={22} color={mapSheetOptions?.routeHospital ? "blue" : "#ccc"} onClick={goToFlag} />
      </div>
    </div>
  );
}

export default MeAndTarget;
