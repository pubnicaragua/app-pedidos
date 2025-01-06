import { useState } from 'react'
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"

export function AddToCartModal({ isOpen, onClose, product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setQuantity(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar al carrito</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 my-4">
          <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="text-sm font-medium">
            Cantidad:
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            className="w-20"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddToCart}>
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

