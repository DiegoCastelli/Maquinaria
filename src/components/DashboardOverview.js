import React from 'react';
import { formatCurrency } from '../utils/formatters';

const DashboardOverview = ({ jobs }) => {
  const totalRevenue = jobs.reduce((sum, job) => sum + job.totalCharged, 0);
  const totalCosts = jobs.reduce((sum, job) => sum + job.totalCost, 0);
  const netProfit = totalRevenue - totalCosts;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumen General</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Costos Operativos</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalCosts)}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Ganancia Neta</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(netProfit)}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Trabajos</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No hay trabajos registrados aún.</p>
        ) : (
          <ul className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <li key={job.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{job.description}</p>
                  <p className="text-sm text-gray-500">{job.clientName} - {job.locationName}</p>
                </div>
                <p className="font-bold text-lg text-gray-700">{formatCurrency(job.totalCharged)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;