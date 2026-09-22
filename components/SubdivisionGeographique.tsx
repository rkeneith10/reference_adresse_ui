"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaCity,
  FaCompressAlt,
  FaCopy,
  FaDownload,
  FaExpandAlt,
  FaExternalLinkAlt,
  FaFilter,
  FaGlobeAmericas,
  FaHome,
  FaHospital,
  FaInfoCircle,
  FaLayerGroup,
  FaMap,
  FaMapMarkerAlt,
  FaMapPin,
  FaRegEye,
  FaRegFlag,
  FaRegFolder,
  FaRegFolderOpen,
  FaSchool,
  FaSearch,
  FaShoppingBag,
  FaSitemap,
  FaTimes,
  FaUniversity,
  FaUtensils,
} from "react-icons/fa";
import { MdListAlt, MdLocationCity, MdOutlinePlace } from "react-icons/md";
import { formatValue } from "@/lib/helper";
import { resolveAddressCoordinates } from "@/lib/geoUtils";

// Interfaces
export interface AdresseItem {
  id_adresses: number;
  numero_rue?: string;
  libelle_adresse: string;
  cle_unicite?: string;
  code_postal?: string;
  statut?: string;
  section_communale?: string;
  id_commune?: number;
  latitude?: number | null;
  longitude?: number | null;
  type_batiment?: string;
  from?: string;
}

export interface CommuneItem {
  id_commune: number;
  id_departement?: number;
  libelle_commune: string;
  Adresses?: AdresseItem[];
  adresses?: AdresseItem[];
}

export interface DepartementItem {
  id_departement: number;
  libelle_departement: string;
  code_departement?: string;
  chef_lieux?: string;
  id_pays?: number;
  Communes?: CommuneItem[];
  communes?: CommuneItem[];
}

export interface PaysItem {
  id_pays: number;
  libelle_pays: string;
  code_pays?: string;
  continent?: string;
  indicatif_tel?: string;
  fuseau_horaire?: string;
  Departements?: DepartementItem[];
  departements?: DepartementItem[];
}

interface Props {
  data: PaysItem[];
  onRefresh?: () => void;
}

// Helpers for casing normalization
const getDepartements = (p: PaysItem): DepartementItem[] => p.Departements || p.departements || [];
const getCommunes = (d: DepartementItem): CommuneItem[] => d.Communes || d.communes || [];
const getAdresses = (c: CommuneItem): AdresseItem[] => c.Adresses || c.adresses || [];

// Building icon helper
const getBuildingIcon = (type?: string) => {
  switch ((type || "").toLowerCase()) {
    case "résidence":
    case "residence":
      return <FaHome className="text-blue-500" />;
    case "commerce":
      return <FaShoppingBag className="text-amber-500" />;
    case "hôtel":
    case "hotel":
      return <FaBuilding className="text-purple-500" />;
    case "école":
    case "ecole":
      return <FaSchool className="text-emerald-500" />;
    case "université":
    case "universite":
      return <FaUniversity className="text-indigo-500" />;
    case "hôpital":
    case "hopital":
    case "pharmacie":
      return <FaHospital className="text-rose-500" />;
    case "restaurant":
      return <FaUtensils className="text-orange-500" />;
    default:
      return <FaMapPin className="text-blue-500" />;
  }
};

// Status badge helper
const getStatusBadge = (status?: string) => {
  const st = (status || "").toLowerCase();
  if (st.includes("valid") || st.includes("actif")) {
    return <Badge colorScheme="green" variant="subtle" fontSize="0.7rem">{status || "Validé"}</Badge>;
  }
  if (st.includes("creat") || st.includes("cours")) {
    return <Badge colorScheme="blue" variant="subtle" fontSize="0.7rem">{status || "En création"}</Badge>;
  }
  if (st.includes("archiv") || st.includes("inactif")) {
    return <Badge colorScheme="gray" variant="subtle" fontSize="0.7rem">{status || "Inactif"}</Badge>;
  }
  return <Badge colorScheme="purple" variant="subtle" fontSize="0.7rem">{status || "Standard"}</Badge>;
};

// Mini Leaflet Map Component (Client-only)
const SubdivisionMap = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, Marker, Popup, useMap } = mod;
      const L = require("leaflet");
      require("leaflet/dist/leaflet.css");

      const createPin = (isSelected: boolean) =>
        L.divIcon({
          className: "custom-map-pin",
          html: `
            <div style="transform: translate(-50%, -100%); cursor: pointer;">
              <div style="width: 28px; height: 36px; display: flex; align-items: center; justify-content: center; background: ${
                isSelected ? "#2563EB" : "#DC2626"
              }; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white;">
                <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
              </div>
            </div>
          `,
          iconSize: [28, 36],
          iconAnchor: [14, 36],
          popupAnchor: [0, -36],
        });

      const MapBoundsUpdater = ({ markers }: { markers: { lat: number; lon: number }[] }) => {
        const map = useMap();
        React.useEffect(() => {
          if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
          }
        }, [markers, map]);
        return null;
      };

      const InnerMap: React.FC<{
        adresses: { adr: AdresseItem; communeName: string; lat: number; lon: number }[];
        selectedId: number | null;
        onSelect: (id: number) => void;
      }> = ({ adresses, selectedId, onSelect }) => {
        const markerPoints = useMemo(() => adresses.map((a) => ({ lat: a.lat, lon: a.lon })), [adresses]);
        const centerPos: [number, number] =
          adresses.length > 0 ? [adresses[0].lat, adresses[0].lon] : [18.5392, -72.335];

        return (
          <div className="h-full w-full rounded-xl overflow-hidden border border-gray-200">
            <MapContainer center={centerPos} zoom={9} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapBoundsUpdater markers={markerPoints} />
              {adresses.map(({ adr, communeName, lat, lon }) => {
                const isSelected = selectedId === adr.id_adresses;
                return (
                  <Marker
                    key={adr.id_adresses}
                    position={[lat, lon]}
                    icon={createPin(isSelected)}
                    eventHandlers={{
                      click: () => onSelect(adr.id_adresses),
                    }}
                  >
                    <Popup>
                      <div className="p-2 space-y-1 text-xs">
                        <p className="font-bold text-gray-900">
                          {adr.numero_rue ? `${adr.numero_rue}, ` : ""}
                          {adr.libelle_adresse}
                        </p>
                        <p className="text-gray-600">
                          {communeName} {adr.section_communale ? `• ${adr.section_communale}` : ""}
                        </p>
                        <p className="text-gray-500 font-mono text-[11px]">
                          Code Postal : {adr.code_postal || "N/A"}
                        </p>
                        <div className="pt-1">
                          <Link href={`/adresses/${adr.id_adresses}`}>
                            <span className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                              Fiche détaillée <FaExternalLinkAlt size={10} />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        );
      };

      return InnerMap;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 min-h-[350px]">
        <Spinner size="lg" color="blue.500" />
        <p className="text-xs text-gray-500 mt-2">Chargement de la carte...</p>
      </div>
    ),
  }
);

const SubdivisionGeographique: React.FC<Props> = ({ data, onRefresh }) => {
  const toast = useToast();

  // Selection states (for cascade drill-down)
  const [selectedPaysId, setSelectedPaysId] = useState<number | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [selectedCommuneId, setSelectedCommuneId] = useState<number | null>(null);
  const [selectedAdresseId, setSelectedAdresseId] = useState<number | null>(null);

  // View mode
  const [activeView, setActiveView] = useState<"cascade" | "tree" | "map">("cascade");

  // Filter & Search states
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchPays, setSearchPays] = useState("");
  const [searchDept, setSearchDept] = useState("");
  const [searchCommune, setSearchCommune] = useState("");
  const [searchAdresse, setSearchAdresse] = useState("");

  // Tree expanded nodes set
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Address inspection modal
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [modalAdresse, setModalAdresse] = useState<AdresseItem | null>(null);
  const [modalCommuneName, setModalCommuneName] = useState<string>("");

  // Initialize selection with first country if available and none selected
  React.useEffect(() => {
    if (data && data.length > 0 && selectedPaysId === null) {
      const firstPays = data[0];
      setSelectedPaysId(firstPays.id_pays);
      const depts = getDepartements(firstPays);
      if (depts.length > 0) {
        setSelectedDeptId(depts[0].id_departement);
        const communes = getCommunes(depts[0]);
        if (communes.length > 0) {
          setSelectedCommuneId(communes[0].id_commune);
        }
      }
    }
  }, [data, selectedPaysId]);

  // Derived selected objects
  const selectedPays = useMemo(() => {
    return data.find((p) => p.id_pays === selectedPaysId) || null;
  }, [data, selectedPaysId]);

  const selectedDept = useMemo(() => {
    if (!selectedPays) return null;
    return getDepartements(selectedPays).find((d) => d.id_departement === selectedDeptId) || null;
  }, [selectedPays, selectedDeptId]);

  const selectedCommune = useMemo(() => {
    if (!selectedDept) return null;
    return getCommunes(selectedDept).find((c) => c.id_commune === selectedCommuneId) || null;
  }, [selectedDept, selectedCommuneId]);

  const selectedAdresse = useMemo(() => {
    if (!selectedCommune) return null;
    return getAdresses(selectedCommune).find((a) => a.id_adresses === selectedAdresseId) || null;
  }, [selectedCommune, selectedAdresseId]);

  // Global totals computation
  const stats = useMemo(() => {
    let totalPays = data.length;
    let totalDepts = 0;
    let totalCommunes = 0;
    let totalAdresses = 0;

    data.forEach((p) => {
      const depts = getDepartements(p);
      totalDepts += depts.length;
      depts.forEach((d) => {
        const communes = getCommunes(d);
        totalCommunes += communes.length;
        communes.forEach((c) => {
          const adrs = getAdresses(c);
          totalAdresses += adrs.length;
        });
      });
    });

    return { totalPays, totalDepts, totalCommunes, totalAdresses };
  }, [data]);

  // Filtered lists for cascade columns
  const filteredPaysList = useMemo(() => {
    return data.filter((p) => {
      const matchText = (p.libelle_pays || "").toLowerCase().includes(searchPays.toLowerCase()) ||
        (p.code_pays || "").toLowerCase().includes(searchPays.toLowerCase()) ||
        (p.continent || "").toLowerCase().includes(searchPays.toLowerCase());

      if (!globalSearch) return matchText;

      const g = globalSearch.toLowerCase();
      const matchGlobalPays = (p.libelle_pays || "").toLowerCase().includes(g);
      const depts = getDepartements(p);
      const matchGlobalDept = depts.some((d) =>
        (d.libelle_departement || "").toLowerCase().includes(g) ||
        getCommunes(d).some((c) =>
          (c.libelle_commune || "").toLowerCase().includes(g) ||
          getAdresses(c).some((a) => (a.libelle_adresse || "").toLowerCase().includes(g))
        )
      );

      return matchText && (matchGlobalPays || matchGlobalDept);
    });
  }, [data, searchPays, globalSearch]);

  const filteredDeptList = useMemo(() => {
    if (!selectedPays) return [];
    return getDepartements(selectedPays).filter((d) => {
      const matchText = (d.libelle_departement || "").toLowerCase().includes(searchDept.toLowerCase()) ||
        (d.code_departement || "").toLowerCase().includes(searchDept.toLowerCase()) ||
        (d.chef_lieux || "").toLowerCase().includes(searchDept.toLowerCase());

      if (!globalSearch) return matchText;
      const g = globalSearch.toLowerCase();
      const matchDeptName = (d.libelle_departement || "").toLowerCase().includes(g);
      const matchChildren = getCommunes(d).some((c) =>
        (c.libelle_commune || "").toLowerCase().includes(g) ||
        getAdresses(c).some((a) => (a.libelle_adresse || "").toLowerCase().includes(g))
      );
      return matchText && (matchDeptName || matchChildren);
    });
  }, [selectedPays, searchDept, globalSearch]);

  const filteredCommuneList = useMemo(() => {
    if (!selectedDept) return [];
    return getCommunes(selectedDept).filter((c) => {
      const matchText = (c.libelle_commune || "").toLowerCase().includes(searchCommune.toLowerCase());
      if (!globalSearch) return matchText;
      const g = globalSearch.toLowerCase();
      const matchCommuneName = (c.libelle_commune || "").toLowerCase().includes(g);
      const matchAdresses = getAdresses(c).some((a) =>
        (a.libelle_adresse || "").toLowerCase().includes(g) ||
        (a.numero_rue || "").toLowerCase().includes(g) ||
        (a.code_postal || "").toLowerCase().includes(g)
      );
      return matchText && (matchCommuneName || matchAdresses);
    });
  }, [selectedDept, searchCommune, globalSearch]);

  const filteredAdresseList = useMemo(() => {
    if (!selectedCommune) return [];
    return getAdresses(selectedCommune).filter((a) => {
      const matchSearch =
        (a.libelle_adresse || "").toLowerCase().includes(searchAdresse.toLowerCase()) ||
        (a.numero_rue || "").toLowerCase().includes(searchAdresse.toLowerCase()) ||
        (a.code_postal || "").toLowerCase().includes(searchAdresse.toLowerCase()) ||
        (a.section_communale || "").toLowerCase().includes(searchAdresse.toLowerCase()) ||
        (a.type_batiment || "").toLowerCase().includes(searchAdresse.toLowerCase());

      if (!globalSearch) return matchSearch;
      const g = globalSearch.toLowerCase();
      const matchGlobal =
        (a.libelle_adresse || "").toLowerCase().includes(g) ||
        (a.numero_rue || "").toLowerCase().includes(g) ||
        (a.code_postal || "").toLowerCase().includes(g) ||
        (a.section_communale || "").toLowerCase().includes(g);

      return matchSearch && matchGlobal;
    });
  }, [selectedCommune, searchAdresse, globalSearch]);

  // Addresses for the map based on current selection level
  const mapAdresses = useMemo(() => {
    const list: { adr: AdresseItem; communeName: string; lat: number; lon: number }[] = [];

    const processCommune = (c: CommuneItem) => {
      const adrs = getAdresses(c);
      adrs.forEach((adr, idx) => {
        const coords = resolveAddressCoordinates(
          {
            id_adresses: adr.id_adresses,
            latitude: adr.latitude,
            longitude: adr.longitude,
            libelle_adresse: adr.libelle_adresse,
            section_communale: adr.section_communale,
          },
          c.libelle_commune,
          idx
        );
        list.push({
          adr,
          communeName: c.libelle_commune,
          lat: coords.lat,
          lon: coords.lon,
        });
      });
    };

    if (selectedCommune) {
      processCommune(selectedCommune);
    } else if (selectedDept) {
      getCommunes(selectedDept).forEach(processCommune);
    } else if (selectedPays) {
      getDepartements(selectedPays).forEach((d) => getCommunes(d).forEach(processCommune));
    } else {
      data.forEach((p) =>
        getDepartements(p).forEach((d) => getCommunes(d).forEach(processCommune))
      );
    }

    return list;
  }, [data, selectedPays, selectedDept, selectedCommune]);

  // Tree toggle helper
  const toggleTreeNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  const expandAllTree = () => {
    const nextState: Record<string, boolean> = {};
    data.forEach((p) => {
      nextState[`pays-${p.id_pays}`] = true;
      getDepartements(p).forEach((d) => {
        nextState[`dept-${d.id_departement}`] = true;
        getCommunes(d).forEach((c) => {
          nextState[`commune-${c.id_commune}`] = true;
        });
      });
    });
    setExpandedNodes(nextState);
  };

  const collapseAllTree = () => {
    setExpandedNodes({});
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copié !`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  // Open modal inspector
  const openAdresseModal = (adr: AdresseItem, communeName: string) => {
    setModalAdresse(adr);
    setModalCommuneName(communeName);
    onModalOpen();
  };

  // Export JSON summary
  const exportHierarchyJSON = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `subdivision_geographique_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast({
      title: "Export réussi",
      description: "L'arborescence géographique a été téléchargée en JSON.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Stats KPI Bar */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Box className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
            <FaGlobeAmericas />
          </div>
          <div>
            <Text fontSize="xs" fontWeight="medium" className="text-gray-500 uppercase tracking-wider">
              Pays
            </Text>
            <Text fontSize="2xl" fontWeight="bold" className="text-gray-900">
              {stats.totalPays}
            </Text>
          </div>
        </Box>

        <Box className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">
            <MdListAlt />
          </div>
          <div>
            <Text fontSize="xs" fontWeight="medium" className="text-gray-500 uppercase tracking-wider">
              Départements
            </Text>
            <Text fontSize="2xl" fontWeight="bold" className="text-gray-900">
              {stats.totalDepts}
            </Text>
          </div>
        </Box>

        <Box className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
            <FaCity />
          </div>
          <div>
            <Text fontSize="xs" fontWeight="medium" className="text-gray-500 uppercase tracking-wider">
              Villes & Communes
            </Text>
            <Text fontSize="2xl" fontWeight="bold" className="text-gray-900">
              {stats.totalCommunes}
            </Text>
          </div>
        </Box>

        <Box className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 text-xl">
            <FaMapMarkerAlt />
          </div>
          <div>
            <Text fontSize="xs" fontWeight="medium" className="text-gray-500 uppercase tracking-wider">
              Adresses Référencées
            </Text>
            <Text fontSize="2xl" fontWeight="bold" className="text-gray-900">
              {stats.totalAdresses}
            </Text>
          </div>
        </Box>
      </SimpleGrid>

      {/* Control Bar: Global Search, View Switcher & Actions */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Global Search */}
        <div className="relative flex-1 max-w-lg">
          <Input
            placeholder="Rechercher un pays, département, commune, rue ou code postal..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-9 pr-8 bg-gray-50 border-gray-200 focus:bg-white text-sm rounded-lg"
            size="md"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={13} />
            </button>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveView("cascade")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === "cascade"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaLayerGroup size={13} />
              <span>Colonnes en cascade</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("tree")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === "tree"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaSitemap size={13} />
              <span>Arborescence</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("map")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === "map"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaMap size={13} />
              <span>Carte synchronisée</span>
            </button>
          </div>

          <Tooltip label="Exporter l'arborescence en JSON">
            <IconButton
              aria-label="Export"
              icon={<FaDownload />}
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={exportHierarchyJSON}
            />
          </Tooltip>
        </div>
      </div>

      {/* Interactive Breadcrumb Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-3.5 rounded-xl border border-blue-100/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 mr-1">
          <MdOutlinePlace className="text-blue-600 text-sm" />
          Navigation :
        </span>

        {/* Crumb 0: All countries */}
        <button
          onClick={() => {
            setSelectedPaysId(null);
            setSelectedDeptId(null);
            setSelectedCommuneId(null);
            setSelectedAdresseId(null);
          }}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            !selectedPays
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white/80 text-gray-700 hover:bg-white hover:text-blue-600"
          }`}
        >
          🌍 Tous les pays ({data.length})
        </button>

        {/* Crumb 1: Selected Country */}
        {selectedPays && (
          <>
            <FaChevronRight className="text-gray-400 text-[10px]" />
            <button
              onClick={() => {
                setSelectedDeptId(null);
                setSelectedCommuneId(null);
                setSelectedAdresseId(null);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                selectedPays && !selectedDept
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:text-blue-600"
              }`}
            >
              <FaRegFlag className="text-xs" />
              <span>{selectedPays.libelle_pays}</span>
              <Badge colorScheme="blue" variant="solid" fontSize="10px" className="rounded-full px-1.5">
                {getDepartements(selectedPays).length} depts
              </Badge>
            </button>
          </>
        )}

        {/* Crumb 2: Selected Department */}
        {selectedDept && (
          <>
            <FaChevronRight className="text-gray-400 text-[10px]" />
            <button
              onClick={() => {
                setSelectedCommuneId(null);
                setSelectedAdresseId(null);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                selectedDept && !selectedCommune
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:text-emerald-600"
              }`}
            >
              <MdListAlt className="text-xs" />
              <span>{selectedDept.libelle_departement}</span>
              <Badge colorScheme="green" variant="solid" fontSize="10px" className="rounded-full px-1.5">
                {getCommunes(selectedDept).length} villes
              </Badge>
            </button>
          </>
        )}

        {/* Crumb 3: Selected Commune */}
        {selectedCommune && (
          <>
            <FaChevronRight className="text-gray-400 text-[10px]" />
            <button
              onClick={() => {
                setSelectedAdresseId(null);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                selectedCommune && !selectedAdresse
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:text-purple-600"
              }`}
            >
              <FaCity className="text-xs" />
              <span>{selectedCommune.libelle_commune}</span>
              <Badge colorScheme="purple" variant="solid" fontSize="10px" className="rounded-full px-1.5">
                {getAdresses(selectedCommune).length} adresses
              </Badge>
            </button>
          </>
        )}

        {/* Crumb 4: Selected Adresse */}
        {selectedAdresse && (
          <>
            <FaChevronRight className="text-gray-400 text-[10px]" />
            <span className="px-2.5 py-1 rounded-md font-medium bg-rose-600 text-white shadow-sm flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-xs" />
              <span>
                {selectedAdresse.numero_rue ? `${selectedAdresse.numero_rue}, ` : ""}
                {selectedAdresse.libelle_adresse}
              </span>
            </span>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CASCADE COLUMNS / DRILL-DOWN (MAIN REQUESTED FEATURE)              */}
      {/* ========================================================================= */}
      {activeView === "cascade" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[580px]">
          {/* COLUMN 1: PAYS (COUNTRIES) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>1. Pays</span>
                </div>
                <Badge colorScheme="blue" variant="subtle" fontSize="0.75rem" className="rounded-full px-2">
                  {filteredPaysList.length}
                </Badge>
              </div>
              <div className="relative">
                <Input
                  size="xs"
                  placeholder="Filtrer pays..."
                  value={searchPays}
                  onChange={(e) => setSearchPays(e.target.value)}
                  className="bg-white pl-6 rounded-md"
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-1.5 max-h-[500px]">
              {filteredPaysList.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  Aucun pays trouvé.
                </div>
              ) : (
                filteredPaysList.map((pays) => {
                  const isSelected = selectedPaysId === pays.id_pays;
                  const depts = getDepartements(pays);
                  let totalAdrInPays = 0;
                  depts.forEach((d) => getCommunes(d).forEach((c) => (totalAdrInPays += getAdresses(c).length)));

                  return (
                    <div
                      key={pays.id_pays}
                      onClick={() => {
                        setSelectedPaysId(pays.id_pays);
                        // Auto-select first department if available
                        if (depts.length > 0) {
                          setSelectedDeptId(depts[0].id_departement);
                          const coms = getCommunes(depts[0]);
                          setSelectedCommuneId(coms.length > 0 ? coms[0].id_commune : null);
                        } else {
                          setSelectedDeptId(null);
                          setSelectedCommuneId(null);
                        }
                        setSelectedAdresseId(null);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 text-left mb-1 ${
                        isSelected
                          ? "bg-blue-50 border-2 border-blue-500 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 truncate">
                            {pays.libelle_pays}
                          </span>
                          {pays.code_pays && (
                            <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">
                              {pays.code_pays}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{depts.length} dépts</span>
                          <span>•</span>
                          <span>{totalAdrInPays} adresses</span>
                        </div>
                      </div>

                      <FaChevronRight
                        className={`text-xs transition-transform ${
                          isSelected ? "text-blue-600 translate-x-0.5" : "text-gray-300"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 2: DEPARTEMENTS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>2. Départements</span>
                </div>
                <Badge colorScheme="green" variant="subtle" fontSize="0.75rem" className="rounded-full px-2">
                  {filteredDeptList.length}
                </Badge>
              </div>
              <div className="relative">
                <Input
                  size="xs"
                  placeholder="Filtrer départements..."
                  value={searchDept}
                  onChange={(e) => setSearchDept(e.target.value)}
                  className="bg-white pl-6 rounded-md"
                  disabled={!selectedPays}
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-1.5 max-h-[500px]">
              {!selectedPays ? (
                <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                  <FaRegFolder className="mx-auto text-2xl text-gray-300" />
                  <p>Veuillez sélectionner un pays à gauche pour voir ses départements.</p>
                </div>
              ) : filteredDeptList.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  Aucun département dans ce pays.
                </div>
              ) : (
                filteredDeptList.map((dept) => {
                  const isSelected = selectedDeptId === dept.id_departement;
                  const communes = getCommunes(dept);
                  let totalAdrInDept = 0;
                  communes.forEach((c) => (totalAdrInDept += getAdresses(c).length));

                  return (
                    <div
                      key={dept.id_departement}
                      onClick={() => {
                        setSelectedDeptId(dept.id_departement);
                        // Auto-select first commune if available
                        if (communes.length > 0) {
                          setSelectedCommuneId(communes[0].id_commune);
                        } else {
                          setSelectedCommuneId(null);
                        }
                        setSelectedAdresseId(null);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 text-left mb-1 ${
                        isSelected
                          ? "bg-emerald-50 border-2 border-emerald-500 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 truncate">
                            {dept.libelle_departement}
                          </span>
                          {dept.code_departement && (
                            <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                              {dept.code_departement}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {dept.chef_lieux && <span>Chef-lieu : {dept.chef_lieux} • </span>}
                          <span>{communes.length} communes</span>
                          <span>•</span>
                          <span>{totalAdrInDept} adresses</span>
                        </div>
                      </div>

                      <FaChevronRight
                        className={`text-xs transition-transform ${
                          isSelected ? "text-emerald-600 translate-x-0.5" : "text-gray-300"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 3: COMMUNES / VILLES */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>3. Communes / Villes</span>
                </div>
                <Badge colorScheme="purple" variant="subtle" fontSize="0.75rem" className="rounded-full px-2">
                  {filteredCommuneList.length}
                </Badge>
              </div>
              <div className="relative">
                <Input
                  size="xs"
                  placeholder="Filtrer communes..."
                  value={searchCommune}
                  onChange={(e) => setSearchCommune(e.target.value)}
                  className="bg-white pl-6 rounded-md"
                  disabled={!selectedDept}
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-1.5 max-h-[500px]">
              {!selectedDept ? (
                <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                  <FaCity className="mx-auto text-2xl text-gray-300" />
                  <p>Veuillez sélectionner un département pour voir ses communes/villes.</p>
                </div>
              ) : filteredCommuneList.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  Aucune commune dans ce département.
                </div>
              ) : (
                filteredCommuneList.map((commune) => {
                  const isSelected = selectedCommuneId === commune.id_commune;
                  const adrs = getAdresses(commune);

                  return (
                    <div
                      key={commune.id_commune}
                      onClick={() => {
                        setSelectedCommuneId(commune.id_commune);
                        setSelectedAdresseId(null);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 text-left mb-1 ${
                        isSelected
                          ? "bg-purple-50 border-2 border-purple-500 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate">
                          {commune.libelle_commune}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FaMapMarkerAlt className="text-purple-400 text-[11px]" />
                          <span>{adrs.length} adresse{adrs.length > 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      <FaChevronRight
                        className={`text-xs transition-transform ${
                          isSelected ? "text-purple-600 translate-x-0.5" : "text-gray-300"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 4: ADRESSES & DETAILS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>4. Adresses Référencées</span>
                </div>
                <Badge colorScheme="red" variant="subtle" fontSize="0.75rem" className="rounded-full px-2">
                  {filteredAdresseList.length}
                </Badge>
              </div>
              <div className="relative">
                <Input
                  size="xs"
                  placeholder="Filtrer adresses..."
                  value={searchAdresse}
                  onChange={(e) => setSearchAdresse(e.target.value)}
                  className="bg-white pl-6 rounded-md"
                  disabled={!selectedCommune}
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-1.5 max-h-[500px]">
              {!selectedCommune ? (
                <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                  <FaMapPin className="mx-auto text-2xl text-gray-300" />
                  <p>Sélectionnez une commune pour afficher ses adresses enregistrées.</p>
                </div>
              ) : filteredAdresseList.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                  <p>Aucune adresse enregistrée dans cette commune.</p>
                  <Link href="/adresses">
                    <Button size="xs" colorScheme="blue" variant="outline" mt={2}>
                      Ajouter une adresse
                    </Button>
                  </Link>
                </div>
              ) : (
                filteredAdresseList.map((adr) => {
                  const isSelected = selectedAdresseId === adr.id_adresses;

                  return (
                    <div
                      key={adr.id_adresses}
                      onClick={() => {
                        setSelectedAdresseId(adr.id_adresses);
                        openAdresseModal(adr, selectedCommune.libelle_commune);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-start justify-between gap-2 text-left mb-1 ${
                        isSelected
                          ? "bg-rose-50 border-2 border-rose-500 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {getBuildingIcon(adr.type_batiment)}
                          <span className="font-bold text-xs text-gray-900 truncate">
                            {adr.numero_rue ? `${adr.numero_rue}, ` : ""}
                            {adr.libelle_adresse}
                          </span>
                        </div>

                        {adr.section_communale && (
                          <p className="text-[11px] text-gray-500">
                            Section : {adr.section_communale}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 pt-0.5">
                          {adr.code_postal && (
                            <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                              {adr.code_postal}
                            </span>
                          )}
                          {getStatusBadge(adr.statut)}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Tooltip label="Examiner la fiche">
                          <button
                            type="button"
                            className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <FaRegEye size={12} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INTERACTIVE HIERARCHICAL TREE VIEW                                */}
      {/* ========================================================================= */}
      {activeView === "tree" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h4 className="font-bold text-base text-gray-900">Arborescence Hiérarchique Complète</h4>
              <p className="text-xs text-gray-500">
                Dépliez ou repliez les niveaux géographiques pour inspecter la structure globale.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="outline" leftIcon={<FaExpandAlt />} onClick={expandAllTree}>
                Tout déplier
              </Button>
              <Button size="xs" variant="outline" leftIcon={<FaCompressAlt />} onClick={collapseAllTree}>
                Tout replier
              </Button>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            {filteredPaysList.map((pays) => {
              const isPaysOpen = !!expandedNodes[`pays-${pays.id_pays}`];
              const depts = getDepartements(pays);

              return (
                <div key={pays.id_pays} className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                  {/* PAYS ROW */}
                  <div
                    onClick={() => toggleTreeNode(`pays-${pays.id_pays}`)}
                    className="p-3 bg-blue-50/70 hover:bg-blue-100/70 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconButton
                        aria-label="Toggle Pays"
                        icon={isPaysOpen ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                      />
                      <FaGlobeAmericas className="text-blue-600 text-base" />
                      <span className="font-bold text-sm text-gray-900">{pays.libelle_pays}</span>
                      {pays.code_pays && (
                        <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-700 font-semibold">
                          {pays.code_pays}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag size="sm" colorScheme="blue" variant="subtle">
                        {depts.length} Départements
                      </Tag>
                    </div>
                  </div>

                  {/* DEPARTEMENTS LIST */}
                  {isPaysOpen && (
                    <div className="p-3 pl-6 bg-white space-y-2.5 border-t border-gray-100">
                      {depts.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-1">Aucun département dans ce pays.</p>
                      ) : (
                        depts.map((dept) => {
                          const isDeptOpen = !!expandedNodes[`dept-${dept.id_departement}`];
                          const communes = getCommunes(dept);

                          return (
                            <div
                              key={dept.id_departement}
                              className="border border-emerald-100 rounded-lg overflow-hidden"
                            >
                              {/* DEPT ROW */}
                              <div
                                onClick={() => toggleTreeNode(`dept-${dept.id_departement}`)}
                                className="p-2.5 bg-emerald-50/50 hover:bg-emerald-100/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <IconButton
                                    aria-label="Toggle Dept"
                                    icon={isDeptOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="green"
                                  />
                                  <MdListAlt className="text-emerald-600 text-base" />
                                  <span className="font-semibold text-xs text-gray-800">
                                    {dept.libelle_departement}
                                  </span>
                                  {dept.code_departement && (
                                    <span className="font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-emerald-200 text-emerald-700">
                                      {dept.code_departement}
                                    </span>
                                  )}
                                </div>

                                <Tag size="sm" colorScheme="green" variant="subtle">
                                  {communes.length} Communes
                                </Tag>
                              </div>

                              {/* COMMUNES LIST */}
                              {isDeptOpen && (
                                <div className="p-2.5 pl-6 bg-white space-y-2 border-t border-emerald-50">
                                  {communes.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic py-1">Aucune commune enregistrée.</p>
                                  ) : (
                                    communes.map((commune) => {
                                      const isCommuneOpen = !!expandedNodes[`commune-${commune.id_commune}`];
                                      const adrs = getAdresses(commune);

                                      return (
                                        <div
                                          key={commune.id_commune}
                                          className="border border-purple-100 rounded-md overflow-hidden"
                                        >
                                          {/* COMMUNE ROW */}
                                          <div
                                            onClick={() => toggleTreeNode(`commune-${commune.id_commune}`)}
                                            className="p-2 bg-purple-50/40 hover:bg-purple-100/40 cursor-pointer flex items-center justify-between gap-2"
                                          >
                                            <div className="flex items-center gap-2">
                                              <IconButton
                                                aria-label="Toggle Commune"
                                                icon={
                                                  isCommuneOpen ? (
                                                    <FaChevronDown size={9} />
                                                  ) : (
                                                    <FaChevronRight size={9} />
                                                  )
                                                }
                                                size="xs"
                                                variant="ghost"
                                                colorScheme="purple"
                                              />
                                              <FaCity className="text-purple-600 text-xs" />
                                              <span className="font-medium text-xs text-gray-800">
                                                {commune.libelle_commune}
                                              </span>
                                            </div>

                                            <Badge colorScheme="purple" variant="subtle" fontSize="10px">
                                              {adrs.length} adresses
                                            </Badge>
                                          </div>

                                          {/* ADRESSES LIST */}
                                          {isCommuneOpen && (
                                            <div className="p-2 pl-6 bg-gray-50/50 divide-y divide-gray-100 border-t border-purple-50">
                                              {adrs.length === 0 ? (
                                                <p className="text-xs text-gray-400 italic py-1">
                                                  Aucune adresse enregistrée.
                                                </p>
                                              ) : (
                                                adrs.map((adr) => (
                                                  <div
                                                    key={adr.id_adresses}
                                                    onClick={() => openAdresseModal(adr, commune.libelle_commune)}
                                                    className="py-1.5 flex items-center justify-between text-xs hover:text-blue-600 cursor-pointer"
                                                  >
                                                    <div className="flex items-center gap-2">
                                                      {getBuildingIcon(adr.type_batiment)}
                                                      <span>
                                                        {adr.numero_rue ? `${adr.numero_rue}, ` : ""}
                                                        {adr.libelle_adresse}
                                                      </span>
                                                      {adr.section_communale && (
                                                        <span className="text-gray-400 text-[11px]">
                                                          ({adr.section_communale})
                                                        </span>
                                                      )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                      {getStatusBadge(adr.statut)}
                                                      <span className="text-blue-600 hover:underline text-[11px] font-medium">
                                                        Détails &rarr;
                                                      </span>
                                                    </div>
                                                  </div>
                                                ))
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SPLIT MAP & HIERARCHY PREVIEW                                      */}
      {/* ========================================================================= */}
      {activeView === "map" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-base text-gray-900">Cartographie Synchronisée</h4>
              <p className="text-xs text-gray-500">
                Visualisez la répartition spatiale des adresses selon votre sélection actuelle :{" "}
                <span className="font-semibold text-blue-600">
                  {selectedCommune
                    ? `Commune de ${selectedCommune.libelle_commune}`
                    : selectedDept
                    ? `Département de ${selectedDept.libelle_departement}`
                    : selectedPays
                    ? `Pays : ${selectedPays.libelle_pays}`
                    : "Tous les pays"}
                </span>{" "}
                ({mapAdresses.length} repère{mapAdresses.length > 1 ? "s" : ""}).
              </p>
            </div>
            <Link href="/mapAdresse">
              <Button size="sm" colorScheme="blue" leftIcon={<FaExternalLinkAlt />}>
                Ouvrir la carte générale
              </Button>
            </Link>
          </div>

          <div className="h-[600px] w-full">
            <SubdivisionMap
              adresses={mapAdresses}
              selectedId={selectedAdresseId}
              onSelect={(id) => {
                setSelectedAdresseId(id);
                const found = mapAdresses.find((m) => m.adr.id_adresses === id);
                if (found) {
                  openAdresseModal(found.adr, found.communeName);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FICHE DÉTAILLÉE DE L'ADRESSE                                        */}
      {/* ========================================================================= */}
      {modalAdresse && (
        <Modal isOpen={isModalOpen} onClose={onModalClose} size="lg" isCentered>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent className="rounded-2xl overflow-hidden shadow-2xl">
            <ModalHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                  {getBuildingIcon(modalAdresse.type_batiment)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Fiche Adresse Référencée</h3>
                  <p className="text-xs text-blue-100 font-normal">
                    {modalCommuneName || "Commune"} • {modalAdresse.type_batiment || "Résidence"}
                  </p>
                </div>
              </div>
              <ModalCloseButton color="white" />
            </ModalHeader>

            <ModalBody className="p-6 space-y-4 bg-gray-50/50">
              {/* Main Address Card */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div>
                  <Text fontSize="xs" fontWeight="semibold" className="text-gray-400 uppercase tracking-wider">
                    Adresse Complète
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" className="text-gray-900 mt-0.5">
                    {modalAdresse.numero_rue ? `${modalAdresse.numero_rue}, ` : ""}
                    {formatValue(modalAdresse.libelle_adresse)}
                  </Text>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-500">Commune / Ville :</span>
                    <p className="font-semibold text-gray-900">{modalCommuneName || "Non spécifié"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Section Communale :</span>
                    <p className="font-semibold text-gray-900">
                      {formatValue(modalAdresse.section_communale)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Code Postal :</span>
                    <p className="font-mono font-semibold text-gray-900">
                      {formatValue(modalAdresse.code_postal)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Statut de validation :</span>
                    <div className="mt-0.5">{getStatusBadge(modalAdresse.statut)}</div>
                  </div>
                </div>
              </div>

              {/* Technical & Cadastral Details */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Clé d'unicité cadastrale :</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {formatValue(modalAdresse.cle_unicite)}
                    </span>
                    {modalAdresse.cle_unicite && (
                      <IconButton
                        aria-label="Copier la clé"
                        icon={<FaCopy size={11} />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(modalAdresse.cle_unicite || "", "Clé d'unicité")}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Type de bâtiment :</span>
                  <span className="font-semibold text-gray-900">
                    {modalAdresse.type_batiment || "Résidence standard"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Coordonnées GPS :</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-gray-700">
                      {modalAdresse.latitude && modalAdresse.longitude
                        ? `${modalAdresse.latitude.toFixed(5)}, ${modalAdresse.longitude.toFixed(5)}`
                        : "Coordonnées estimées sur le centre-ville"}
                    </span>
                    {modalAdresse.latitude && modalAdresse.longitude && (
                      <IconButton
                        aria-label="Copier GPS"
                        icon={<FaCopy size={11} />}
                        size="xs"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(
                            `${modalAdresse.latitude}, ${modalAdresse.longitude}`,
                            "Coordonnées GPS"
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="bg-white border-t border-gray-100 flex items-center justify-between">
              <Button size="sm" variant="ghost" onClick={onModalClose}>
                Fermer
              </Button>
              <div className="flex items-center gap-2">
                <Link href={`/adresses/${modalAdresse.id_adresses}`}>
                  <Button size="sm" colorScheme="blue" leftIcon={<FaExternalLinkAlt />}>
                    Consulter la fiche complète
                  </Button>
                </Link>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default SubdivisionGeographique;
