import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home.jsx';
import Register from '../Pages/Register.jsx';
import Login from '../Pages/Login.jsx';
import OtpVerification from '../Pages/OtpVerification.jsx';
import ForgotPassword from '../Pages/forgotPassword.jsx';
import CreateRoom from '../Pages/createRoom.jsx';
import DevRoom from '../Components/DevRoom/DevRoom.jsx';
import JoinRoom from '../Pages/JoinRoom.jsx'; // Assuming you have a JoinRoom component
import MobileWarning from '../Components/mobileWarning.jsx'; // Importing the MobileWarning component
import AboutSection from '../Components/aboutSection.jsx';
import FeaturesSection from '../Components/featuresSection.jsx';
import WhyCodeMateSection from '../Components/WhyCodeMate.jsx';
import UnavailablePage from "../Pages/UnavailablePage.jsx"



const AppRoute = ({ revealNow }) => {
  return (
    <>
      <MobileWarning /> {/* Display the mobile warning */}
    <Routes>
      <Route path='/' element={<Home revealNow={revealNow} />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/verify-otp' element={<OtpVerification />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/create-room' element={<CreateRoom />} />
      <Route path="/dev-room/:roomId" element={<DevRoom />} />
      <Route path="/Join-room" element={<JoinRoom />} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="/features" element={<FeaturesSection />} />
      <Route path="/why-codemate" element={<WhyCodeMateSection />} />
      <Route path="/unpage" element={<UnavailablePage />} />
      {/* Add more routes as needed */}

    </Routes>
    </>
  );
};

export default AppRoute;
