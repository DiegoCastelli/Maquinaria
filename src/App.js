import React, { useState } from 'react';
import LayoutHeader from './components/LayoutHeader';
import DashboardOverview from './components/DashboardOverview';
import ClientsManagement from './components/ClientsManagement';
import ResourcesManagement from './components/ResourcesManagement';
import JobsManagement from './components/JobsManagement';
import ReportsAnalysis from './components/ReportsAnalysis';

import { defaultClients } from './mock/clients';
import { defaultMachinery } from './mock/machinery';
import { defaultOperators } from './mock/operators';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [clients, setClients] = useState(defaultClients);
  const [machinery, setMachinery] = useState(defaultMachinery);
  const [operators, setOperators] = useState(defaultOperators);
  const [jobs, setJobs] = useState([]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview jobs={jobs} />;
      case 'clients':
        return <ClientsManagement clients={clients} setClients={setClients} />;
      case 'machinery':
        return <ResourcesManagement machinery={machinery} setMachinery={setMachinery} operators={operators} setOperators={setOperators} />;
      case 'jobs':
        return <JobsManagement jobs={jobs} setJobs={setJobs} clients={clients} machinery={machinery} operators={operators} />;
      case 'reports':
        return <ReportsAnalysis jobs={jobs} clients={clients} />;
      default:
        return <DashboardOverview jobs={jobs} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <LayoutHeader currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="p-6">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;