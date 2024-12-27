// src/components/Header.js
import { Button } from './Button';
import { Input } from './Input';
import { Search } from 'lucide-react';

export default function Header() {
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
          <a href="/login" className="text-gray-600 hover:text-gray-800">Iniciar sesión</a>
          <Button variant="ghost">Mi Perfil</Button>
        </div>
      </div>
    </header>
  );
}
