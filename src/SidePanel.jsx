import React, { useContext, useEffect, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ResolutionContext from "./ResolutionContext";
import { RiHospitalLine } from "react-icons/ri";
import L from "leaflet";
import { LiaLongArrowAltUpSolid } from "react-icons/lia";
import { MdOutlineTurnLeft, MdOutlineTurnRight } from "react-icons/md";
import { FaLongArrowAltUp } from "react-icons/fa";

function SidePanel({ isOpen, setOpen, chosenHospital, setChosenHospital, chosenHospitalDistance, instructions }) {
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
        // height: "30vh",
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 999,
        boxShadow: isOpen ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        pointerEvents: "auto", // Crucial for capturing mouse events
        // height: "100vh",
        // overflow: "auto"
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
      {instructions?.length > 0 && (
        <div style={{ height: "75vh", overflow: "auto" }}>
          {instructions?.map((instruction) => {
            return (
              <div style={{ padding: "0.5rem 0", paddingLeft: "1rem", borderBottom: "1px solid #ccc" }}>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", columnGap: "1rem" }}>
                  <div style={{ backgroundColor: "#81c452", padding: "0.2rem", borderRadius: "0.6rem" }}>
                    {instruction?.sign === 0 ? (
                      <FaLongArrowAltUp style={{ color: "#fff" }} size={40} />
                    ) : instruction?.sign === 2 ? (
                      <MdOutlineTurnRight style={{ color: "#fff" }} size={40} />
                    ) : (
                      <MdOutlineTurnLeft style={{ color: "#fff" }} size={40} />
                    )}
                  </div>
                  <p style={{ fontSize: "14px" }}>{instruction?.text}</p>
                </div>
                <div>
                  <p style={{color: "gray", marginTop: "0.5rem"}}>{instruction?.distance?.toFixed(2)} mètres</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SidePanel;
