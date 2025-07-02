import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { defaultExpenseCategories } from '../mock/expenses';

const JobsManagement = ({ jobs, setJobs, clients, machinery, operators }) => {
  const [currentJob, setCurrentJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);

  const initialJobState = {
    id: '',
    description: '',
    clientId: '',
    locationId: '',
    startDate: '',
    endDate: '',
    assignedMachinery: [],
    assignedOperators: [],
    expenses: [],
    totalCharged: 0,
    totalCost: 0,
    status: 'Pendiente',
  };

  const [jobForm, setJobForm] = useState(initialJobState);
  const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: '' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };

  const handleAddJob = () => {
    if (!jobForm.description || !jobForm.clientId || !jobForm.locationId || !jobForm.startDate || !jobForm.endDate) {
      alert('Por favor, completa todos los campos obligatorios del trabajo.');
      return;
    }

    const newJob = {
      ...jobForm,
      id: `job${Date.now()}`,
      totalCost: calculateTotalCost(jobForm),
      clientName: clients.find(c => c.id === jobForm.clientId)?.name,
      locationName: clients.find(c => c.id === jobForm.clientId)?.locations.find(l => l.id === jobForm.locationId)?.name,
    };
    setJobs([...jobs, newJob]);
    setJobForm(initialJobState);
    setNewExpense({ category: '', description: '', amount: '' });
  };

  const handleUpdateJob = () => {
    if (!jobForm.description || !jobForm.clientId || !jobForm.locationId || !jobForm.startDate || !jobForm.endDate) {
      alert('Por favor, completa todos los campos obligatorios del trabajo.');
      return;
    }

    const updatedJob = {
      ...jobForm,
      totalCost: calculateTotalCost(jobForm),
      clientName: clients.find(c => c.id === jobForm.clientId)?.name,
      locationName: clients.find(c => c.id === jobForm.clientId)?.locations.find(l => l.id === jobForm.locationId)?.name,
    };
    setJobs(jobs.map(job => (job.id === updatedJob.id ? updatedJob : job)));
    setJobForm(initialJobState);
    setIsEditing(false);
    setShowJobDetail(false);
    setCurrentJob(null);
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
    if (currentJob && currentJob.id === id) {
      setShowJobDetail(false);
      setCurrentJob(null);
    }
  };

  const handleEditJob = (job) => {
    setJobForm({ ...job });
    setIsEditing(true);
    setShowJobDetail(false);
    setCurrentJob(null);
  };

  const handleViewJob = (job) => {
    setCurrentJob(job);
    setShowJobDetail(true);
  };

  const handleAddAssignedMachinery = (machineId) => {
    const machine = machinery.find(m => m.id === machineId);
    if (machine && !jobForm.assignedMachinery.some(am => am.id === machineId)) {
      setJobForm({
        ...jobForm,
        assignedMachinery: [...jobForm.assignedMachinery, { ...machine, hours: 0 }],
      });
    }
  };

  const handleUpdateMachineryHours = (id, hours) => {
    setJobForm({
      ...jobForm,
      assignedMachinery: jobForm.assignedMachinery.map(m =>
        m.id === id ? { ...m, hours: parseFloat(hours) } : m
      ),
    });
  };

  const handleRemoveAssignedMachinery = (id) => {
    setJobForm({
      ...jobForm,
      assignedMachinery: jobForm.assignedMachinery.filter(m => m.id !== id),
    });
  };

  const handleAddAssignedOperator = (operatorId) => {
    const operator = operators.find(op => op.id === operatorId);
    if (operator && !jobForm.assignedOperators.some(ao => ao.id === operatorId)) {
      setJobForm({
        ...jobForm,
        assignedOperators: [...jobForm.assignedOperators, { ...operator, hours: 0 }],
      });
    }
  };

  const handleUpdateOperatorHours = (id, hours) => {
    setJobForm({
      ...jobForm,
      assignedOperators: jobForm.assignedOperators.map(op =>
        op.id === id ? { ...op, hours: parseFloat(hours) } : op
      ),
    });
  };

  const handleRemoveAssignedOperator = (id) => {
    setJobForm({
      ...jobForm,
      assignedOperators: jobForm.assignedOperators.filter(op => op.id !== id),
    });
  };

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount > 0) {
      setJobForm({
        ...jobForm,
        expenses: [...jobForm.expenses, { ...newExpense, id: `exp${Date.now()}`, amount: parseFloat(newExpense.amount) }],
      });
      setNewExpense({ category: '', description: '', amount: '' });
    }
  };

  const handleRemoveExpense = (id) => {
    setJobForm({
      ...jobForm,
      expenses: jobForm.expenses.filter(exp => exp.id !== id),
    });
  };

  const calculateTotalCost = (job) => {
    const machineryCost = job.assignedMachinery.reduce((sum, m) => sum + (m.hourlyRate * m.hours), 0);
    const operatorCost = job.assignedOperators.reduce((sum, op) => sum + (op.hourlyRate * op.hours), 0);
    const expenseCost = job.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return machineryCost + operatorCost + expenseCost;
  };

  const handleFinalizeCosts = () => {
    setJobForm({ ...jobForm, totalCost: calculateTotalCost(jobForm) });
    alert('Costos actualizados y finalizados.');
  };

  const getClientLocations = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.locations : [];
  };

  if (showJobDetail && currentJob) {
    const netProfit = currentJob.totalCharged - currentJob.totalCost;
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalle del Trabajo: {currentJob.description}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p><strong>Cliente:</strong> {currentJob.clientName}</p>
          <p><strong>Ubicación:</strong> {currentJob.locationName}</p>
          <p><strong>Fechas:</strong> {formatDate(currentJob.startDate)} - {formatDate(currentJob.endDate)}</p>
          <p><strong>Estado:</strong> {currentJob.status}</p>
          <p><strong>Total Cobrado:</strong> {formatCurrency(currentJob.totalCharged)}</p>
          <p><strong>Costo Total:</strong> {formatCurrency(currentJob.totalCost)}</p>
          <p><strong>Ganancia Neta:</strong> {formatCurrency(netProfit)}</p>
        </div>

        <h3 className="text-xl font-medium text-gray-700 mb-3">Maquinaria Asignada</h3>
        {currentJob.assignedMachinery.length === 0 ? (
          <p className="text-gray-500 mb-4">No hay maquinaria asignada.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {currentJob.assignedMachinery.map(m => (
              <li key={m.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <span>{m.name} ({m.hours} hrs)</span>
                <span>{formatCurrency(m.hourlyRate * m.hours)}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-xl font-medium text-gray-700 mb-3">Operarios Asignados</h3>
        {currentJob.assignedOperators.length === 0 ? (
          <p className="text-gray-500 mb-4">No hay operarios asignados.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {currentJob.assignedOperators.map(op => (
              <li key={op.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <span>{op.name} ({op.hours} hrs)</span>
                <span>{formatCurrency(op.hourlyRate * op.hours)}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-xl font-medium text-gray-700 mb-3">Gastos Adicionales</h3>
        {currentJob.expenses.length === 0 ? (
          <p className="text-gray-500 mb-4">No hay gastos adicionales.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {currentJob.expenses.map(exp => (
              <li key={exp.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <span>{exp.category}: {exp.description}</span>
                <span>{formatCurrency(exp.amount)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowJobDetail(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver a la Lista
          </button>
          <button
            onClick={() => handleEditJob(currentJob)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Editar Trabajo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Trabajos</h2>

      {/* Job Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          {isEditing ? 'Editar Trabajo' : 'Registrar Nuevo Trabajo'}
        </h3>
        <input
          type="text"
          name="description"
          placeholder="Descripción del Trabajo"
          value={jobForm.description}
          onChange={handleFormChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        />
        <select
          name="clientId"
          value={jobForm.clientId}
          onChange={handleFormChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        >
          <option value="">Selecciona Cliente</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        {jobForm.clientId && (
          <select
            name="locationId"
            value={jobForm.locationId}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
          >
            <option value="">Selecciona Ubicación</option>
            {getClientLocations(jobForm.clientId).map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="date"
            name="startDate"
            value={jobForm.startDate}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <input
            type="date"
            name="endDate"
            value={jobForm.endDate}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <input
          type="number"
          name="totalCharged"
          placeholder="Total a Cobrar"
          value={jobForm.totalCharged}
          onChange={handleFormChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-4"
        />

        {/* Assigned Machinery */}
        <h4 className="text-lg font-medium text-gray-700 mb-2">Asignar Maquinaria</h4>
        <select
          onChange={(e) => handleAddAssignedMachinery(e.target.value)}
          value=""
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        >
          <option value="">Añadir Maquinaria</option>
          {machinery.filter(m => m.active).map(m => (
            <option key={m.id} value={m.id}>{m.name} (${m.hourlyRate}/hr)</option>
          ))}
        </select>
        <ul className="space-y-2 mb-4">
          {jobForm.assignedMachinery.map(m => (
            <li key={m.id} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
              <span className="flex-grow">{m.name}</span>
              <input
                type="number"
                placeholder="Horas"
                value={m.hours}
                onChange={(e) => handleUpdateMachineryHours(m.id, e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded-lg"
              />
              <button onClick={() => handleRemoveAssignedMachinery(m.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Assigned Operators */}
        <h4 className="text-lg font-medium text-gray-700 mb-2">Asignar Operarios</h4>
        <select
          onChange={(e) => handleAddAssignedOperator(e.target.value)}
          value=""
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        >
          <option value="">Añadir Operario</option>
          {operators.filter(op => op.active).map(op => (
            <option key={op.id} value={op.id}>{op.name} (${op.hourlyRate}/hr)</option>
          ))}
        </select>
        <ul className="space-y-2 mb-4">
          {jobForm.assignedOperators.map(op => (
            <li key={op.id} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
              <span className="flex-grow">{op.name}</span>
              <input
                type="number"
                placeholder="Horas"
                value={op.hours}
                onChange={(e) => handleUpdateOperatorHours(op.id, e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded-lg"
              />
              <button onClick={() => handleRemoveAssignedOperator(op.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Expenses */}
        <h4 className="text-lg font-medium text-gray-700 mb-2">Gastos Adicionales</h4>
        <div className="flex space-x-2 mb-3">
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Categoría</option>
            {defaultExpenseCategories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
            <option value="Otro">Otro (Especificar)</option>
          </select>
          <input
            type="text"
            placeholder="Descripción"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <input
            type="number"
            placeholder="Monto"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <button onClick={handleAddExpense} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <ul className="space-y-2 mb-4">
          {jobForm.expenses.map(exp => (
            <li key={exp.id} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
              <span className="flex-grow">{exp.category}: {exp.description}</span>
              <span>{formatCurrency(exp.amount)}</span>
              <button onClick={() => handleRemoveExpense(exp.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-gray-800">Costo Estimado: {formatCurrency(calculateTotalCost(jobForm))}</p>
          <button
            onClick={handleFinalizeCosts}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Finalizar Costos
          </button>
        </div>

        {isEditing ? (
          <button
            onClick={handleUpdateJob}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Actualizar Trabajo
          </button>
        ) : (
          <button
            onClick={handleAddJob}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Registrar Trabajo
          </button>
        )}
        {isEditing && (
          <button
            onClick={() => { setJobForm(initialJobState); setIsEditing(false); }}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Job List */}
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4">Trabajos Registrados</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No hay trabajos registrados.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-bold text-lg text-gray-900">{job.description}</p>
                    <p className="text-sm text-gray-600">{job.clientName} - {job.locationName}</p>
                    <p className="text-sm text-gray-500">{formatDate(job.startDate)} - {formatDate(job.endDate)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewJob(job)}
                      className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                    >
                      Ver Detalle
                    </button>
                    <button
                      onClick={() => handleEditJob(job)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="mt-3 border-t border-gray-200 pt-3 flex justify-between items-center">
                  <p className="text-base font-semibold text-gray-800">Costo: {formatCurrency(job.totalCost)}</p>
                  <p className="text-base font-semibold text-gray-800">Cobrado: {formatCurrency(job.totalCharged)}</p>
                  <p className="text-base font-bold text-gray-900">Ganancia: {formatCurrency(job.totalCharged - job.totalCost)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobsManagement;