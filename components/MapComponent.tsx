"use client";
import { AdresseAttributes } from "@/app/api/models/adresseModel";
import { resolveAddressCoordinates } from "@/lib/geoUtils";
import { formatValue } from "@/lib/helper";
import { Button, Input, Select, Spinner } from "@chakra-ui/react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBuilding,
  FaCompressAlt,
  FaFilter,
  FaHome,
  FaHospital,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaRegEye,
  FaSchool,
  FaSearch,
  FaShoppingBag,
  FaStore,
  FaTimes,
  FaUtensils
} from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Create custom Red Marker Icon with SVG pin and drop shadow
const createRedPinIcon = (isSelected = false) => {
  return L.divIcon({
    className: "custom-red-pin",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -100%); cursor: pointer;">
        <div style="position: relative; transition: transform 0.2s ease; ${
          isSelected ? "transform: scale(1.25); z-index: 999;" : ""
        }">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="url(#redPinGrad)" stroke="#7F1D1D" stroke-width="1.2"/>
            <circle cx="16" cy="15" r="6" fill="#FFFFFF"/>
            <circle cx="16" cy="15" r="3" fill="#DC2626"/>
            <defs>
              <linearGradient id="redPinGrad" x1="16" y1="0" x2="16" y2="42" gradientUnits="userSpaceOnUse">
                <stop stop-color="#EF4444"/>
                <stop offset="1" stop-color="#B91C1C"/>
              </linearGradient>
            </defs>
          </svg>
          <div style="position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%); width: 14px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 9999px; filter: blur(1px); z-index: -1;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Component to handle auto-fit bounds and camera movements
const MapController: React.FC<{
  markers: { lat: number; lon: number }[];
  selectedCoords: [number, number] | null;
}> = ({ markers, selectedCoords }) => {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 16, { duration: 1.2 });
    } else if (markers.length > 0 && !hasInitialized.current) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      hasInitialized.current = true;
    }
  }, [selectedCoords, markers, map]);

  return null;
};

const getBuildingIcon = (type?: string) => {
  switch ((type || "").toLowerCase()) {
    case "résidence":
    case "residence":
      return <FaHome className="text-blue-500 inline mr-1.5" />;
    case "commerce":
      return <FaShoppingBag className="text-amber-500 inline mr-1.5" />;
    case "hôtel":
    case "hotel":
      return <FaBuilding className="text-purple-500 inline mr-1.5" />;
    case "école":
    case "ecole":
    case "université":
      return <FaSchool className="text-green-500 inline mr-1.5" />;
    case "hôpital":
    case "hopital":
    case "pharmacie":
      return <FaHospital className="text-red-500 inline mr-1.5" />;
    case "restaurant":
      return <FaUtensils className="text-orange-500 inline mr-1.5" />;
    default:
      return <FaStore className="text-gray-500 inline mr-1.5" />;
  }
};

const TILE_LAYERS = {
  standard: {
    name: "Plan",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  light: {
    name: "Clair",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

const MapComponent: React.FC = () => {
  const [adresses, setAdresses] = useState<AdresseAttributes[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_LAYERS>("standard");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch addresses and communes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [adrRes, comRes] = await Promise.all([
          axios.get("/api/adresseCtrl"),
          axios.get("/api/communeCtrl"),
        ]);
        setAdresses(adrRes.data?.data || []);
        setCommunes(comRes.data?.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de la carte:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute resolved coordinates for each address
  const resolvedAdresses = useMemo(() => {
    return adresses.map((adr, index) => {
      const communeObj = communes.find((c) => c.id_commune === adr.id_commune);
      const communeName = communeObj ? communeObj.libelle_commune : adr.commune?.libelle_commune;
      const coords = resolveAddressCoordinates(adr, communeName, index);

      return {
        ...adr,
        resolvedLat: coords.lat,
        resolvedLon: coords.lon,
        isEstimated: coords.isEstimated,
        communeName: communeName || "Ville Inconnue",
      };
    });
  }, [adresses, communes]);

  // Filter addresses
  const filteredAdresses = useMemo(() => {
    return resolvedAdresses.filter((adr) => {
      const matchesSearch =
        (adr.libelle_adresse || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (adr.numero_rue || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (adr.code_postal || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (adr.communeName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (adr.section_communale || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCommune = !selectedCommune || String(adr.id_commune) === String(selectedCommune);
      const matchesType = !selectedType || adr.type_batiment === selectedType;

      return matchesSearch && matchesCommune && matchesType;
    });
  }, [resolvedAdresses, searchTerm, selectedCommune, selectedType]);

  // Extract marker coords for bounds
  const markerCoords = useMemo(() => {
    return filteredAdresses.map((a) => ({ lat: a.resolvedLat, lon: a.resolvedLon }));
  }, [filteredAdresses]);

  // Selected address coordinates for camera focus
  const selectedCoords = useMemo<[number, number] | null>(() => {
    if (!selectedAddressId) return null;
    const found = filteredAdresses.find((a) => a.id_adresses === selectedAddressId);
    return found ? [found.resolvedLat, found.resolvedLon] : null;
  }, [selectedAddressId, filteredAdresses]);

  const buildingTypes = useMemo(() => {
    const types = new Set<string>();
    adresses.forEach((a) => {
      if (a.type_batiment) types.add(a.type_batiment);
    });
    return Array.from(types);
  }, [adresses]);

  if (loading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-10">
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <p className="mt-4 text-gray-600 font-medium text-sm">Chargement de la carte et des adresses...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
      {/* Top Header Controls Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-semibold text-sm">
            <FaMapMarkerAlt className="text-red-600" />
            <span>{filteredAdresses.length} / {adresses.length} adresses localisées</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            leftIcon={<FaFilter />}
          >
            {sidebarOpen ? "Masquer filtres" : "Afficher filtres"}
          </Button>
        </div>

        {/* Map Layer Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <FaLayerGroup className="text-gray-400 mx-2 text-xs" />
          {(Object.keys(TILE_LAYERS) as (keyof typeof TILE_LAYERS)[]).map((layerKey) => (
            <button
              key={layerKey}
              type="button"
              onClick={() => setActiveLayer(layerKey)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeLayer === layerKey
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {TILE_LAYERS[layerKey].name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Body + Sidebar Container */}
      <div className="relative flex flex-col md:flex-row h-[750px]">
        {/* Interactive Sidebar Panel */}
        {sidebarOpen && (
          <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full z-10">
            {/* Search & Filter Header */}
            <div className="p-3 border-b border-gray-100 space-y-2.5 bg-gray-50/50">
              <div className="relative">
                <Input
                  size="sm"
                  placeholder="Rechercher une adresse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white pl-8 rounded-lg"
                />
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  size="sm"
                  placeholder="Toutes les villes"
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="bg-white text-xs rounded-lg"
                >
                  {communes.map((c) => (
                    <option key={c.id_commune} value={c.id_commune}>
                      {c.libelle_commune}
                    </option>
                  ))}
                </Select>

                <Select
                  size="sm"
                  placeholder="Tous types"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white text-xs rounded-lg"
                >
                  {buildingTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* List of addresses */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredAdresses.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  Aucune adresse ne correspond à votre recherche.
                </div>
              ) : (
                filteredAdresses.map((adr) => {
                  const isSelected = selectedAddressId === adr.id_adresses;
                  return (
                    <div
                      key={adr.id_adresses}
                      onClick={() => setSelectedAddressId(adr.id_adresses)}
                      className={`p-3 cursor-pointer transition-colors text-left flex items-start justify-between gap-2 ${
                        isSelected
                          ? "bg-blue-50/80 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                          {getBuildingIcon(adr.type_batiment)}
                          <span>
                            {adr.numero_rue ? `${adr.numero_rue}, ` : ""}
                            {formatValue(adr.libelle_adresse)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {adr.communeName} {adr.section_communale ? `• ${adr.section_communale}` : ""}
                        </div>
                        <div className="flex items-center gap-2 pt-1 text-[11px]">
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                            {formatValue(adr.code_postal)}
                          </span>
                          <span className="text-gray-400">
                            {adr.type_batiment || "Résidence"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shadow-sm"></span>
                        <Link
                          href={`/adresses/${adr.id_adresses}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-800 p-1 text-xs"
                          title="Voir les détails"
                        >
                          <FaRegEye />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Leaflet Map Canvas */}
        <div className="flex-1 h-full relative z-0">
          <MapContainer
            center={[18.5392, -72.3350]}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url={TILE_LAYERS[activeLayer].url}
              attribution={TILE_LAYERS[activeLayer].attribution}
            />

            <MapController
              markers={markerCoords}
              selectedCoords={selectedCoords}
            />

            {filteredAdresses.map((adr) => {
              const isSelected = selectedAddressId === adr.id_adresses;
              const icon = createRedPinIcon(isSelected);

              return (
                <Marker
                  key={adr.id_adresses}
                  position={[adr.resolvedLat, adr.resolvedLon]}
                  icon={icon}
                  eventHandlers={{
                    click: () => {
                      setSelectedAddressId(adr.id_adresses);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-3.5 min-w-[220px] max-w-[280px] text-gray-800 space-y-2">
                      {/* Category Badge & Status */}
                      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <span className="inline-flex items-center text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                          {getBuildingIcon(adr.type_batiment)}
                          {adr.type_batiment || "Résidence"}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {formatValue(adr.statut)}
                        </span>
                      </div>

                      {/* Main Address Title */}
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 leading-snug">
                          {adr.numero_rue ? `${adr.numero_rue}, ` : ""}
                          {formatValue(adr.libelle_adresse)}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {adr.communeName}
                          {adr.section_communale ? ` • ${adr.section_communale}` : ""}
                        </p>
                      </div>

                      {/* Meta information */}
                      <div className="bg-gray-50 p-2 rounded-lg text-xs space-y-1 text-gray-600">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Code postal :</span>
                          <span className="font-mono font-medium">{formatValue(adr.code_postal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Clé d'unicité :</span>
                          <span className="font-mono text-[11px] truncate max-w-[130px]" title={adr.cle_unicite}>
                            {formatValue(adr.cle_unicite)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 pt-0.5 border-t border-gray-200/50">
                          <span>GPS :</span>
                          <span>
                            {adr.resolvedLat.toFixed(4)}, {adr.resolvedLon.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-1">
                        <Link href={`/adresses/${adr.id_adresses}`}>
                          <Button size="xs" colorScheme="blue" width="full" leftIcon={<FaRegEye />}>
                            Consulter la fiche
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
