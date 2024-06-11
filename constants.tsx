import { FaCity, FaHome, FaMapMarkerAlt, FaRegFlag } from "react-icons/fa";
import { FaTreeCity } from "react-icons/fa6";

import { MdListAlt } from "react-icons/md";

import { RiBuilding2Line } from "react-icons/ri";

import { BiMapPin } from "react-icons/bi";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Tableau de bord",
    path: "/dashboard",
    icon: <FaHome size={20} />,
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
    title: "Arrondissements",
    path: "/arrondissements",
    icon: <BiMapPin size={20} />,
  },
  {
    title: "Communes",
    path: "/communes",
    icon: <FaTreeCity size={20} />,
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
    icon: <FaCity size={20} />,
  },
  {
    title: "Immeubles",
    path: "/immeubles",
    icon: <RiBuilding2Line size={20} />,
  },
];
