import React, { useState } from 'react';

const ResourcesManagement = ({ machinery, setMachinery, operators, setOperators }) => {
  const [newMachine, setNewMachine] = useState({ name: '', hourlyRate: '', active: true });
  const [newOperator, setNewOperator] = useState({ name: '', hourlyRate: '', active: true });
  const [editingMachine, setEditingMachine] = useState(null);
  const [editingOperator, setEditingOperator] = useState(null);

  const handleAddMachine = () => {
    if (newMachine.name.trim() && newMachine.hourlyRate > 0) {
      setMachinery([...machinery, { ...newMachine, id: `m${Date.now()}`, hourlyRate: parseFloat(newMachine.hourlyRate) }]);
      setNewMachine({ name: '', hourlyRate: '', active: true });
    }
  };

  const handleUpdateMachine = () => {
    setMachinery(machinery.map(m => m.id === editingMachine.id ? { ...editingMachine, hourlyRate: parseFloat(editingMachine.hourlyRate) } : m));
    setEditingMachine(null);
  };

  const handleDeleteMachine = (id) => {
    setMachinery(machinery.filter(machine => machine.id !== id));
  };

  const handleToggleMachineStatus = (id) => {
    setMachinery(machinery.map(machine =>
      machine.id === id ? { ...machine, active: !machine.active } : machine
    ));
  };

  const handleAddOperator = () => {
    if (newOperator.name.trim() && newOperator.hourlyRate > 0) {
      setOperators([...operators, { ...newOperator, id: `op${Date.now()}`, hourlyRate: parseFloat(newOperator.hourlyRate) }]);
      setNewOperator({ name: '', hourlyRate: '', active: true });
    }
  };

  const handleUpdateOperator = () => {
    setOperators(operators.map(op => op.id === editingOperator.id ? { ...editingOperator, hourlyRate: parseFloat(editingOperator.hourlyRate) } : op));
    setEditingOperator(null);
  };

  const handleDeleteOperator = (id) => {
    setOperators(operators.filter(operator => operator.id !== id));
  };

  const handleToggleOperatorStatus = (id) => {
    setOperators(operators.map(operator =>
      operator.id === id ? { ...operator, active: !operator.active } : operator
    ));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Maquinaria y Operarios</h2>

      {/* Add/Edit Machine Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          {editingMachine ? 'Editar Maquinaria' : 'Agregar Nueva Maquinaria'}
        </h3>
        <input
          type="text"
          placeholder="Nombre de la Maquinaria"
          value={editingMachine ? editingMachine.name : newMachine.name}
          onChange={(e) => editingMachine ? setEditingMachine({ ...editingMachine, name: e.target.value }) : setNewMachine({ ...newMachine, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        />
        <input
          type="number"
          placeholder="Tarifa por Hora"
          value={editingMachine ? editingMachine.hourlyRate : newMachine.hourlyRate}
          onChange={(e) => editingMachine ? setEditingMachine({ ...editingMachine, hourlyRate: e.target.value }) : setNewMachine({ ...newMachine, hourlyRate: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={editingMachine ? editingMachine.active : newMachine.active}
            onChange={(e) => editingMachine ? setEditingMachine({ ...editingMachine, active: e.target.checked }) : setNewMachine({ ...newMachine, active: e.target.checked })}
            className="form-checkbox h-5 w-5 text-black rounded"
          />
          <span className="ml-2 text-gray-700">Activo</span>
        </label>
        {editingMachine ? (
          <button
            onClick={handleUpdateMachine}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Actualizar Maquinaria
          </button>
        ) : (
          <button
            onClick={handleAddMachine}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Agregar Maquinaria
          </button>
        )}
        {editingMachine && (
          <button
            onClick={() => setEditingMachine(null)}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Machine List */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Maquinaria Registrada</h3>
        {machinery.length === 0 ? (
          <p className="text-gray-500">No hay maquinaria registrada.</p>
        ) : (
          <ul className="space-y-4">
            {machinery.map((machine) => (
              <li key={machine.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-900">{machine.name}</p>
                  <p className="text-sm text-gray-600">Tarifa: ${machine.hourlyRate}/hr</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${machine.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {machine.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMachine(machine)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleMachineStatus(machine.id)}
                    className={`px-3 py-1 rounded-md transition-colors text-sm ${machine.active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    {machine.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDeleteMachine(machine.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Operator Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          {editingOperator ? 'Editar Operario' : 'Agregar Nuevo Operario'}
        </h3>
        <input
          type="text"
          placeholder="Nombre del Operario"
          value={editingOperator ? editingOperator.name : newOperator.name}
          onChange={(e) => editingOperator ? setEditingOperator({ ...editingOperator, name: e.target.value }) : setNewOperator({ ...newOperator, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        />
        <input
          type="number"
          placeholder="Tarifa por Hora"
          value={editingOperator ? editingOperator.hourlyRate : newOperator.hourlyRate}
          onChange={(e) => editingOperator ? setEditingOperator({ ...editingOperator, hourlyRate: e.target.value }) : setNewOperator({ ...newOperator, hourlyRate: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={editingOperator ? editingOperator.active : newOperator.active}
            onChange={(e) => editingOperator ? setEditingOperator({ ...editingOperator, active: e.target.checked }) : setNewOperator({ ...newOperator, active: e.target.checked })}
            className="form-checkbox h-5 w-5 text-black rounded"
          />
          <span className="ml-2 text-gray-700">Activo</span>
        </label>
        {editingOperator ? (
          <button
            onClick={handleUpdateOperator}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Actualizar Operario
          </button>
        ) : (
          <button
            onClick={handleAddOperator}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Agregar Operario
          </button>
        )}
        {editingOperator && (
          <button
            onClick={() => setEditingOperator(null)}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Operator List */}
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4">Operarios Registrados</h3>
        {operators.length === 0 ? (
          <p className="text-gray-500">No hay operarios registrados.</p>
        ) : (
          <ul className="space-y-4">
            {operators.map((operator) => (
              <li key={operator.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-900">{operator.name}</p>
                  <p className="text-sm text-gray-600">Tarifa: ${operator.hourlyRate}/hr</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${operator.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {operator.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingOperator(operator)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleOperatorStatus(operator.id)}
                    className={`px-3 py-1 rounded-md transition-colors text-sm ${operator.active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    {operator.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDeleteOperator(operator.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResourcesManagement;