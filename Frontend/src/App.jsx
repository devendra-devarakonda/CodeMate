import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoute from './routes/appRoute.jsx';
import LoaderOverlay from './Components/LoaderOverlay';

const App = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(location.pathname === '/');
  const [revealNow, setRevealNow] = useState(false);

  const handleLoaderFinish = () => {
    setShowLoader(false);
    setRevealNow(true);
  };

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowLoader(false);
      setRevealNow(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showLoader && location.pathname === '/' && (
        <LoaderOverlay onFinish={handleLoaderFinish} />
      )}
      <AppRoute revealNow={revealNow} />
    </>
  );
};

export default App;
