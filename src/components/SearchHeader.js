import { Button } from "../components/Button"
import { X } from 'lucide-react'

export function SearchHeader() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold text-pink-600">
              PedidosFast
            </a>
            <Button variant="ghost">Managua</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost">Mi Perfil</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
