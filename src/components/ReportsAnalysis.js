import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

const ReportsAnalysis = ({ jobs, clients }) => {
  const [reportType, setReportType] = useState('summary');
  const [filterClient, setFilterClient] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const filteredJobs = jobs.filter(job => {
    const jobStartDate = new Date(job.startDate);
    const jobEndDate = new Date(job.endDate);
    const startFilter = filterStartDate ? new Date(filterStartDate) : null;
    const endFilter = filterEndDate ? new Date(filterEndDate) : null;

    const clientMatch = filterClient ? job.clientId === filterClient : true;
    const dateMatch = (!startFilter || jobEndDate >= startFilter) && (!endFilter || jobStartDate <= endFilter);

    return clientMatch && dateMatch;
  });

  const generateSummaryReport = () => {
    const totalRevenue = filteredJobs.reduce((sum, job) => sum + job.totalCharged, 0);
    const totalCosts = filteredJobs.reduce((sum, job) => sum + job.totalCost, 0);
    const netProfit = totalRevenue - totalCosts;

    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Resumen de Rentabilidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">Costos Operativos</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCosts)}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">Ganancia Neta</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(netProfit)}</p>
          </div>
        </div>
      </div>
    );
  };

  const generateDetailedReport = () => {
    if (filteredJobs.length === 0) {
      return <p className="text-gray-500">No hay trabajos que coincidan con los filtros.</p>;
    }
    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Detalle de Trabajos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Descripción</th>
                <th className="py-3 px-6">Cliente</th>
                <th className="py-3 px-6">Ubicación</th>
                <th className="py-3 px-6">Fechas</th>
                <th className="py-3 px-6">Cobrado</th>
                <th className="py-3 px-6">Costo</th>
                <th className="py-3 px-6">Ganancia</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredJobs.map(job => (
                <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{job.description}</td>
                  <td className="py-3 px-6">{job.clientName}</td>
                  <td className="py-3 px-6">{job.locationName}</td>
                  <td className="py-3 px-6">{formatDate(job.startDate)} - {formatDate(job.endDate)}</td>
                  <td className="py-3 px-6">{formatCurrency(job.totalCharged)}</td>
                  <td className="py-3 px-6">{formatCurrency(job.totalCost)}</td>
                  <td className="py-3 px-6 font-semibold">{formatCurrency(job.totalCharged - job.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const generateWhatsAppSummary = () => {
    const totalRevenue = filteredJobs.reduce((sum, job) => sum + job.totalCharged, 0);
    const totalCosts = filteredJobs.reduce((sum, job) => sum + job.totalCost, 0);
    const netProfit = totalRevenue - totalCosts;

    let message = `*Resumen de Trabajos Agrícolas*\n\n`;
    message += `*Periodo:* ${filterStartDate ? formatDate(filterStartDate) : 'Inicio'} - ${filterEndDate ? formatDate(filterEndDate) : 'Fin'}\n`;
    if (filterClient) {
      message += `*Cliente:* ${clients.find(c => c.id === filterClient)?.name}\n`;
    }
    message += `\n*Ingresos Totales:* ${formatCurrency(totalRevenue)}\n`;
    message += `*Costos Operativos:* ${formatCurrency(totalCosts)}\n`;
    message += `*Ganancia Neta:* ${formatCurrency(netProfit)}\n\n`;
    message += `_Detalle de Trabajos:_\n`;
    filteredJobs.forEach(job => {
      message += `- ${job.description} (${job.clientName}): ${formatCurrency(job.totalCharged - job.totalCost)}\n`;
    });
    message += `\n¡Consulta el sistema para más detalles!`;

    return message;
  };

  const handleDownloadPDF = () => {
    alert('Generando PDF... (Funcionalidad de descarga de PDF no implementada en este demo)');
  };

  const handleDownloadExcel = () => {
    alert('Generando Excel... (Funcionalidad de descarga de Excel no implementada en este demo)');
  };

  const handleSendWhatsApp = () => {
    const whatsappMessage = encodeURIComponent(generateWhatsAppSummary());
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reportes y Análisis</h2>

      {/* Filters */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Filtros de Reporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Todos los Clientes</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setReportType('summary')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              reportType === 'summary' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setReportType('detailed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              reportType === 'detailed' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Detallado
          </button>
        </div>
      </div>

      {/* Report Display */}
      <div className="mb-8">
        {reportType === 'summary' ? generateSummaryReport() : generateDetailedReport()}
      </div>

      {/* Export Options */}
      <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <h3 className="text-xl font-medium text-gray-700">Opciones de Exportación</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h10V8.414L12.414 4H6z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12 7a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Descargar PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h10V8.414L12.414 4H6z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 12a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-3 0a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Descargar Excel
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.304 2.304A10 10 0 002.304 17.304L0 20l2.696-2.696A10 10 0 0017.304 2.304zM10 18a8 8 0 100-16 8 8 0 000 16zM14.5 9.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1z" />
            </svg>
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalysis;