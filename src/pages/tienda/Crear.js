import React, { useState, useEffect } from "react"
import supabase from "../../api/supabase"
import HorarioForm from "../../components/tienda/HorarioForm"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function Tienda() {
  const [user, setUser] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [formData, setFormData] = useState({
    nombre: "",
    logo: null,
    imagenFondo: null,
    categoriaId: "",
    latitud: "",
    longitud: "",
    aceptaTarjeta: null,
    horarios: [
      { dia: "lunes", apertura: "", cierre: "", activo: false },
      { dia: "martes", apertura: "", cierre: "", activo: false },
      { dia: "miércoles", apertura: "", cierre: "", activo: false },
      { dia: "jueves", apertura: "", cierre: "", activo: false },
      { dia: "viernes", apertura: "", cierre: "", activo: false },
      { dia: "sábado", apertura: "", cierre: "", activo: false },
      { dia: "domingo", apertura: "", cierre: "", activo: false },
    ],
  })

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.error("Error al obtener el usuario:", error)
      } else {
        setUser(user)
      }
    }

    fetchUser()

    const fetchCategorias = async () => {
      const { data, error } = await supabase.from("categoria_tienda").select("id, nombre")
      if (error) console.error("Error cargando categorías:", error)
      else setCategorias(data)
    }

    fetchCategorias()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString(),
          }))
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error)
          alert("No se pudo obtener la ubicación. Por favor, habilita el acceso a la ubicación.")
        },
      )
    } else {
      alert("La geolocalización no es compatible con este navegador.")
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...formData.horarios]
    newHorarios[index] = { ...newHorarios[index], [field]: value }
    setFormData((prev) => ({ ...prev, horarios: newHorarios }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert("Debes estar autenticado para registrar una tienda.")
      return
    }

    try {
      const { data: tiendaData, error: tiendaError } = await supabase
        .from("tienda")
        .insert({
          nombre: formData.nombre,
          logo: formData.logo,
          imagen_fondo: formData.imagenFondo,
          categoria_id: formData.categoriaId,
          latitud: Number.parseFloat(formData.latitud),
          longitud: Number.parseFloat(formData.longitud),
          propietario_id: user.id,
          acepta_tarjeta: formData.aceptaTarjeta,
        })
        .select()

      if (tiendaError) throw tiendaError

      alert("Tienda registrada exitosamente.")
    } catch (error) {
      console.error("Error al registrar la tienda:", error)
      alert("Ocurrió un error al registrar la tienda.")
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Registrar Tienda</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la tienda</Label>
            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoriaId">Categoría</Label>
            <Select
              name="categoriaId"
              value={formData.categoriaId}
              onValueChange={(value) => handleInputChange({ target: { name: "categoriaId", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="latitud">Latitud</Label>
            <Input id="latitud" name="latitud" value={formData.latitud} readOnly className="bg-gray-100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitud">Longitud</Label>
            <Input id="longitud" name="longitud" value={formData.longitud} readOnly className="bg-gray-100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">URL del Logo</Label>
            <Input
              id="logo"
              name="logo"
              value={formData.logo || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
              placeholder="Ingresa la URL del logo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aceptaTarjeta">¿Acepta Tarjetas?</Label>
            <Select
              name="aceptaTarjeta"
              value={formData.aceptaTarjeta?.toString() || ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, aceptaTarjeta: value === "true" }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <HorarioForm horarios={formData.horarios} onHorarioChange={handleHorarioChange} />

          <div className="text-center">
            <Button type="submit" className="w-full">
              Registrar Tienda
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

