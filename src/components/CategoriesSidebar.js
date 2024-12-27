import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { ChevronDown } from 'lucide-react';

export function CategoriesSidebar() {
  return (
    <div className="w-64 pl-6 border-l">
      <div className="space-y-6">
        
        {/* Medios de Pago - Collapsible */}
        <Collapsible>
          <CollapsibleTrigger className="font-semibold mb-2 flex items-center gap-2">
            Medios de pago
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-2">
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Pago Online</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Tarjeta</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Ticket</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        {/* Categorías - Collapsible */}
        <Collapsible>
          <CollapsibleTrigger className="font-semibold mb-2 flex items-center gap-2">
            Categorías
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-2">
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Pollo</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Carnes</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Comida Mexicana</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Cafetería</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Postres</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Hamburguesas</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Pizzas</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Pescados y Mariscos</li>
              <li className="cursor-pointer text-gray-700 hover:text-blue-600">Comida Internacional</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
        
      </div>
    </div>
  );
}
