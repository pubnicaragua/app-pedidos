import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '../api/supabase';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Obtener el usuario y su rol
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Asegúrate de establecer el estado de carga al inicio
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error al obtener el usuario:', error);
      } else {
        setUser(data.user); // Guardamos el usuario
        if (data.user) {
          const { data: roleData, error: roleError } = await supabase
            .from('roles_usuarios')
            .select('rol_id')
            .eq('user_id', data.user.id)
            .single();
          if (roleError) {
            console.error('Error al obtener el rol:', roleError);
          } else {
            setRole(roleData?.rol_id); // Establece el rol
          }
        }
      }
      setLoading(false); // Marca como cargado después de obtener los datos
    };

    fetchUser();
  }, []);

  // Manejar el clic en el perfil
  const handleProfileClick = () => {
    if (loading) return; // Evita que se ejecute la lógica de redirección mientras se carga

    // Verificamos si el usuario está disponible y si tiene un rol asignado
    if (!user) {
      navigate('/login');
    } else if (!role) {
      navigate('/completar-perfil');
    } else if (role === 2) {
      navigate('/usuarios/perfil');
    } else if (role === 3) {
      navigate('/tienda/perfil');
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Limpiamos el estado del usuario
    setRole(null); // Limpiamos el estado del rol
    navigate('/'); // Redirigimos a la página principal o home
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-pink-600">PedidosFast</div>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Enviar a</span>
              <Button variant="ghost">Managua</Button>
            </div>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar locales"
                  className="w-full pl-4 pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </div>
          
          {/* Condicionalmente mostrar "Iniciar sesión" o "Cerrar sesión" */}
          {user ? (
            <>
              <button
                variant="ghost"
                onClick={handleProfileClick}
                className="text-gray-600 hover:text-gray-800"
              >
                Mi Perfil
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-gray-600 hover:text-gray-800"
            >
              Iniciar sesión
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
