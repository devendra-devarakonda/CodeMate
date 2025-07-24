// components/MobileWarning.jsx
import React from "react";

const MobileWarning = () => {
  return (
    <div className="flex md:hidden fixed inset-0 z-50 bg-black text-white flex-col items-center justify-center text-center p-6">
      <h1 className="text-2xl font-bold mb-4">🖥️ Desktop Experience Recommended</h1>
      <p className="text-lg">
        This website is designed for laptop/desktop use.
        <br />
        For the best collaborative coding experience, please open it on a larger screen.
      </p>
    </div>
  );
};

export default MobileWarning;
