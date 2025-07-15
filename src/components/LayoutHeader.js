import React, { useState } from 'react';
import { FaHome, FaTractor, FaUserFriends, FaClipboardList, FaChartBar } from 'react-icons/fa';

const LayoutHeader = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Panel Principal';
      case 'clients':
        return 'Gestión de Clientes';
      case 'machinery':
        return 'Maquinaria y Operarios';
      case 'jobs':
        return 'Gestión de Trabajos';
      case 'reports':
        return 'Reportes y Análisis';
      default:
        return 'AgroGestión Pro';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const navItems = [
    { key: 'dashboard', label: 'Inicio', icon: <FaHome /> },
    { key: 'clients', label: 'Clientes', icon: <FaUserFriends /> },
    { key: 'machinery', label: 'Recursos', icon: <FaTractor /> },
    { key: 'jobs', label: 'Trabajos', icon: <FaClipboardList /> },
    { key: 'reports', label: 'Reportes', icon: <FaChartBar /> }
  ];

  return (
    <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>

      <button
        className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Menú escritorio */}
      <nav className="hidden md:flex space-x-4">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => handleNavigate(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPage === key ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </nav>

      {/* Menú móvil */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col md:hidden z-20">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleNavigate(key)}
              className={`flex items-center gap-2 px-4 py-3 text-left border-b border-gray-200 transition-colors ${
                currentPage === key ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default LayoutHeader;
