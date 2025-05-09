import { Sheet } from "react-modal-sheet";
import "./App.css";
import Map from "./Map";
import { useEffect, useState } from "react";
import Search from "./Search";
import SidePanel from "./SidePanel";
import ResolutionContext from "./ResolutionContext";
import appLogo from "./assets/logo.png";
import mosaic from "./assets/mosaic.png";

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
      lat: 33.9697284,
      long: -6.8703992,
    },
  ]);
  const [chosenHospital, setChosenHospital] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [screenResolution, setScreenResolution] = useState(window.innerWidth);
  const [chosenHospitalDistance, setChosenHospitalDistance] = useState(0);
  const [splashLoading, setSplashLoading] = useState(true);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenResolution(window.innerWidth);
    });
    setTimeout(() => {
      setSplashLoading(false);
    }, 3000);
  }, []);

  return (
    <ResolutionContext.Provider value={{ screenResolution, setScreenResolution }}>
      <div
        style={{
          width: "100vw",
          height: splashLoading ? "100vh" : "0vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // backgroundImage: `url(${mosaic})`,
          // backgroundRepeat: "repeat",
          // backgroundImage: "linear-gradient(to bottom right, #337d67, #fff)",
          backgroundColor: "#81c452",
          transition: "height 0.3s ease",
        }}
      >
        <img src={appLogo} style={{ width: "200px", animation: "logoAnimation 5s infinite" }} />
      </div>
      {!splashLoading && (
        <div>
          <Map
            hospitals={hospitals}
            isOpen={isOpen}
            setOpen={setOpen}
            chosenHospital={chosenHospital}
            setChosenHospital={setChosenHospital}
            chosenHospitalDistance={chosenHospitalDistance}
            setChosenHospitalDistance={setChosenHospitalDistance}
          />
          {/* setOpen={setOpen} chosenHospital={chosenHospital} setChosenHospital={setChosenHospital} */}
        </div>
      )}
    </ResolutionContext.Provider>
  );
}

export default App;
