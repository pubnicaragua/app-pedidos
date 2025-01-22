import React from 'react';

export default function HorarioForm({ horarios, onHorarioChange }) {
  const handleChange = (index, field, value) => {
    onHorarioChange(index, field, value);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700">Horario de Atención</h3>
      {horarios.map((horario, index) => (
        <div key={horario.dia} className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={horario.activo}
            onChange={(e) => handleChange(index, 'activo', e.target.checked)}
          />
          <span className="w-24">{horario.dia}</span>
          <input
            type="time"
            value={horario.apertura}
            onChange={(e) => handleChange(index, 'apertura', e.target.value)}
            disabled={!horario.activo}
            className="p-1 border border-gray-300 rounded"
          />
          <span>a</span>
          <input
            type="time"
            value={horario.cierre}
            onChange={(e) => handleChange(index, 'cierre', e.target.value)}
            disabled={!horario.activo}
            className="p-1 border border-gray-300 rounded"
          />
        </div>
      ))}
    </div>
  );
}
