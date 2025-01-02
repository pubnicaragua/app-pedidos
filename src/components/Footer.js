export default function Footer() {
    return (
      <footer className="bg-[#E31C58] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Quiénes somos</a></li>
                <li><a href="#" className="hover:underline">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:underline">Privacidad</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Sé parte de AppPedidos</a></li>
              </ul>
            </div>
  
            {/* Column 2 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Descubre</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Top comidas</a></li>
                <li><a href="#" className="hover:underline">Top cadenas</a></li>
                <li><a href="#" className="hover:underline">Top ciudades</a></li>
              </ul>
            </div>
  
            {/* Column 3 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Socios</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Registra tu negocio</a></li>
                <li><a href="#" className="hover:underline">Centro de Socios</a></li>
              </ul>
            </div>
  
            {/* Column 4 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Corporativo</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    PedidosYa para tus colaboradores
                  </a>
                </li>
              </ul>
            </div>
          </div>
  
          <div className="mt-12 pt-8 border-t border-pink-500">
            <p className="text-sm text-center">
              PedidosYa © 2010-{new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    )
  }
  
  