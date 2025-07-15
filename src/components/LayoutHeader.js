import React from 'react';

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

  // Cerrar menú cuando se navega (importante para móvil)
  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const buttonClass = (page) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      currentPage === page ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
      <nav className="flex space-x-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Inicio
        </button>
        <button
          onClick={() => onNavigate('clients')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'clients' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Clientes
        </button>
        <button
          onClick={() => onNavigate('machinery')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'machinery' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Recursos
        </button>
        <button
          onClick={() => onNavigate('jobs')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'jobs' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Trabajos
        </button>
        <button
          onClick={() => onNavigate('reports')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'reports' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Reportes
        </button>
      </nav>

      {/* Menú desplegable para móvil */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col md:hidden z-20">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`px-4 py-3 text-left border-b border-gray-200 transition-colors ${
              currentPage === 'dashboard'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavigate('clients')}
            className={`px-4 py-3 text-left border-b border-gray-200 transition-colors ${
              currentPage === 'clients'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => handleNavigate('machinery')}
            className={`px-4 py-3 text-left border-b border-gray-200 transition-colors ${
              currentPage === 'machinery'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Recursos
          </button>
          <button
            onClick={() => handleNavigate('jobs')}
            className={`px-4 py-3 text-left border-b border-gray-200 transition-colors ${
              currentPage === 'jobs'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Trabajos
          </button>
          <button
            onClick={() => handleNavigate('reports')}
            className={`px-4 py-3 text-left transition-colors ${
              currentPage === 'reports'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Reportes
          </button>
        </nav>
      )}
    </header>
  );
};

export default LayoutHeader;
