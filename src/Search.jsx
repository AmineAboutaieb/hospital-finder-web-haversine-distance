import React, { useEffect, useRef, useState } from "react";
import { CgSearchLoading } from "react-icons/cg";
import { TfiFaceSad } from "react-icons/tfi";
import L from "leaflet";

function Search({ hospitals, setOpen, chosenHospital, setChosenHospital, getPositionAndCalcHospitalsDistanceOnSearchClick, menuFocused, setMenuFocused }) {
  const [search, setSearch] = useState("");
  const [searchHospitals, setSearchedHospitals] = useState([]);

  const searchHandler = (e) => {
    const val = e?.target?.value;
    setSearch(val);
    setSearchedHospitals(hospitals?.filter((hsp) => hsp?.name?.toLowerCase()?.trim()?.includes(val?.toLowerCase()?.trim())));
    if (!val) {
      setSearchedHospitals([]);
      setOpen(false);
    }
  };

  let isSearchValid = search && typeof search === "string" && search?.trim() != "";

  const searchRef = useRef(null);
  useEffect(() => {
    if (searchRef.current) {
      // Disable click propagation to the map for this element
      L.DomEvent.disableClickPropagation(searchRef.current);
    }
  }, []);
  return (
    <>
      <div
        style={{
          width: "200px",
          position: "absolute",
          top: "1rem",
          left: "15%",
          zIndex: 500,
        }}
      >
        <input
          ref={searchRef}
          type="text"
          style={{
            width: "100%",
            padding: "0.4rem",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            pointerEvents: "auto", // Crucial for capturing mouse events
          }}
          value={search}
          onChange={searchHandler}
          onFocus={(e) => {
            setMenuFocused(true);
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()} // Prevents the map click event
        />
      </div>

      <div
        style={{
          width: "250px",
          height: isSearchValid && menuFocused ? "120px" : "0px",
          overflow: "hidden",
          transition: "height 0.3s ease",
          position: "absolute",
          top: "8%",
          left: "15%",
          zIndex: 999,
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: isSearchValid && menuFocused ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
          padding: isSearchValid && menuFocused ? "0.5rem" : "0rem",
        }}
      >
        {/* You can put content inside here */}
        {searchHospitals?.map((hsp) => {
          return (
            <div
              className="hospitalItem"
              style={{ borderBottom: "1px solid #ccc", paddingBottom: "0.2rem", marginBottom: "0.5rem", cursor: "pointer" }}
              onClick={() => {
                setChosenHospital(hsp);
                setOpen(true);
                getPositionAndCalcHospitalsDistanceOnSearchClick(hsp);
              }}
            >
              <p>{hsp?.name}</p>
            </div>
          );
        })}
        {searchHospitals?.length === 0 && (
          <div>
            <p>Aucun résultat ...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Search;
