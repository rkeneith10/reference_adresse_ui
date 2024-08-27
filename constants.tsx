import { FaCity, FaHome, FaMapMarkerAlt, FaMapSigns, FaQuestionCircle, FaRegFlag } from "react-icons/fa";
import { FaTreeCity } from "react-icons/fa6";

import { MdListAlt, MdStreetview } from "react-icons/md";

import { RiBuilding2Line } from "react-icons/ri";

import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Tableau de bord",
    path: "/dashboard",
    icon: <FaHome size={20} />,
  },
  {
    title: "Subdivision Geographique",
    path: "/subdivision",
    icon: <FaMapSigns size={20} />,
  },
  {
    title: "Pays",
    path: "/pays",
    icon: <FaRegFlag size={20} />,
  },
  {
    title: "Departements",
    path: "/departements",
    icon: <MdListAlt size={20} />,
  },

  {
    title: "Communes",
    path: "/communes",
    icon: <FaTreeCity size={20} />,
  },
  {
    title: "Villes",
    path: "/villes",
    icon: <FaCity size={20} />,
  },
  {
    title: "Sections Communales",
    path: "/sectioncommunales",
    icon: <MdListAlt size={26} />,
  },
  {
    title: "Adresses",
    path: "/adresses",
    icon: <FaMapMarkerAlt size={20} />,
  },
  {
    title: "Quartiers",
    path: "/quartiers",
    icon: <MdStreetview size={20} />,
  },
  {
    title: "Immeubles",
    path: "/immeubles",
    icon: <RiBuilding2Line size={20} />,
  },

  {
    title: "Aide",
    path: "/aide",
    icon: <FaQuestionCircle size={20} />,
  },
];
