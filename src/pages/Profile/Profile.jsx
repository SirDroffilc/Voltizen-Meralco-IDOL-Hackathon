"use client";
import useAuth from "../../firebaseServices/auth/useAuth";
import { useEffect, useState } from "react";
import {
  updateLocationSharingPrivacy,
  updateConsumptionSharingPrivacy,
  updateUserLocation,
} from "../../firebaseServices/database/usersFunctions";
import styles from "./Profile.module.css";
import { GeoPoint } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X, MapPin } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => {
  const markerHtml = `<svg viewBox="0 0 32 32" class="marker-svg" style="fill:${color};stroke:#fff;stroke-width:2;"><path d="M16 0C10.486 0 6 4.486 6 10c0 5.515 10 22 10 22s10-16.485 10-22C26 4.486 21.514 0 16 0zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/></svg>`;
  return new L.DivIcon({
    html: markerHtml,
    className: "custom-div-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const bluePinIcon = createIcon("#3b82f6");

function LocationPickerMap({ onLocationSelect, initialPos }) {
  const [position, setPosition] = useState(initialPos);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={15}
      className={styles.locationPickerMap}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={position} icon={bluePinIcon}></Marker>
      <MapEvents />
    </MapContainer>
  );
}

function LocationDialog({ isOpen, onClose, user, onSave }) {
  const [newLocation, setNewLocation] = useState(
    user.location
      ? { lat: user.location.latitude, lng: user.location.longitude }
      : { lat: 14.5917, lng: 121.0672 }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  const handleLocationSelect = (latlng) => {
    setNewLocation(latlng);
  };

  const handleSaveLocation = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      const newGeoPoint = new GeoPoint(newLocation.lat, newLocation.lng);
      await updateUserLocation(user.uid, newGeoPoint);
      setStatus({ success: true, message: "Location updated!" });
      onSave(newGeoPoint);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: "Failed to update location." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.dialogBackdrop} onClick={onClose}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.dialogClose} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.dialogTitle}>Change Your Location</h2>
        <p className={styles.dialogSubtitle}>
          Click on the map to set your new location.
        </p>
        <div className={styles.mapWrapper}>
          <LocationPickerMap
            onLocationSelect={handleLocationSelect}
            initialPos={newLocation}
          />
        </div>
        <div className={styles.locationStatus}>
          {status && (
            <p className={status.success ? styles.successText : styles.errorText}>
              {status.message}
            </p>
          )}
        </div>
        <div className={styles.dialogFooter}>
          <button
            className={styles.buttonSecondary}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className={styles.buttonPrimary}
            onClick={handleSaveLocation}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const { firestoreUser, firestoreLoading, signOut, user } = useAuth();
  const [locationPrivacy, setLocationPrivacy] = useState("");
  const [locationUpdateStatus, setLocationUpdateStatus] = useState(null);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [currentFirestoreUser, setCurrentFirestoreUser] = useState(firestoreUser);

  useEffect(() => {
    if (firestoreUser) {
      setCurrentFirestoreUser(firestoreUser);
      setLocationPrivacy(firestoreUser.locationSharingPrivacy || "");
    }
  }, [firestoreUser]);

  if (firestoreLoading) {
    return <div>Loading...</div>;
  }

  if (!currentFirestoreUser) {
    return <div>No user data available.</div>;
  }

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    const date = ts.toDate();
    const timeZone = "Asia/Manila";
    const datePart = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone,
    }).format(date);
    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone,
    }).format(date);
    const tzNamePart = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value;
    const tz = tzNamePart ? tzNamePart.replace("GMT", "UTC") : "UTC+8";
    return `${datePart} at ${timePart} ${tz}`;
  };

  const formatPrivacySetting = (setting) => {
    if (setting === "private") return "Private";
    if (setting === "connectionsOnly") return "Connections Only";
    if (setting === "public") return "Public";
    return "N/A";
  };

  const handleLocationUpdate = async (e) => {
    e?.preventDefault();
    if (!user?.uid) {
      setLocationUpdateStatus({ success: false, message: "Not authenticated" });
      return;
    }
    try {
      await updateLocationSharingPrivacy(user.uid, locationPrivacy);
      setLocationUpdateStatus({
        success: true,
        message: "Location sharing updated.",
      });
      setCurrentFirestoreUser((prev) => ({
        ...prev,
        locationSharingPrivacy: locationPrivacy,
      }));
      setTimeout(() => setIsSettingsDialogOpen(false), 300);
    } catch (err) {
      console.error(err);
      setLocationUpdateStatus({
        success: false,
        message: err?.message || "Failed to update.",
      });
    }
    setTimeout(() => setLocationUpdateStatus(null), 3000);
  };

  const handleSaveNewLocation = (newGeoPoint) => {
    setCurrentFirestoreUser((prev) => ({
      ...prev,
      location: newGeoPoint,
    }));
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={currentFirestoreUser.profileImageUrl}
          alt="profile"
          className={styles.profileImage}
        />
        <h1 className={styles.displayName}>
          {currentFirestoreUser.displayName}
        </h1>
      </div>

      <div className={styles.infoSection}>
        <h2 className={styles.infoTitle}>Personal Information</h2>
        <p className={styles.infoItem}>
          <strong>Email:</strong> {currentFirestoreUser.email}
        </p>
        <p className={styles.infoItem}>
          <strong>Location:</strong>{" "}
          {currentFirestoreUser.location
            ? `GeoPoint(${currentFirestoreUser.location.latitude.toFixed(
                7
              )}, ${currentFirestoreUser.location.longitude.toFixed(7)})`
            : "No location indicated"}
        </p>
        <p className={styles.infoItem}>
          <strong>Consumption Sharing Privacy:</strong>{" "}
          {formatPrivacySetting(currentFirestoreUser.consumptionSharingPrivacy)}
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.signoutBtn} onClick={signOut}>
          Sign Out
        </button>
        <button
          className={styles.localSharingBtn}
          onClick={() => setIsSettingsDialogOpen(true)}
        >
          Location Sharing
        </button>
        <button
          className={styles.changeLocationBtn}
          onClick={() => setIsLocationDialogOpen(true)}
        >
          Change Location
        </button>
      </div>

      {isSettingsDialogOpen && (
        <div
          className={styles.dialogBackdrop}
          onClick={() => setIsSettingsDialogOpen(false)}
        >
          <div
            className={styles.dialogContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.dialogClose}
              onClick={() => setIsSettingsDialogOpen(false)}
            >
              &times;
            </button>
            <h2 className={styles.dialogTitle}>Location Sharing</h2>
            <form className={styles.sharingForm} onSubmit={handleLocationUpdate}>
              <div className={styles.sharingFormLeft}>
                <p className={styles.sharingCurrentSetting}>
                  Current Setting:{" "}
                  <strong>
                    {formatPrivacySetting(
                      currentFirestoreUser?.locationSharingPrivacy
                    )}
                  </strong>
                </p>
                <div className={styles.formGroup}>
                  <label htmlFor="privacy-select">Update Privacy</label>
                  <select
                    id="privacy-select"
                    className={styles.formSelect}
                    name="privacySetting"
                    value={locationPrivacy}
                    onChange={(e) => setLocationPrivacy(e.target.value)}
                    required
                  >
                    <option value="">Select a setting</option>
                    <option value="private">Private</option>
                    <option value="connectionsOnly">Connections Only</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.formButton}>
                Update Privacy
              </button>
            </form>
          </div>
        </div>
      )}

      <LocationDialog
        isOpen={isLocationDialogOpen}
        onClose={() => setIsLocationDialogOpen(false)}
        user={user}
        onSave={handleSaveNewLocation}
      />
    </div>
  );
}

export default Profile;