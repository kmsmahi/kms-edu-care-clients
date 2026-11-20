import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

/**
 * Root route element: scrolls to top on every navigation,
 * then renders whichever layout matched.
 */
const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return <Outlet />;
};

export default App;