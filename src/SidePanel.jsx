import React, { useContext, useEffect, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ResolutionContext from "./ResolutionContext";
import { RiHospitalLine } from "react-icons/ri";
import L from "leaflet";

function SidePanel({ isOpen, setOpen, chosenHospital, setChosenHospital, chosenHospitalDistance }) {
  const { screenResolution, setScreenResolution } = useContext(ResolutionContext);
  const panelRef = useRef(null);
  useEffect(() => {
    if (panelRef.current) {
      // Disable click propagation to the map for this element
      L.DomEvent.disableClickPropagation(panelRef.current);
    }
  }, []);
  return (
    <div
      ref={panelRef}
      style={{
        transition: "width 0.3s ease",
        backgroundColor: "#fff",
        width: isOpen ? (screenResolution < 600 ? "85%" : "30%") : "0%",
        height: "100vh",
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 999,
        boxShadow: isOpen ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        overflow: "hidden",
        pointerEvents: "auto", // Crucial for capturing mouse events
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IoCloseOutline onClick={() => setOpen(false)} style={{ fontSize: "2rem", cursor: "pointer" }} />
      </div>
      {chosenHospital && (
        <div style={{ padding: "0.5rem", margin: "0 0.5rem" }}>
          <div style={{ width: "100%", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center", columnGap: "0.6rem", paddingBottom: "0.5rem" }}>
            <RiHospitalLine size={25} color="#81c452" />
            <h3 style={{ color: "" }}>{chosenHospital?.name}</h3>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "1rem" }}>
            L'hôpital <span style={{ color: "#81c452" }}>{chosenHospital?.name}</span> est loin de <span>{chosenHospitalDistance?.toFixed(2)}</span> km.
          </p>
        </div>
        //
      )}
    </div>
  );
}

export default SidePanel;
