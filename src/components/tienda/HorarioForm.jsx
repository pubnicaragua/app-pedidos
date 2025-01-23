import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

export default function HorarioForm({ horarios, onHorarioChange }) {
  const handleChange = (index, field, value) => {
    onHorarioChange(index, field, value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Horario de Atención</h3>
      {horarios.map((horario, index) => (
        <div key={horario.dia} className="flex items-center space-x-4">
          <Checkbox
            id={`active-${horario.dia}`}
            checked={horario.activo}
            onCheckedChange={(checked) => handleChange(index, 'activo', checked)}
          />
          <Label htmlFor={`active-${horario.dia}`} className="w-24 font-medium">
            {horario.dia}
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              type="time"
              value={horario.apertura}
              onChange={(e) => handleChange(index, 'apertura', e.target.value)}
              disabled={!horario.activo}
              className="w-32"
            />
            <span>a</span>
            <Input
              type="time"
              value={horario.cierre}
              onChange={(e) => handleChange(index, 'cierre', e.target.value)}
              disabled={!horario.activo}
              className="w-32"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

HorarioForm.propTypes = {
  horarios: PropTypes.arrayOf(PropTypes.shape({
    dia: PropTypes.string.isRequired,
    apertura: PropTypes.string.isRequired,
    cierre: PropTypes.string.isRequired,
    activo: PropTypes.bool.isRequired,
  })).isRequired,
  onHorarioChange: PropTypes.func.isRequired,
};
