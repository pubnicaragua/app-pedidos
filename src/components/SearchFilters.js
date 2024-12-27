import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from 'lucide-react';

export function SearchFilters() {
  return (
    <div className="w-64 pr-6">
      <div className="space-y-6">
        
        {/* Ordenar (Ahora colapsable) */}
        <Collapsible>
          <CollapsibleTrigger className="font-semibold mb-2 flex items-center gap-2">
            Ordenar
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <ul className="space-y-2">
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Sugeridos</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Mejor puntuados</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Más cercanos</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Más rápidos</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        {/* Filtros colapsables */}
        <Collapsible>
          <CollapsibleTrigger className="font-semibold flex items-center gap-2">
            Filtros
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <ul className="space-y-2">
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Entrega por PedidosYa</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Retiro en local</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        {/* Promociones colapsables */}
        <Collapsible>
          <CollapsibleTrigger className="font-semibold flex items-center gap-2">
            Promociones
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <ul className="space-y-2">
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Descuentos</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Beneficios Plus</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Acepta cupones</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Envío gratis</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Favoritos</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
        
      </div>
    </div>
  );
}
