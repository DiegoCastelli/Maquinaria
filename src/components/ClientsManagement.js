import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // ajustá el path si es necesario

const ClientsManagement = ({ clients, setClients }) => {
  const [newClient, setNewClient] = useState({ name: '', type: 'Física'});
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });
  const [selectedClientForLocation, setSelectedClientForLocation] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

useEffect(() => {
  const fetchClients = async () => {
    const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
    const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');

    if (clientsError) {
      console.error('Error al cargar clientes:', clientsError.message);
      return;
    }

    if (locationsError) {
      console.error('Error al cargar ubicaciones:', locationsError.message);
      return;
    }

    const enrichedClients = clientsData.map((client) => ({
      ...client,
      locations: locationsData.filter(loc => loc.client_id === client.id)
    }));

    setClients(enrichedClients);
  };

  fetchClients();
}, []);
//comentario

 const handleAddClient = async () => {
  if (newClient.name.trim()) {
    const { data, error } = await supabase.from('clients').insert([{
      name: newClient.name,
      type: newClient.type
    }]).select().single(); // Esto devuelve un solo objeto, no un array

    if (error) {
      alert('Error al guardar el cliente: ' + error.message);
    } else {
      setClients([...clients, data]); // ✅ solo agregás el objeto nuevo
      setNewClient({ name: '', type: 'Física' });
    }
  }
};



  const handleUpdateClient = async () => {
    setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
    setEditingClient(null);
  };

  const handleDeleteClient = async (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

 const handleAddLocation = async () => {
  if (newLocation.name.trim() && newLocation.address.trim() && selectedClientForLocation) {
    const { data, error } = await supabase.from('locations').insert([{
      name: newLocation.name,
      address: newLocation.address,
      client_id: selectedClientForLocation.id,
    }]);

    if (error) {
      alert('Error al guardar la ubicación: ' + error.message);
    } else {
      alert('Ubicación guardada correctamente');
      setNewLocation({ name: '', address: '' });
      setSelectedClientForLocation(null);
    }
  }
};


  const handleGetGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNewLocation({
            ...newLocation,
            address: `Lat: ${latitude}, Lon: ${longitude} (Ubicación actual)`,
            name: newLocation.name || 'Ubicación GPS',
          });
        },
        (error) => {
          alert(`Error al obtener la ubicación: ${error.message}`);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Clientes</h2>

      {/* Formulario de agregar/editar cliente */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          {editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
        </h3>
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={editingClient ? editingClient.name : newClient.name}
          onChange={(e) => editingClient
            ? setEditingClient({ ...editingClient, name: e.target.value })
            : setNewClient({ ...newClient, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
        />
        <select
          value={editingClient ? editingClient.type : newClient.type}
          onChange={(e) => editingClient
            ? setEditingClient({ ...editingClient, type: e.target.value })
            : setNewClient({ ...newClient, type: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-4"
        >
          <option value="Física">Persona Física</option>
          <option value="Empresa">Empresa</option>
        </select>
        {editingClient ? (
          <button
            onClick={handleUpdateClient}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Actualizar Cliente
          </button>
        ) : (
          <button
            onClick={handleAddClient}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Agregar Cliente
          </button>
        )}
        {editingClient && (
          <button
            onClick={() => setEditingClient(null)}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Lista de clientes */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Clientes Registrados</h3>
        {clients.length === 0 ? (
          <p className="text-gray-500">No hay clientes registrados.</p>
        ) : (
          <ul className="space-y-4">
            {clients.map((client) => (
              <li key={client.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-bold text-lg text-gray-900">{client.name} ({client.type})</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setSelectedClientForLocation(client)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                    >
                      Agregar Ubicación
                    </button>
                  </div>
                </div>
                {(Array.isArray(client.locations) && client.locations.length > 0) && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <p className="font-medium text-gray-700 mb-2">Ubicaciones:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {client.locations.map((loc) => (
                        <li key={loc.id}>{loc.name} - {loc.address}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulario de agregar ubicación */}
      {selectedClientForLocation && (
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-medium text-gray-700 mb-4">
            Agregar Ubicación para {selectedClientForLocation.name}
          </h3>
          <input
            type="text"
            placeholder="Nombre de la Ubicación"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-3"
          />
          <textarea
            placeholder="Dirección de la Ubicación"
            value={newLocation.address}
            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition mb-4 resize-none"
          ></textarea>
          <button
            onClick={handleGetGeolocation}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mb-3 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Obtener Ubicación Actual
          </button>
          <button
            onClick={handleAddLocation}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Guardar Ubicación
          </button>
          <button
            onClick={() => setSelectedClientForLocation(null)}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientsManagement;
