import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'


import supabase from '../api/supabase';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Obtener el usuario y su rol
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error al obtener el usuario:', error);
      } else {
        setUser(data.user);
        if (data.user) {
          const { data: roleData, error: roleError } = await supabase
            .from('roles_usuarios')
            .select('rol_id')
            .eq('user_id', data.user.id)
            .single();
          if (roleError) {
            console.error('Error al obtener el rol:', roleError);
          } else {
            setRole(roleData?.rol_id);
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Manejar el clic en el perfil
  const handleProfileClick = () => {
    if (loading) return;

    if (!user) {
      navigate('/register');
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
    setUser(null);
    setRole(null);
    navigate('/');
  };

  // Manejar el término de búsqueda
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/">
            <img src={logo} alt="AppPedidos Logo" className="h-12 w-auto" />
          </Link>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Elementos que solo se muestran en dispositivos grandes */}
          <div className="hidden md:flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Enviar a</span>
              <div className="flex items-center gap-1 hover:cursor-pointer">
                <button className="text-sm font-medium text-blue-600 bg-transparent border-0 hover:text-blue-800 focus:outline-none">
                  Lima
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 4 9 7 12 3-3 7-8.134 7-12 0-3.866-3.134-7-7-7z"></path>
                  <circle cx="12" cy="9" r="3"></circle>
                </svg>
              </div>
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Buscar tiendas"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {/* SVG icon for search */}
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={handleSearch}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
          </div>

          {/* Menú de perfil y logout (escondido en móviles) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button
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
              <a href="/login" className="text-gray-600 hover:text-gray-800">
                Iniciar sesión
              </a>
            )}
          </div>
        </div>

        {/* Menú móvil (visible cuando se hace clic en el icono de hamburguesa) */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {/* Enviar a */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Enviar a</span>
              <div className="flex items-center gap-1 hover:cursor-pointer">
                <button className="text-sm font-medium text-blue-600 bg-transparent border-0 hover:text-blue-800 focus:outline-none">
                  Lima
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 4 9 7 12 3-3 7-8.134 7-12 0-3.866-3.134-7-7-7z"></path>
                  <circle cx="12" cy="9" r="3"></circle>
                </svg>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar tiendas"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={handleSearch}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {/* Perfil o inicio de sesión */}
            {user ? (
              <>
                <button
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
              <a href="/login" className="text-gray-600 hover:text-gray-800">
                Iniciar sesión
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
