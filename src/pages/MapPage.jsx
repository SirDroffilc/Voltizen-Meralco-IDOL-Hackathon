"use client";
import { useState, useMemo, useEffect } from "react";
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
  X,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from "lucide-react";

import {
  addAnnouncement,
  getAllAnnouncements,
  getAnnouncementImageURL,
} from "../firebaseServices/database/announcementsFunctions";
import {
  addOutage,
  getAllOutages,
  incrementOutageUpvoteCount,
  incrementOutageDownvoteCount,
} from "../firebaseServices/database/outagesFunctions";
import {
  addReport,
  getAllReports,
  incrementReportUpvoteCount,
  incrementReportDownvoteCount,
  getReportImageURL,
} from "../firebaseServices/database/reportsFunctions";

import useAuth from "../firebaseServices/auth/useAuth";

delete L.Icon.Default.prototype._getIconUrl;

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

const getModeLabel = (mode) =>
  ({
    report: "User Report",
    hazard: "Outage/Hazard",
    announcement: "Announcement",
  }[mode] || "None");

const initialFormData = {
  title: "",
  description: "",
  imageFile: null,
  isPlanned: false,
  startTime: "",
  endTime: "",
};

function DefaultSidebarPanel() {
  return (
    <div className="sidebar-default-content">
      <div className="logo-header">
        <Zap className="volt-logo" size={32} />
        <h1 className="voltizen-title">Voltizen</h1>
      </div>
      <p>Uniting Community & Consumption.</p>
      <p>Click a pin to see details or add your own report.</p>
    </div>
  );
}

function MarkerDetailsPanel({ marker, onUpvote, onDownvote }) {
  const {
    type,
    title,
    description,
    reporterName,
    responseStatus,
    approvalStatus,
    upvoteCount,
    downvoteCount,
    pos,
    imageUrl,
    imageURL,
    isPlanned,
    startTime,
    endTime,
  } = marker;

  const headerClass =
    {
      report: "header-report",
      hazard: "header-hazard",
      announcement: "header-announcement",
    }[type] || "";

  const finalImageUrl = imageURL || imageUrl;

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    let date;
    if (ts.toDate) {
      date = ts.toDate();
    } else if (typeof ts === "string" || typeof ts === "number") {
      date = new Date(ts);
    } else {
      return "Invalid Date";
    }
    return date.toLocaleString();
  };

  return (
    <div className="marker-data-display">
      <h1 className={headerClass}>{title || getModeLabel(type)}</h1>

      {type !== "announcement" && (
        <div className="vote-controls">
          <button onClick={onUpvote} aria-label="Upvote">
            <ArrowUp size={20} />
          </button>
          <span>{upvoteCount || 0}</span>
          <button onClick={onDownvote} aria-label="Downvote">
            <ArrowDown size={20} />
          </button>
          <span>{downvoteCount || 0}</span>
        </div>
      )}

      {finalImageUrl && (
        <div className="marker-image-wrapper">
          <img src={finalImageUrl} alt={title || "Marker Image"} />
        </div>
      )}

      <div className="details">
        <h4>Details</h4>
        <p>{description || "No description provided."}</p>
        {type === "hazard" && (
          <p>
            <strong>Type:</strong> {isPlanned ? "Planned" : "Unplanned"}
          </p>
        )}
        {(type === "announcement" || (type === "hazard" && isPlanned)) && (
          <>
            <p>
              <strong>Starts:</strong> {formatTimestamp(startTime)}
            </p>
            <p>
              <strong>Ends:</strong> {formatTimestamp(endTime)}
            </p>
          </>
        )}
      </div>

      <div className="status">
        {reporterName && (
          <p>
            <strong>Reporter:</strong> {reporterName}
          </p>
        )}
        {responseStatus && (
          <p>
            <strong>Status:</strong> {responseStatus}
          </p>
        )}
        {approvalStatus && (
          <p>
            <strong>Approval:</strong> {approvalStatus}
          </p>
        )}
      </div>

      <div className="location">
        <h4>Location</h4>
        <p>
          <strong>Latitude:</strong> {pos.lat.toFixed(5)}
        </p>
        <p>
          <strong>Longitude:</strong> {pos.lng.toFixed(5)}
        </p>
      </div>
    </div>
  );
}

function Sidebar({ selectedMarker, onUpvote, onDownvote }) {
  return (
    <aside className="info-sidebar">
      <div className="sidebar-content-wrapper">
        <div className="sidebar-section">
          {selectedMarker ? (
            <MarkerDetailsPanel
              marker={selectedMarker}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
            />
          ) : (
            <DefaultSidebarPanel />
          )}
        </div>
      </div>
    </aside>
  );
}

function AddPinModal({ isOpen, onClose, onSubmit, markerInfo, currentUserRole }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  if (!isOpen || !markerInfo) return null;

  const { type } = markerInfo;

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const { pos } = markerInfo;
    const { title, description, isPlanned, startTime, endTime, imageFile } =
      formData;

    const location = { lat: pos.lat, lng: pos.lng };
    let finalImageURL = null;

    try {
      if (imageFile) {
        if (type === "report") {
          finalImageURL = await getReportImageURL(imageFile);
        } else if (type === "announcement") {
          finalImageURL = await getAnnouncementImageURL(imageFile);
        }
      }

      const payload = {
        title,
        description,
        location,
        imageURL: finalImageURL,
        isPlanned: currentUserRole === "admin" ? isPlanned : false,
        startTime: startTime || null,
        endTime: endTime || null,
      };

      await onSubmit(type, payload);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsUploading(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>Add {getModeLabel(type)}</h3>
            <button
              type="button"
              onClick={onClose}
              className="modal-close-button"
              disabled={isUploading}
            >
              <X size={24} />
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
              disabled={isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="4"
              required
              disabled={isUploading}
            ></textarea>
          </div>

          {(type === "report" || type === "announcement") && (
            <div className="form-group">
              <label htmlFor="imageFile">Image (Optional)</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          )}

          {type === "hazard" && currentUserRole === "admin" && (
            <div className="form-group-checkbox">
              <input
                type="checkbox"
                id="isPlanned"
                name="isPlanned"
                checked={formData.isPlanned}
                onChange={handleFormChange}
                disabled={isUploading}
              />
              <label htmlFor="isPlanned">Is this a planned outage?</label>
            </div>
          )}

          {(type === "announcement" ||
            (type === "hazard" && formData.isPlanned)) && (
            <>
              <div className="form-group">
                <label htmlFor="startTime">Start Time (Optional)</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  disabled={isUploading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endTime">End Time (Optional)</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleFormChange}
                  disabled={isUploading}
                />
              </div>
            </>
          )}

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isUploading}
            >
              {isUploading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ZoomControls({ onZoomIn, onZoomOut }) {
  return (
    <div className="control-group zoom-controls">
      <button
        onClick={onZoomIn}
        className="map-button-circle"
        title="Zoom In"
        aria-label="Zoom in"
      >
        <Plus size={24} />
      </button>
      <button
        onClick={onZoomOut}
        className="map-button-circle"
        title="Zoom Out"
        aria-label="Zoom out"
      >
        <Minus size={24} />
      </button>
    </div>
  );
}

function PinMenu({ onSetMode, userRole }) {
  const [isPinMenuOpen, setIsPinMenuOpen] = useState(false);

  const handleSetMode = (mode) => {
    onSetMode(mode);
    setIsPinMenuOpen(false);
  };

  return (
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
          onClick={() => handleSetMode("report")}
        >
          <Flag size={20} />
        </button>
        <button
          className="map-button-circle mode-button hazard"
          title="Add Outage/Hazard"
          aria-label="Add outage/hazard pin"
          onClick={() => handleSetMode("hazard")}
        >
          <TriangleAlert size={20} />
        </button>
        {userRole === "admin" && (
          <button
            className="map-button-circle mode-button announcement"
            title="Add Announcement"
            aria-label="Add announcement pin"
            onClick={() => handleSetMode("announcement")}
          >
            <Megaphone size={20} />
          </button>
        )}
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
  );
}

function LayerMenu({ onSetLayer }) {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  const handleSetLayer = (layer) => {
    onSetLayer(layer);
    setIsLayerMenuOpen(false);
  };

  return (
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
  );
}

function MapControls({
  markerMode,
  onSetMode,
  onZoomIn,
  onZoomOut,
  onSetLayer,
  userRole,
}) {
  return (
    <div className="controls-bottom-right">
      {markerMode !== "none" && (
        <div className="current-mode-notice">
          Adding: <strong>{getModeLabel(markerMode)}</strong>
          <button onClick={() => onSetMode("none")} aria-label="Cancel adding pin">
            (Cancel)
          </button>
        </div>
      )}

      <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      <PinMenu onSetMode={onSetMode} userRole={userRole} />
      <LayerMenu onSetLayer={onSetLayer} />
    </div>
  );
}

function Toast({ isVisible }) {
  if (!isVisible) return null;
  return (
    <div className="pin-toast" aria-live="polite">
      <CheckCircle2 size={18} /> Pin added
    </div>
  );
}

export default function MapPage() {
  const { user, firestoreUser } = useAuth();
  const userRole = firestoreUser?.userRole || "regular";

  const [reports, setReports] = useState([]);
  const [outages, setOutages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerMode, setMarkerMode] = useState("none");
  const [currentLayer, setCurrentLayer] = useState(mapLayers.light);
  const [toastVisible, setToastVisible] = useState(false);
  const [map, setMap] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMarkerInfo, setNewMarkerInfo] = useState(null);

  const defaultCenter = [14.72026, 120.93051];
  const zoom = 15;

  useEffect(() => {
    const listeners = [];

    const setupListeners = async () => {
      try {
        const unsubReports = await getAllReports(setReports, console.error);
        const unsubOutages = await getAllOutages(setOutages, console.error);
        const unsubAnnouncements = await getAllAnnouncements(
          setAnnouncements,
          console.error
        );
        listeners.push(unsubReports, unsubOutages, unsubAnnouncements);
      } catch (err) {
        console.error("Failed to set up listeners:", err);
      }
    };

    setupListeners();

    return () => {
      listeners.forEach((unsub) => unsub());
    };
  }, []);

  const allMarkers = useMemo(() => {
    const reportMarkers = reports
      .filter((r) => r.location?.latitude && r.location?.longitude)
      .map((r) => ({
        ...r,
        id: r.id,
        pos: { lat: r.location.latitude, lng: r.location.longitude },
        type: "report",
      }));

    const hazardMarkers = outages
      .filter((o) => o.location?.latitude && o.location?.longitude)
      .map((o) => ({
        ...o,
        id: o.id,
        pos: { lat: o.location.latitude, lng: o.location.longitude },
        type: "hazard",
      }));

    const announcementMarkers = announcements
      .filter((a) => a.location?.latitude && a.location?.longitude)
      .map((a) => ({
        ...a,
        id: a.id,
        pos: { lat: a.location.latitude, lng: a.location.longitude },
        type: "announcement",
      }));

    return {
      report: reportMarkers,
      hazard: hazardMarkers,
      announcement: announcementMarkers,
    };
  }, [reports, outages, announcements]);

  const zoomIn = () => map && map.zoomIn();
  const zoomOut = () => map && map.zoomOut();

  const handleSetMarkerMode = (mode) => {
    setMarkerMode(mode);
    setSelectedMarker(null);
  };

  const openAddMarkerModal = (latlng) => {
    setNewMarkerInfo({ pos: latlng, type: markerMode });
    setIsModalOpen(true);
    setMarkerMode("none");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewMarkerInfo(null);
  };

  const handleFormSubmit = async (type, payload) => {
    if (!user) return;

    try {
      if (type === "report") {
        await addReport({
          ...payload,
          reporterId: user.uid,
          reporterName: firestoreUser?.displayName || user.displayName,
        });
      } else if (type === "hazard") {
        await addOutage({
          ...payload,
          reporterId: user.uid,
          reporterName: firestoreUser?.displayName || user.displayName,
        });
      } else if (type === "announcement" && userRole === "admin") {
        await addAnnouncement({
          ...payload,
          userId: user.uid,
        });
      }

      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1200);
    } catch (error) {
      console.error("Failed to add marker:", error);
    }
  };

  const handleUpvote = async () => {
    if (!selectedMarker || !user) return;
    const { id, type } = selectedMarker;
    try {
      if (type === "report") {
        await incrementReportUpvoteCount(id);
      } else if (type === "hazard") {
        await incrementOutageUpvoteCount(id);
      }
    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };

  const handleDownvote = async () => {
    if (!selectedMarker || !user) return;
    const { id, type } = selectedMarker;
    try {
      if (type === "report") {
        await incrementReportDownvoteCount(id);
      } else if (type === "hazard") {
        await incrementOutageDownvoteCount(id);
      }
    } catch (error) {
      console.error("Downvote failed:", error);
    }
  };

  const handleSetLayer = (layer) => {
    setCurrentLayer(layer);
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    if (map) {
      map.flyTo(marker.pos, map.getZoom());
    }
  };

  return (
    <div className="map-page-container">
      <AddPinModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        markerInfo={newMarkerInfo}
        currentUserRole={userRole}
      />

      <Sidebar
        selectedMarker={selectedMarker}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />

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

          <MapClickHandler
            onMapClick={openAddMarkerModal}
            markerMode={markerMode}
          />

          <MarkerClusterGroup
            className="report-cluster-group"
            iconCreateFunction={createCustomClusterIcon("report-cluster-group")}
          >
            {allMarkers.report.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.pos}
                icon={icons[marker.type]}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
                }}
              />
            ))}
          </MarkerClusterGroup>

          <MarkerClusterGroup
            className="hazard-cluster-group"
            iconCreateFunction={createCustomClusterIcon("hazard-cluster-group")}
          >
            {allMarkers.hazard.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.pos}
                icon={icons[marker.type]}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
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
            {allMarkers.announcement.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.pos}
                icon={icons[marker.type]}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
                }}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        <Toast isVisible={toastVisible} />

        <MapControls
          markerMode={markerMode}
          onSetMode={handleSetMarkerMode}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onSetLayer={handleSetLayer}
          userRole={userRole}
        />
      </main>
    </div>
  );
}