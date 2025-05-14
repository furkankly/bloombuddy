"use client";

import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function WorldMap({
  coordinates,
  setCoordinates,
}: {
  coordinates: {
    lat: number;
    lng: number;
  };
  setCoordinates: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make sure Leaflet is only initialized on the client side
    if (
      typeof window !== "undefined" &&
      !mapRef.current &&
      mapContainerRef.current
    ) {
      // Initialize the map
      mapRef.current = L.map(mapContainerRef.current).setView(
        [coordinates.lat, coordinates.lng],
        6,
      );

      // Add the tile layer (map imagery)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: "dark-map-tiles", // Add this class for styling
      }).addTo(mapRef.current);

      // Add click event to the map
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setCoordinates({
          lat: Number.parseFloat(lat.toFixed(6)),
          lng: Number.parseFloat(lng.toFixed(6)),
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates.lat, coordinates.lng, setCoordinates]);

  return (
    <div className="flex flex-col">
      <div
        ref={mapContainerRef}
        className="h-[500px] w-full rounded-lg border-2 border-purple-500 shadow-lg overflow-hidden"
      />

      {coordinates && (
        <div className="p-4 bg-gray-900 rounded-lg border-2 border-purple-500 text-white">
          <h2 className="text-lg font-medium mb-2 text-purple-300">
            Coordinates
          </h2>
          <p>
            <span className="font-semibold text-purple-300">Latitude:</span>{" "}
            {coordinates.lat}
          </p>
          <p>
            <span className="font-semibold text-purple-300">Longitude:</span>{" "}
            {coordinates.lng}
          </p>
          <p className="text-sm text-purple-200 mt-2">
            Copy these coordinates or click another location on the map.
          </p>
        </div>
      )}
    </div>
  );
}
