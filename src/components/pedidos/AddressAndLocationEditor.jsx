import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import supabase from "../../api/supabase";

export default function AddressAndLocationEditor({ userId }) {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState([12.114992, -86.236174]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("perfil")
        .select("direccion, latitud, longitud")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setAddress(data.direccion || "");
        setLocation([data.latitud || 12.114992, data.longitud || -86.236174]);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSearch = async () => {
    if (!searchQuery) return;

    // Example: Use a geocoding API for address lookup (replace with actual API call)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1`
      );
      const results = await response.json();
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      const { error } = await supabase
        .from("perfil")
        .update({
          direccion: address,
          latitud: location[0],
          longitud: location[1],
        })
        .eq("id", userId);

      if (error) throw error;

      alert("Dirección actualizada correctamente.");
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Error al actualizar la dirección.");
    }
  };

  function LocationSelector() {
    useMapEvents({
      click: (e) => {
        setLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return location ? <Marker position={location} /> : null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Editar Dirección y Ubicación</h2>
      <div className="mb-4">
        <Label>Búsqueda de dirección</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Ingresa una dirección"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>Buscar</Button>
        </div>
        {suggestions.length > 0 && (
          <ul className="mt-2 border rounded bg-white max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setAddress(suggestion.display_name);
                  setLocation([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
                  setSuggestions([]);
                }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <Label>Dirección</Label>
        <Input
          placeholder="Ingresa tu dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label>Ubicación en el mapa</Label>
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector />
        </MapContainer>
      </div>
      <Button className="w-full" onClick={handleSave}>
        Guardar Cambios
      </Button>
    </div>
  );
}
