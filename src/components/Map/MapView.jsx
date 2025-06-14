import { useState, useCallback, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "./MapView.css";
import MoveToLocation from "../MoveToLocation";
import SearchBox from "../SearchBox";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const startIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const RoutingMachine = ({ pointA, pointB, onRouteFound }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !pointA || !pointB) return;

    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (err) {
        console.error("Failed to remove existing route:", err);
      }
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pointA.lat, pointA.lng),
        L.latLng(pointB.lat, pointB.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: "#007bff", weight: 6, opacity: 1 }],
      },
      show: false,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    })
      .on("routesfound", (e) => {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const time = Math.round(route.summary.totalTime / 60);
        onRouteFound({ distance: `${distance} km`, time: `${time} min` });

        setTimeout(() => {
          map.invalidateSize();
        }, 300);
      })
      .on("routingerror", (e) => {
        console.error("Routing error:", e);
      })
      .addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (err) {
        console.error("Error cleaning up routing control:", err);
      }
    };
  }, [map, pointA, pointB, onRouteFound]);

  return null;
};

const MapView = () => {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]);
  const [mapZoom, setMapZoom] = useState(15);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);
        setMapCenter([location.lat, location.lng]);
        setMapZoom(13);
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  const handleMapClick = useCallback(
    async (latlng) => {
      const API_KEY = "YOUR_OPENCAGE_API_KEY";
      try {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latlng.lat}+${latlng.lng}&key=${API_KEY}&limit=1`
        );
        const data = await res.json();
        const placeName = data?.results?.[0]?.formatted || "";

        if (!pointA) {
          setPointA(latlng);
          setInputA(placeName);
          setError("");
          setLoading(false);
        } else if (!pointB) {
          setPointB(latlng);
          setInputB(placeName);
          setError("");
          setLoading(true);
        } else {
          setPointA(latlng);
          setInputA(placeName);
          setPointB(null);
          setInputB("");
          setRouteInfo(null);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        console.error("Reverse geocode failed");
      }
    },
    [pointA, pointB]
  );

  const handleRouteFound = useCallback((info) => {
    setRouteInfo(info);
    setLoading(false);
  }, []);

  const useCurrentLocation = () => {
    if (currentLocation) {
      setPointA(currentLocation);
      setInputA("Current Location");
      setPointB(null);
      setInputB("");
      setRouteInfo(null);
      setError("");
      setLoading(false);
      setMapCenter([currentLocation.lat, currentLocation.lng]);
      setMapZoom(14);
    }
  };

  const clearRoute = () => {
    setPointA(null);
    setInputA("");
    setPointB(null);
    setInputB("");
    setRouteInfo(null);
    setError("");
    setLoading(false);
  };

  return (
    <div className="map-container">
      <div className="map-controls">
        <div className="controls-row">
          <SearchBox
            placeholder="Enter Start Location"
            value={inputA}
            setValue={setInputA}
            onSelect={(location, name) => {
              setPointA(location);
              setInputA(name);
              setPointB(null);
              setInputB("");
              setRouteInfo(null);
              setError("");
            }}
          />
          <SearchBox
            placeholder="Enter Destination"
            value={inputB}
            setValue={setInputB}
            onSelect={(location, name) => {
              if (pointA) {
                setPointB(location);
                setInputB(name);
                setLoading(true);
                setError("");
              } else {
                alert("Please set the start location first.");
              }
            }}
          />
        </div>

        <div className="controls-row">
          <button
            onClick={useCurrentLocation}
            className="control-btn"
            disabled={!currentLocation}
          >
            📍 Use Current Location
          </button>
          <button onClick={clearRoute} className="control-btn secondary">
            🗑️ Clear Route
          </button>
        </div>

        <div className="instructions">
          {!pointA && <p>Click on the map or search to set Point A</p>}
          {pointA && !pointB && (
            <p>Click on the map or search to set Point B</p>
          )}
          {pointA && pointB && <p>Click anywhere to reset</p>}
        </div>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Calculating route...</div>}

        {routeInfo && (
          <div className="route-info">
            <div className="route-detail">
              <span className="route-label">Distance:</span>
              <span className="route-value">{routeInfo.distance}</span>
            </div>
            <div className="route-detail">
              <span className="route-label">Duration:</span>
              <span className="route-value">{routeInfo.time}</span>
            </div>
          </div>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />

          {pointA && (
            <Marker position={[pointA.lat, pointA.lng]} icon={startIcon}>
              <Popup>
                <strong>Start:</strong>
                <br />
                Lat: {pointA.lat.toFixed(5)}, Lng: {pointA.lng.toFixed(5)}
              </Popup>
            </Marker>
          )}

          {pointB && (
            <Marker position={[pointB.lat, pointB.lng]} icon={endIcon}>
              <Popup>
                <strong>Destination:</strong>
                <br />
                Lat: {pointB.lat.toFixed(5)}, Lng: {pointB.lng.toFixed(5)}
              </Popup>
            </Marker>
          )}

          {pointA && pointB && (
            <RoutingMachine
              pointA={pointA}
              pointB={pointB}
              onRouteFound={handleRouteFound}
            />
          )}

          {(pointA || pointB) && (
            <MoveToLocation
              position={[(pointB || pointA).lat, (pointB || pointA).lng]}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
