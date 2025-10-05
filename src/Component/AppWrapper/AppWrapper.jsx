// src/components/AppWrapper.jsx

import { useProtectContent } from "../../Pages/hooks/useProtectContent";

const AppWrapper = ({ children }) => {
  // Use the protection hook
  useProtectContent();

  return children;
};

export default AppWrapper;