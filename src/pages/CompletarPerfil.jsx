import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../api/supabase';

export default function CompletarPerfil() {
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleAssigned, setRoleAssigned] = useState(false);  // Estado para evitar bucles
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  // Función para obtener los roles desde Supabase
  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);  // Activar el spinner mientras obtenemos los roles
      const { data, error } = await supabase.from('roles').select('id, nombre');
      setLoading(false);  // Detener el spinner cuando se termina de obtener los roles

      if (error) {
        console.error('Error al obtener roles:', error);
        setMessage('Hubo un error al cargar los roles.');
      } else {
        setRoles(data);  // Establece los roles disponibles
      }
    }

    // Verifica si ya existe un rol asignado al usuario
    const checkRoleAssigned = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error al obtener el usuario:', error);
        return;
      }

      if (user) {
        // Verifica si el usuario ya tiene un rol asignado
        const { data: roleData, error: roleError } = await supabase
          .from('roles_usuarios')
          .select('rol_id')
          .eq('user_id', user.id)
          .single();

        if (roleData && roleData.rol_id) {
          // Si ya tiene rol asignado, redirige a la página correspondiente
          setRoleAssigned(true);  // Establecer como "rol asignado"
          navigate(`/usuarios/crear`);  // Redirige a la página de perfil de usuario
        }
      }
    };

    fetchRoles();
    checkRoleAssigned();  // Verificar si el usuario ya tiene rol al cargar la página
  }, [navigate]);

  // Función para manejar el cambio de rol
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Función para manejar el cambio de nombre
  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  // Función para manejar el cambio de teléfono
  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  // Función para completar el perfil
  const handleCompleteProfile = async () => {
    if (!role || !nombre || !telefono) {
      setMessage('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);  // Inicia el spinner de carga

    // Obtener el usuario autenticado
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error al obtener el usuario:', error);
      setMessage('Hubo un error al obtener el usuario.');
      setLoading(false);  // Detener el spinner
      return;
    }

    if (!user) {
      setMessage('Debes estar autenticado para completar tu perfil.');
      setLoading(false);  // Detener el spinner
      return;
    }

    // Actualizar los datos del perfil en auth.users (nombre y teléfono)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: nombre,
        phone: telefono,
      },
    });

    if (updateError) {
      console.error('Error al actualizar el perfil:', updateError);
      setMessage('Hubo un error al actualizar tu perfil.');
      setLoading(false);  // Detener el spinner
      return;
    }

    // Guardar el rol en la tabla roles_usuarios
    const { error: insertError } = await supabase
      .from('roles_usuarios')
      .insert([{
        rol_id: role,
        user_id: user.id,
      }]);

    if (insertError) {
      console.error('Error al guardar el rol:', insertError);
      setMessage('Hubo un error al guardar el rol.');
      setLoading(false);  // Detener el spinner
    } else {
      // Verificar el rol asignado
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id, nombre')
        .eq('id', role)
        .single();

      if (roleError) {
        console.error('Error al obtener el rol:', roleError);
        setMessage('Hubo un error al obtener el rol.');
        setLoading(false);  // Detener el spinner
      } else {
        // Redirigir según el rol
        if (roleData && roleData.id === 2) {
          navigate('/usuarios/crear');  // Redirige a /usuarios/crear si el rol es Cliente
        } else if (roleData && roleData.id === 3) {
          navigate('/tienda/crear');  // Redirige a /tienda/crear si el rol es Vendedor
        } else {
          setMessage(`Rol asignado: ${roleData.nombre}`);
        }

        // Recargar la página para actualizar el estado
        window.location.reload(); // Recargar la página para reflejar los cambios

        setLoading(false);  // Detener el spinner después de la redirección
      }
    }
  };

  // Si el rol ya ha sido asignado, no mostrar el formulario de selección
  if (roleAssigned) {
    return null;  // O puedes mostrar un mensaje indicando que ya tienes un rol
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Completa tu perfil</h2>

        {message && (
          <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
            {message}
          </div>
        )}

        <div>
          <label htmlFor="nombre" className="block mb-2">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={handleNombreChange}
            className="p-2 border rounded w-full mb-4"
            placeholder="Ingresa tu nombre"
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block mb-2">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            value={telefono}
            onChange={handleTelefonoChange}
            className="p-2 border rounded w-full mb-4"
            placeholder="Ingresa tu teléfono"
          />
        </div>

        <div>
          <label htmlFor="role" className="block mb-2">Selecciona tu rol:</label>
          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            className="p-2 border rounded w-full mb-4"
          >
            <option value="">Selecciona un rol</option>
            {roles.map((roleItem) => (
              <option key={roleItem.id} value={roleItem.id}>
                {roleItem.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompleteProfile}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Completar perfil
        </button>

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-8 h-8"></div>
          </div>
        )}
      </div>
    </div>
  );
}
