import React from 'react';

const Navbar: React.FC = () => (
  <nav className="w-full flex items-center justify-between px-8 py-4 bg-orange-500 shadow">
    <span className="text-2xl font-bold text-white">TeamTails</span>
    <span className="text-gray-200 text-base font-light">HappyFox Frontend assignment</span>
  </nav>
);

export default Navbar;