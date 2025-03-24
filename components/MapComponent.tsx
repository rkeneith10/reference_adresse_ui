"use client"
import { AdresseAttributes } from '@/app/api/models/adresseModel';
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Loader from './loader';


const customIcon: L.DivIcon = new L.DivIcon({
  className: 'custom-icon',
  html: '<div style="font-size: 24px; color: red; display: flex; justify-content: center; align-items: center;"><svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div>',
  iconSize: [30, 41],
  iconAnchor: [15, 41],
});

const MapComponent = () => {
  const [adresses, setAdresses] = useState<AdresseAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/adresseCtrl");
        setAdresses(response.data.data);
        setLoading(false)
        console.log(adresses)
      } catch (error) {
        console.error("Erreur lors de la récupération des adresses", error);
      }
    };

    fetchAddresses();
  }, []);
  return (

    <div>
      {
        !loading ? (
          <MapContainer center={[18.532, -72.333]} zoom={8} style={{ height: "700px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {adresses.map((adresse) => {

              const lat = adresse.latitude ? adresse.latitude : null;
              const lon = adresse.longitude ? adresse.longitude : null;


              if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
                return (
                  <Marker
                    key={adresse.id_adresses}
                    position={[lat, lon]}
                    icon={customIcon}
                  >
                    <Popup>
                      <strong>{adresse.libelle_adresse}</strong>
                      <br />
                      {adresse.numero_rue}, {adresse.section_communale}
                      <br />
                      {adresse.code_postal ? `Code Postal: ${adresse.code_postal}` : ""}
                    </Popup>
                  </Marker>
                );
              }
              return null; // Skip rendering if coordinates are invalid
            })}
          </MapContainer>
        ) : (
          <Loader />
        )
      }
    </div>
  )
}

export default MapComponent
