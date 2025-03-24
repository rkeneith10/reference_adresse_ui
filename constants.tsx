import { FaHome, FaMapMarkerAlt, FaMapPin, FaMapSigns, FaRegFlag } from "react-icons/fa";
import { FaTreeCity } from "react-icons/fa6";

import { MdListAlt } from "react-icons/md";


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
    title: "Adresses",
    path: "/adresses",
    icon: <FaMapMarkerAlt size={20} />,
  },
  {
    title: "Map",
    path: "/mapAdresse",
    icon: <FaMapPin size={20} />,
  },

];
