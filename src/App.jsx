import { Sheet } from "react-modal-sheet";
import "./App.css";
import Map from "./Map";
import { useEffect, useState } from "react";
import Search from "./Search";
import SidePanel from "./SidePanel";
import ResolutionContext from "./ResolutionContext";

function App() {
  const [hospitals, setHospitals] = useState([
    {
      id: 1,
      name: "Hôpital Moulay Youssef",
      lat: 34.0109423,
      long: -6.8650995,
    },
    {
      id: 2,
      name: "Hôpital Cheikh Zayd",
      lat: 33.9778766,
      long: -6.871546,
    },
    {
      id: 3,
      name: "Hôpital militaire",
      lat: 33.9687117,
      long: -6.873531,
    },
  ]);
  const [chosenHospital, setChosenHospital] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [screenResolution, setScreenResolution] = useState(window.innerWidth);
  const [chosenHospitalDistance, setChosenHospitalDistance] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      console.log("resize", window.innerWidth);
      setScreenResolution(window.innerWidth);
    });
  }, []);

  return (
    <ResolutionContext.Provider value={{ screenResolution, setScreenResolution }}>
      <div>
        <Map hospitals={hospitals} isOpen={isOpen} setOpen={setOpen} chosenHospital={chosenHospital} setChosenHospital={setChosenHospital} chosenHospitalDistance={chosenHospitalDistance} setChosenHospitalDistance={setChosenHospitalDistance} />
        {/* setOpen={setOpen} chosenHospital={chosenHospital} setChosenHospital={setChosenHospital} */}
      </div>
    </ResolutionContext.Provider>
  );
}

export default App;
