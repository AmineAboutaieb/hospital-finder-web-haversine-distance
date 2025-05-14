import { Sheet } from "react-modal-sheet";
import "./App.css";
import Map from "./Map";
import { useEffect, useState } from "react";
import Search from "./Search";
import SidePanel from "./SidePanel";
import ResolutionContext from "./ResolutionContext";
import appLogo from "./assets/logo.png";
// import mosaic from "./assets/mosaic.png";
import CurrentUserPositionContext from "./CurrentUserPositionContext";
import BottomSheet from "./BottomSheet";
import { IoIosArrowDropup, IoIosArrowUp } from "react-icons/io";
import provinces from "./assets/provinces.json";
import MapSheetOptionsContext from "./MapSheetOptionsContext";
import avatarPlaceHolder from "./assets/hospitals_pics/moulay_youssef.png";
import SidePanelOptionsContext from "./SidePanelOptionsContext";
import toast, { Toaster } from "react-hot-toast";
import LoadingContext from "./LoadingContext";
// https://hospitals.frmjj-app.ma/public/hospitals.json
function App() {
  const [hospitals, setHospitals] = useState([]);
  const [chosenHospital, setChosenHospital] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [screenResolution, setScreenResolution] = useState(window.innerWidth);
  const [chosenHospitalDistance, setChosenHospitalDistance] = useState(0);
  const [splashLoading, setSplashLoading] = useState(true);
  const [currentUserPosition, setCurrentUserPosition] = useState(null);
  const [currentUserPublicPosition, setCurrentUserPublicPosition] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mapSheetOptions, setMapSheetOptions] = useState({
    city: null,
    province: null,
    hospitals: null,
    routePoints: null,
    routeHospital: null,
    routeHospitalDistance: null,
  });
  const [sidePanelOptions, setSidePanelOptions] = useState({ opened: false, instructions: null });
  const [appLoading, setAppLoading] = useState(true);
  const [mapRef, setMapRef] = useState(null);

  const toggleSheet = () => {
    setIsSheetOpen((prevState) => !prevState);
  };

  const areCoordinatesEqual = (coords1, coords2) => {
    console.log("compare", coords1, coords2);
    if (!coords1 || !coords2) return false;

    const roundToSix = (num) => Math.round(num * 1e6) / 1e6;
    return roundToSix(coords1.latitude) === roundToSix(coords2.latitude) && roundToSix(coords1.longitude) === roundToSix(coords2.longitude);
  };

  const getAndSetHospitals = async () => {
    try {
      let response = await fetch("https://hospitals.frmjj-app.ma/", {
        // credentials: "include",
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
      if (response.ok) {
        let data = await response?.json();
        console.log("hospitals", data);
        setHospitals(data);
        setAppLoading(false);
      } else {
        throw new Error("error");
      }
    } catch (e) {
      console.log(e);
      toast.error("Impossible de récupérer la liste des hopitaux");
    }
  };
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    getAndSetHospitals();
    sleep(4000).then(() => {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // setCurrentUserPublicPosition((prevState) => ({ ...prevState, latestAccuracy: position?.coords?.accuracy }));
          if (position?.coords?.accuracy <= 100) {
            setCurrentUserPosition(position?.coords);
          } else {
            toast.dismiss();
            toast.error("Impossible de détecter votre position avec précision", { position: "bottom-center" });
          }
        },
        (error) => {
          console.log(error);
          toast.error("Impossible de récupérer votre position", { position: "bottom-center" });
        },
        {
          enableHighAccuracy: true,
          timeout: 1000,
          maximumAge: 60000,
        }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId); // Clear the watch when component unmounts
      };
    });
  }, []);

  useEffect(() => {
    // console.log("WATCHED POSITION", currentUserPosition);
    if (splashLoading && currentUserPosition) {
      setSplashLoading(false);
    }
    if (currentUserPosition && !areCoordinatesEqual(currentUserPosition, currentUserPublicPosition)) {
      console.log("state update because position is different", currentUserPosition, currentUserPublicPosition);
      setCurrentUserPublicPosition(currentUserPosition);
    } else {
      console.log("no state update because position is same");
    }
  }, [currentUserPosition]);

  return (
    <ResolutionContext.Provider value={{ screenResolution, setScreenResolution }}>
      <LoadingContext.Provider value={{ appLoading, setAppLoading }}>
        <CurrentUserPositionContext.Provider value={{ currentUserPosition: currentUserPublicPosition }}>
          <MapSheetOptionsContext.Provider value={{ mapSheetOptions, setMapSheetOptions }}>
            <SidePanelOptionsContext.Provider value={{ sidePanelOptions, setSidePanelOptions }}>
              <div style={{overflow: "hidden!important"}}>
                <div
                  style={{
                    width: "100vw",
                    height: splashLoading ? "100vh" : "0vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#81c452",
                    transition: "height 0.3s ease",
                  }}
                >
                  {splashLoading && <img src={appLogo} style={{ width: "300px", animation: "logoAnimation 5s infinite", overflow: "hidden" }} />}
                </div>
                {!splashLoading && currentUserPublicPosition && (
                  <div>
                    <Map
                      hospitals={hospitals}
                      isOpen={isOpen}
                      setOpen={setOpen}
                      chosenHospital={chosenHospital}
                      setChosenHospital={setChosenHospital}
                      chosenHospitalDistance={chosenHospitalDistance}
                      setChosenHospitalDistance={setChosenHospitalDistance}
                      toggleSheet={toggleSheet}
                      mapRef={mapRef}
                      setMapRef={setMapRef}
                    />
                  </div>
                )}
                {!splashLoading && (
                  <>
                    <BottomSheet isSheetOpen={isSheetOpen} toggleSheet={toggleSheet} hospitals={hospitals} mapRef={mapRef} />
                    <div
                      style={{
                        zIndex: 999,
                        position: "fixed",
                        bottom: 2,
                        left: "calc(50% - 17.5px)",
                        backgroundColor: "#fff",
                        // padding: "0.3rem 0.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                        boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
                        borderRadius: "2px",
                        // backgroundImage: "linear-gradient(to bottom right,  #2b82cb, #81c452)",
                      }}
                      onClick={toggleSheet}
                    >
                      <IoIosArrowUp style={{ fontSize: "2rem" }} color="#2b82cb" />
                    </div>
                  </>
                )}
                {!splashLoading && <SidePanel />}
                {!splashLoading && appLoading && (
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: "100vw",
                      height: "100vh",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                  >
                    <span className="loading loading-spinner loading-xl" style={{ color: "#fff" }}></span>
                  </div>
                )}
                <Toaster />
              </div>
            </SidePanelOptionsContext.Provider>
          </MapSheetOptionsContext.Provider>
        </CurrentUserPositionContext.Provider>
      </LoadingContext.Provider>
    </ResolutionContext.Provider>
  );
}

export default App;
