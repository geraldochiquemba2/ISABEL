import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Check } from "lucide-react";

interface MapPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  province?: string;
  municipality?: string;
  onLocationSelect: (latitude: number, longitude: number) => void;
  onClose: () => void;
}

// Centros das províncias de Angola (chaves = ANGOLA_PROVINCES.name;
// mantidos aliases antigos "Kwanza ..." e "Lobito" por compatibilidade
// com lojas já guardadas com essas grafias).
const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Luanda": { lat: -8.8399, lng: 13.2894 },
  "Bengo": { lat: -8.5786, lng: 13.6648 },
  "Benguela": { lat: -12.5785, lng: 13.4027 },
  "Bié": { lat: -12.3836, lng: 16.9416 },
  "Huambo": { lat: -12.7642, lng: 15.7356 },
  "Lobito": { lat: -12.3647, lng: 13.5364 },
  "Cabinda": { lat: -5.5578, lng: 12.1892 },
  "Huíla": { lat: -14.9216, lng: 14.3283 },
  "Uíge": { lat: -7.6089, lng: 15.0561 },
  "Zaire": { lat: -7.3347, lng: 12.8593 },
  "Cuanza Norte": { lat: -9.2989, lng: 14.9112 },
  "Cuanza Sul": { lat: -11.2061, lng: 13.8434 },
  "Kwanza Norte": { lat: -9.2421, lng: 14.8354 },
  "Kwanza Sul": { lat: -10.6486, lng: 14.3704 },
  "Malanje": { lat: -9.5402, lng: 16.3411 },
  "Lunda Norte": { lat: -8.3503, lng: 19.1874 },
  "Lunda Sul": { lat: -10.2913, lng: 20.7402 },
  "Moxico": { lat: -13.4287, lng: 20.3315 },
  "Moxico Leste": { lat: -11.8833, lng: 22.9 },
  "Cuando": { lat: -15.1667, lng: 19.1667 },
  "Cubango": { lat: -14.6578, lng: 17.6906 },
  "Cuando Cubango": { lat: -17.8739, lng: 20.1575 },
  "Cunene": { lat: -17.1954, lng: 15.4833 },
  "Namibe": { lat: -15.1965, lng: 12.1525 },
  "Icolo e Bengo": { lat: -9.2577, lng: 13.6824 },
};

export default function MapPicker({
  initialLatitude,
  initialLongitude,
  province,
  municipality,
  onLocationSelect,
  onClose,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(
    initialLatitude && initialLongitude ? { lat: initialLatitude, lng: initialLongitude } : null
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Obter coordenadas iniciais baseadas na província
  const getInitialCoords = useCallback(() => {
    if (initialLatitude && initialLongitude) {
      return { lat: initialLatitude, lng: initialLongitude };
    }
    if (province && PROVINCE_COORDS[province]) {
      return PROVINCE_COORDS[province];
    }
    // Luanda como padrão
    return { lat: -8.8399, lng: 13.2894 };
  }, [initialLatitude, initialLongitude, province]);

  useEffect(() => {
    // Carregar Leaflet CSS e JS dinamicamente
    const loadLeaflet = async () => {
      if (window.L) {
        initMap();
        return;
      }

      // Carregar CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Carregar JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.L) return;

      const initialCoords = getInitialCoords();

      // Criar mapa
      const map = window.L.map(mapRef.current, {
        center: [initialCoords.lat, initialCoords.lng],
        zoom: province ? 13 : 11,
        zoomControl: true,
      });

      // Adicionar tile layer (OpenStreetMap)
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Criar ícone azul personalizado
      const blueIcon = window.L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background: #1565C0;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
              font-weight: bold;
            ">📍</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Adicionar marcador se já tem coordenadas
      if (initialLatitude && initialLongitude) {
        markerRef.current = window.L.marker([initialLatitude, initialLongitude], { 
          icon: blueIcon,
          draggable: true 
        }).addTo(map);
        markerRef.current.bindPopup("Marque o seu ponto exato").openPopup();

        // Permitir arrastar o marcador
        markerRef.current.on("dragend", (e: any) => {
          const pos = e.target.getPosition();
          setSelectedCoords({ lat: pos.lat, lng: pos.lng });
        });
      }

      // Evento de clique no mapa
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;

        // Remover marcador anterior se existir
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Criar novo marcador
        markerRef.current = window.L.marker([lat, lng], { 
          icon: blueIcon,
          draggable: true 
        }).addTo(map);
        
        markerRef.current.bindPopup("Marque o seu ponto exato").openPopup();
        setSelectedCoords({ lat, lng });

        // Permitir arrastar o marcador
        markerRef.current.on("dragend", (e: any) => {
          const pos = e.target.getPosition();
          setSelectedCoords({ lat: pos.lat, lng: pos.lng });
        });
      });

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [getInitialCoords, province, initialLatitude, initialLongitude]);

  // Centralizar mapa quando a província mudar
  useEffect(() => {
    if (mapInstanceRef.current && province && PROVINCE_COORDS[province]) {
      const coords = PROVINCE_COORDS[province];
      mapInstanceRef.current.setView([coords.lat, coords.lng], 13);
    }
  }, [province]);

  const handleConfirm = () => {
    if (selectedCoords) {
      onLocationSelect(selectedCoords.lat, selectedCoords.lng);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Marque a localização</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Mapa */}
        <div className="relative">
          <div 
            ref={mapRef} 
            className="w-full h-[300px] sm:h-[400px]"
            style={{ background: "#e5e7eb" }}
          />
          
          {/* Instrução */}
          <div className="absolute top-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md z-[1000]">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-[#1565C0] flex-shrink-0" />
              <span>Toque no mapa para marcar o ponto exacto do seu estabelecimento</span>
            </p>
          </div>

        </div>

        {/* Coordenadas selecionadas */}
        {selectedCoords && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Localização seleccionada:</p>
            <p className="text-sm font-mono text-gray-700">
              {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCoords}
            className="flex-1 px-4 py-2.5 bg-[#1565C0] text-white rounded-xl hover:bg-[#0D47A1] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Confirmar localização
          </button>
        </div>
      </div>
    </div>
  );
}

// Declaração global para Leaflet
declare global {
  interface Window {
    L: any;
  }
}