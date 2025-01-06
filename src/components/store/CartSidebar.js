import { useState } from 'react'
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { X } from 'lucide-react'

export function CartSidebar({ cart, removeFromCart, updateCartItemQuantity }) {
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Carrito</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 mb-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItemQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                      className="w-16 h-8"
                    />
                    <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full">Realizar pedido</Button>
          </div>
        </div>
      </div>
      <button
        className={`fixed bottom-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        🛒 {totalItems}
      </button>
      {isOpen && (
        <button
          className="fixed top-4 right-64 bg-white p-2 rounded-full shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </>
  )
}

