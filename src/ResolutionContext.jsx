import { createContext } from "react";

const ResolutionContext = createContext(window?.innerWidth);

export default ResolutionContext;
