"use client";
import { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "./MapPage.css";
import {
  Plus,
  Minus,
  Flag,
  TriangleAlert,
  Megaphone,
  Map as MapIcon,
  Satellite,
  Moon,
  Pin,
  Layers,
  Sun,
  Mountain,
  Palette,
  Zap,
  CheckCircle2,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;

const initialMarkers = [
  { id: "1", pos: { lat: 14.71719, lng: 120.90542 }, type: "report" },
  { id: "2", pos: { lat: 14.71575, lng: 120.90683 }, type: "announcement" },
  { id: "3", pos: { lat: 14.72964, lng: 120.92332 }, type: "hazard" },
  { id: "4", pos: { lat: 14.72441, lng: 120.92713 }, type: "hazard" },
  { id: "5", pos: { lat: 14.73313, lng: 120.92845 }, type: "announcement" },
  { id: "6", pos: { lat: 14.73563, lng: 120.91901 }, type: "report" },
  { id: "7", pos: { lat: 14.72097, lng: 120.92999 }, type: "report" },
  { id: "8", pos: { lat: 14.71255, lng: 120.93589 }, type: "hazard" },
  { id: "9", pos: { lat: 14.72091, lng: 120.94403 }, type: "announcement" },
  { id: "10", pos: { lat: 14.71084, lng: 120.94349 }, type: "report" },
  { id: "gen-1", pos: { lat: 14.75545, lng: 121.04108 }, type: "report" },
  { id: "gen-2", pos: { lat: 14.71186, lng: 121.00693 }, type: "hazard" },
  { id: "gen-3", pos: { lat: 14.73967, lng: 121.03126 }, type: "report" },
  { id: "gen-4", pos: { lat: 14.73801, lng: 121.02058 }, type: "report" },
  { id: "gen-5", pos: { lat: 14.77196, lng: 121.03681 }, type: "announcement" },
  { id: "gen-6", pos: { lat: 14.72145, lng: 121.01859 }, type: "hazard" },
  { id: "gen-7", pos: { lat: 14.73335, lng: 121.01772 }, type: "report" },
  { id: "gen-8", pos: { lat: 14.75704, lng: 121.02026 }, type: "announcement" },
  { id: "gen-9", pos: { lat: 14.72061, lng: 120.99221 }, type: "hazard" },
  { id: "gen-10", pos: { lat: 14.72248, lng: 120.97022 }, type: "report" },
  { id: "gen-11", pos: { lat: 14.71404, lng: 120.99971 }, type: "report" },
  { id: "gen-12", pos: { lat: 14.70617, lng: 120.97545 }, type: "announcement" },
  { id: "gen-13", pos: { lat: 14.77372, lng: 121.01855 }, type: "announcement" },
  { id: "gen-14", pos: { lat: 14.70884, lng: 120.97059 }, type: "hazard" },
  { id: "gen-15", pos: { lat: 14.69707, lng: 121.00414 }, type: "report" },
  { id: "gen-16", pos: { lat: 14.72141, lng: 121.02534 }, type: "announcement" },
  { id: "gen-17", pos: { lat: 14.76717, lng: 121.05432 }, type: "report" },
  { id: "gen-18", pos: { lat: 14.73837, lng: 121.02462 }, type: "hazard" },
  { id: "gen-19", pos: { lat: 14.75626, lng: 121.01168 }, type: "hazard" },
  { id: "gen-20", pos: { lat: 14.74026, lng: 121.01287 }, type: "hazard" },
  { id: "gen-21", pos: { lat: 14.72087, lng: 120.98501 }, type: "report" },
  { id: "gen-22", pos: { lat: 14.71449, lng: 120.98402 }, type: "hazard" },
  { id: "gen-23", pos: { lat: 14.7188, lng: 121.05318 }, type: "announcement" },
  { id: "gen-24", pos: { lat: 14.70932, lng: 120.99395 }, type: "hazard" },
  { id: "gen-25", pos: { lat: 14.7132, lng: 121.00259 }, type: "hazard" },
  { id: "gen-26", pos: { lat: 14.74315, lng: 121.02237 }, type: "announcement" },
  { id: "gen-27", pos: { lat: 14.72152, lng: 120.99908 }, type: "report" },
  { id: "gen-28", pos: { lat: 14.77443, lng: 120.97864 }, type: "announcement" },
  { id: "gen-29", pos: { lat: 14.7219, lng: 121.03608 }, type: "report" },
  { id: "gen-30", pos: { lat: 14.75475, lng: 121.05282 }, type: "report" },
  { id: "gen-31", pos: { lat: 14.7027, lng: 120.99127 }, type: "announcement" },
  { id: "gen-32", pos: { lat: 14.71811, lng: 121.01358 }, type: "report" },
  { id: "gen-33", pos: { lat: 14.73977, lng: 121.02872 }, type: "hazard" },
  { id: "gen-34", pos: { lat: 14.72049, lng: 121.00032 }, type: "hazard" },
  { id: "gen-35", pos: { lat: 14.7766, lng: 121.02562 }, type: "report" },
  { id: "gen-36", pos: { lat: 14.75135, lng: 121.02324 }, type: "hazard" },
  { id: "gen-37", pos: { lat: 14.71261, lng: 121.04318 }, type: "announcement" },
  { id: "gen-38", pos: { lat: 14.74411, lng: 121.05602 }, type: "hazard" },
  { id: "gen-39", pos: { lat: 14.72393, lng: 121.00683 }, type: "report" },
  { id: "gen-40", pos: { lat: 14.73016, lng: 120.99341 }, type: "report" },
  { id: "gen-41", pos: { lat: 14.74208, lng: 121.00332 }, type: "announcement" },
  { id: "gen-42", pos: { lat: 14.76106, lng: 121.03936 }, type: "hazard" },
  { id: "gen-43", pos: { lat: 14.767, lng: 121.04786 }, type: "report" },
  { id: "gen-44", pos: { lat: 14.70341, lng: 121.04764 }, type: "hazard" },
  { id: "gen-45", pos: { lat: 14.71262, lng: 121.05831 }, type: "announcement" },
  { id: "gen-46", pos: { lat: 14.71221, lng: 120.99723 }, type: "hazard" },
  { id: "gen-47", pos: { lat: 14.70365, lng: 120.98188 }, type: "report" },
  { id: "gen-48", pos: { lat: 14.76451, lng: 120.9856 }, type: "announcement" },
  { id: "gen-49", pos: { lat: 14.75419, lng: 121.0487 }, type: "hazard" },
  { id: "gen-50", pos: { lat: 14.70425, lng: 121.03478 }, type: "report" },
  { id: "gen-51", pos: { lat: 14.7454, lng: 121.03525 }, type: "announcement" },
  { id: "gen-52", pos: { lat: 14.77708, lng: 120.9701 }, type: "announcement" },
  { id: "gen-53", pos: { lat: 14.73646, lng: 120.97371 }, type: "announcement" },
  { id: "gen-54", pos: { lat: 14.74104, lng: 120.97453 }, type: "report" },
  { id: "gen-55", pos: { lat: 14.75783, lng: 121.01344 }, type: "announcement" },
  { id: "gen-56", pos: { lat: 14.74316, lng: 121.05191 }, type: "hazard" },
  { id: "gen-57", pos: { lat: 14.73718, lng: 121.03141 }, type: "report" },
  { id: "gen-58", pos: { lat: 14.71181, lng: 121.02636 }, type: "report" },
  { id: "gen-59", pos: { lat: 14.7247, lng: 121.00414 }, type: "announcement" },
  { id: "gen-60", pos: { lat: 14.71539, lng: 121.03126 }, type: "hazard" },
];

const createIcon = (color) => {
  const markerHtml = `<svg viewBox="0 0 32 32" class="marker-svg" style="fill:${color};"><path d="M16 0C10.486 0 6 4.486 6 10c0 5.515 10 22 10 22s10-16.485 10-22C26 4.486 21.514 0 16 0zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/></svg>`;
  return new L.DivIcon({
    html: markerHtml,
    className: "custom-div-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const icons = {
  report: createIcon("#d81916"),
  hazard: createIcon("#13dca3"),
  announcement: createIcon("#faca46"),
};

const mapLayers = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
  },
  toner: {
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  },
};

const labelsLayerUrl =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";
const labelsLayerAttribution = "&copy; Esri &mdash; Boundaries & Places";

function MapClickHandler({ onMapClick, markerMode }) {
  useMapEvents({
    click(e) {
      if (markerMode !== "none") onMapClick(e.latlng);
    },
  });
  return null;
}

const createCustomClusterIcon = (className) => {
  return function (cluster) {
    const count = cluster.getChildCount();
    let size = "marker-cluster-small";
    if (count >= 10) {
      size = "marker-cluster-medium";
    } else if (count >= 100) {
      size = "marker-cluster-large";
    }

    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster ${size} ${className}`,
      iconSize: [40, 40],
    });
  };
};

export default function MapPage() {
  const [markers, setMarkers] = useState(initialMarkers);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerMode, setMarkerMode] = useState("none");
  const [currentLayer, setCurrentLayer] = useState(mapLayers.light);
  const [isPinMenuOpen, setIsPinMenuOpen] = useState(false);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [map, setMap] = useState(null);

  const defaultCenter = [14.72026, 120.93051];
  const zoom = 15;

  const reportMarkers = useMemo(
    () => markers.filter((m) => m.type === "report"),
    [markers]
  );
  const hazardMarkers = useMemo(
    () => markers.filter((m) => m.type === "hazard"),
    [markers]
  );
  const announcementMarkers = useMemo(
    () => markers.filter((m) => m.type === "announcement"),
    [markers]
  );

  const zoomIn = () => map && map.zoomIn();
  const zoomOut = () => map && map.zoomOut();

  const handleAddMarker = (latlng) => {
    const newMarker = { id: crypto.randomUUID(), pos: latlng, type: markerMode };
    setMarkers((prev) => [...prev, newMarker]);
    setMarkerMode("none");
    setSelectedMarker(newMarker);
    setIsPinMenuOpen(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1200);
  };

  const handleSetLayer = (layer) => {
    setCurrentLayer(layer);
    setIsLayerMenuOpen(false);
  };
  const handleSetMarkerMode = (mode) => {
    setMarkerMode(mode);
    setIsPinMenuOpen(false);
  };
  const getModeLabel = (mode) =>
    ({
      report: "User Report",
      hazard: "Hazard/Outage",
      announcement: "Announcement",
    }[mode] || "None");
  const getMarkerDescription = (type) =>
    ({
      report: "A user has reported a potential issue in this area.",
      hazard: "Warning: A confirmed hazard is at this location.",
      announcement:
        "An official announcement or maintenance notice is active.",
    }[type] || "Details for this pin.");
  const getMarkerHeaderClass = (type) =>
    ({
      report: "header-report",
      hazard: "header-hazard",
      announcement: "header-announcement",
    }[type] || "");

  return (
    <div className="map-page-container">
      <aside className="info-sidebar">
        <div className="sidebar-content-wrapper">
          <div className="sidebar-section">
            {selectedMarker ? (
              <div className="marker-data-display">
                <h1 className={getMarkerHeaderClass(selectedMarker.type)}>
                  {getModeLabel(selectedMarker.type)}
                </h1>
                <div className="details">
                  <h4>Details</h4>
                  <p>{getMarkerDescription(selectedMarker.type)}</p>
                </div>
                <div className="location">
                  <h4>Location</h4>
                  <p>
                    <strong>Latitude:</strong> {selectedMarker.pos.lat.toFixed(5)}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {selectedMarker.pos.lng.toFixed(5)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="sidebar-default-content">
                <div className="logo-header">
                  <Zap className="volt-logo" size={32} />
                  <h1 className="voltizen-title">Voltizen</h1>
                </div>
                <p>Uniting Community & Consumption.</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="map-content">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          minZoom={3}
          maxZoom={18}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={setMap}
          className={markerMode !== "none" ? "crosshair-cursor" : ""}
        >
          <TileLayer
            key={currentLayer.url}
            attribution={currentLayer.attribution}
            url={currentLayer.url}
          />
          {currentLayer === mapLayers.satellite && (
            <TileLayer
              attribution={labelsLayerAttribution}
              url={labelsLayerUrl}
              zIndex={10}
            />
          )}
          <MapClickHandler onMapClick={handleAddMarker} markerMode={markerMode} />

          <MarkerClusterGroup
            className="report-cluster-group"
            iconCreateFunction={createCustomClusterIcon("report-cluster-group")}
          >
            {reportMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.pos}
                icon={icons[marker.type]}
                eventHandlers={{
                  click: () => setSelectedMarker(marker),
                }}
              />
            ))}
          </MarkerClusterGroup>

          <MarkerClusterGroup
            className="hazard-cluster-group"
            iconCreateFunction={createCustomClusterIcon("hazard-cluster-group")}
          >
            {hazardMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.pos}
                icon={icons[marker.type]}
                eventHandlers={{
                  click: () => setSelectedMarker(marker),
                }}
              />
            ))}
          </MarkerClusterGroup>

          <MarkerClusterGroup
            className="announcement-cluster-group"
            iconCreateFunction={createCustomClusterIcon(
              "announcement-cluster-group"
            )}
          >
            {announcementMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.pos}
                icon={icons[marker.type]}
                eventHandlers={{
                  click: () => setSelectedMarker(marker),
                }}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {toastVisible && (
          <div className="pin-toast" aria-live="polite">
            <CheckCircle2 size={18} /> Pin added
          </div>
        )}

        <div className="controls-bottom-right">
          {markerMode !== "none" && (
            <div className="current-mode-notice">
              Adding: <strong>{getModeLabel(markerMode)}</strong>
              <button
                onClick={() => setMarkerMode("none")}
                aria-label="Cancel adding pin"
              >
                (Cancel)
              </button>
            </div>
          )}

          <div className="control-group zoom-controls">
            <button
              onClick={zoomIn}
              className="map-button-circle"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <Plus size={24} />
            </button>
            <button
              onClick={zoomOut}
              className="map-button-circle"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <Minus size={24} />
            </button>
          </div>

          <div
            className={`control-group expandable-menu ${
              isPinMenuOpen ? "menu-open" : ""
            }`}
          >
            <div className="sub-buttons">
              <button
                className="map-button-circle mode-button report"
                title="Add User Report"
                aria-label="Add report pin"
                onClick={() => handleSetMarkerMode("report")}
              >
                <Flag size={20} />
              </button>
              <button
                className="map-button-circle mode-button hazard"
                title="Add Hazard"
                aria-label="Add hazard pin"
                onClick={() => handleSetMarkerMode("hazard")}
              >
                <TriangleAlert size={20} />
              </button>
              <button
                className="map-button-circle mode-button announcement"
                title="Add Announcement"
                aria-label="Add announcement pin"
                onClick={() => handleSetMarkerMode("announcement")}
              >
                <Megaphone size={20} />
              </button>
            </div>
            <button
              className="map-button-circle menu-toggle-button toggle-pins"
              title="Add Pin"
              aria-label="Toggle pin menu"
              onClick={() => setIsPinMenuOpen(!isPinMenuOpen)}
            >
              <Pin size={20} />
            </button>
          </div>

          <div
            className={`control-group expandable-menu ${
              isLayerMenuOpen ? "menu-open" : ""
            }`}
          >
            <div className="sub-buttons">
              <button
                className="map-button-circle layer-button"
                title="Light Map"
                aria-label="Light map"
                onClick={() => handleSetLayer(mapLayers.light)}
              >
                <Sun size={20} />
              </button>
              <button
                className="map-button-circle layer-button"
                title="Street Map"
                aria-label="Street map"
                onClick={() => handleSetLayer(mapLayers.street)}
              >
                <MapIcon size={20} />
              </button>
              <button
                className="map-button-circle layer-button"
                title="B&W Map"
                aria-label="B&W map"
                onClick={() => handleSetLayer(mapLayers.toner)}
              >
                <Palette size={20} />
              </button>
              <button
                className="map-button-circle layer-button"
                title="Terrain Map"
                aria-label="Terrain map"
                onClick={() => handleSetLayer(mapLayers.terrain)}
              >
                <Mountain size={20} />
              </button>
              <button
                className="map-button-circle layer-button"
                title="Satellite Map"
                aria-label="Satellite map"
                onClick={() => handleSetLayer(mapLayers.satellite)}
              >
                <Satellite size={20} />
              </button>
              <button
                className="map-button-circle layer-button"
                title="Dark Map"
                aria-label="Dark map"
                onClick={() => handleSetLayer(mapLayers.dark)}
              >
                <Moon size={20} />
              </button>
            </div>
            <button
              className="map-button-circle menu-toggle-button toggle-layers"
              title="Change Layer"
              aria-label="Toggle layer menu"
              onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            >
              <Layers size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}