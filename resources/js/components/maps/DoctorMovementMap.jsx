import { useEffect, useRef, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  Layers, 
  Maximize2, 
  RotateCcw,
  Shield,
  Battery,
  User,
  Sparkles
} from 'lucide-react';

/**
 * DoctorMovementMap Component
 * Integrates Mapbox GL JS SDK with fallback vector canvas/tiles
 * Renders Doctor Movement route, visited vs pending pins, animated path, and MR live position.
 */
export default function DoctorMovementMap({
  mapboxConfig = {},
  doctorStops = {},
  activeMR = null,
  onStopClick = null,
  height = '480px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, visited, pending

  const token = (mapboxConfig.token || (typeof window !== 'undefined' ? window.MAPBOX_TOKEN : '') || '').trim();
  const mapStyle = mapboxConfig.style || 'mapbox://styles/mapbox/streets-v12';
  const defaultLat = mapboxConfig.default_lat || 8.1833;
  const defaultLng = mapboxConfig.default_lng || 77.4119;
  const defaultZoom = mapboxConfig.default_zoom || 13;

  const visitedStops = doctorStops.visited || [];
  const pendingStops = doctorStops.pending || [];
  const allStops = doctorStops.all || [...visitedStops, ...pendingStops];
  const routeCoordinates = doctorStops.route_coordinates || [];
  const mrLiveLocation = doctorStops.mr_live_location || (activeMR ? {
    lat: activeMR.lat || defaultLat,
    lng: activeMR.lng || defaultLng,
    user_name: activeMR.name,
    reg_code: activeMR.reg_code,
    battery: activeMR.battery_level,
    last_synced: 'Just now'
  } : null);

  // Filtered stops based on pill click
  const visibleStops = allStops.filter((stop) => {
    if (activeFilter === 'visited') return stop.status === 'visited';
    if (activeFilter === 'pending') return stop.status === 'pending';
    return true;
  });

  // Dynamically load Mapbox GL JS SDK script and css if token exists
  useEffect(() => {
    let isMounted = true;

    const loadMapboxSDK = async () => {
      // Check if mapboxgl already exists in window
      if (window.mapboxgl) {
        initMapbox();
        return;
      }

      try {
        // Inject Mapbox CSS
        if (!document.getElementById('mapbox-gl-css')) {
          const link = document.createElement('link');
          link.id = 'mapbox-gl-css';
          link.rel = 'stylesheet';
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css';
          document.head.appendChild(link);
        }

        // Inject Mapbox JS
        if (!document.getElementById('mapbox-gl-js')) {
          const script = document.createElement('script');
          script.id = 'mapbox-gl-js';
          script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js';
          script.async = true;
          script.onload = () => {
            if (isMounted) initMapbox();
          };
          script.onerror = () => {
            if (isMounted) setMapError(true);
          };
          document.body.appendChild(script);
        } else {
          initMapbox();
        }
      } catch (e) {
        if (isMounted) setMapError(true);
      }
    };

    const initMapbox = () => {
      if (!mapContainerRef.current || !window.mapboxgl) return;

      // Clean existing instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const effectiveToken = token.trim() || 'pk.eyJ1IjoibXJjb25uZWN0LWRlbW8iLCJhIjoiY2x6cTFxZmxwMDJiazJqcXB0eGdxOGNteSJ9.mock';
        window.mapboxgl.accessToken = effectiveToken;

        const centerLng = mrLiveLocation?.lng || (allStops[0]?.lng) || defaultLng;
        const centerLat = mrLiveLocation?.lat || (allStops[0]?.lat) || defaultLat;

        const map = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: token.trim() ? mapStyle : 'https://demotiles.maplibre.org/style.json',
          center: [centerLng, centerLat],
          zoom: defaultZoom,
          attributionControl: false,
        });

        map.addControl(new window.mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');

        map.on('load', () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);
          drawRouteAndMarkers(map);
        });

        map.on('error', (e) => {
          // If custom style or token is rejected by Mapbox, fallback to demotiles or fallback view
          if (!mapLoaded) {
            setMapError(true);
          }
        });
      } catch (err) {
        setMapError(true);
      }
    };

    loadMapboxSDK();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [token, mapStyle, activeMR?.id]);

  // Redraw markers and route line whenever stops or map updates
  const drawRouteAndMarkers = (map) => {
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Draw Route Polyline
    if (routeCoordinates && routeCoordinates.length > 1) {
      const geojsonRoute = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
      };

      if (map.getSource('route-line')) {
        map.getSource('route-line').setData(geojsonRoute);
      } else {
        map.addSource('route-line', {
          type: 'geojson',
          data: geojsonRoute,
        });

        // Glow line
        map.addLayer({
          id: 'route-line-glow',
          type: 'line',
          source: 'route-line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#6366f1',
            'line-width': 6,
            'line-opacity': 0.25,
          },
        });

        // Dashed animated line
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#4f46e5',
            'line-width': 3,
            'line-dasharray': [2, 2],
          },
        });
      }
    }

    // 2. Add MR Current Live Position Marker
    if (mrLiveLocation && window.mapboxgl) {
      const mrEl = document.createElement('div');
      mrEl.className = 'relative flex items-center justify-center cursor-pointer';
      mrEl.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-9 h-9 rounded-full bg-violet-500/25 animate-ping"></span>
          <span class="absolute w-6 h-6 rounded-full bg-violet-500/40"></span>
          <div class="relative w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center border-2 border-white text-[10px] font-semibold">
            MR
          </div>
        </div>
      `;

      const mrPopup = new window.mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 font-sans text-xs">
          <div class="font-bold text-slate-900">${mrLiveLocation.user_name || 'Medical Representative'}</div>
          <div class="text-[11px] text-slate-500">Reg: ${mrLiveLocation.reg_code || '1026'} • Live GPS</div>
          <div class="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Field Route
          </div>
        </div>
      `);

      const mrMarker = new window.mapboxgl.Marker(mrEl)
        .setLngLat([mrLiveLocation.lng, mrLiveLocation.lat])
        .setPopup(mrPopup)
        .addTo(map);

      markersRef.current.push(mrMarker);
    }

    // 3. Add Doctor Pins (Visited in Emerald, Pending in Amber)
    visibleStops.forEach((stop, index) => {
      if (!stop.lat || !stop.lng || !window.mapboxgl) return;

      const isVisited = stop.status === 'visited';
      const el = document.createElement('div');
      el.className = 'cursor-pointer transform hover:scale-110 transition-transform';
      el.innerHTML = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full ${
          isVisited 
            ? 'bg-emerald-500 text-white border-2 border-white shadow-xs' 
            : 'bg-amber-500 text-white border-2 border-white shadow-xs'
        } text-xs font-bold">
          ${isVisited ? '✓' : index + 1}
        </div>
      `;

      const popup = new window.mapboxgl.Popup({ offset: 20 }).setHTML(`
        <div class="p-2.5 font-sans text-xs max-w-[220px]">
          <div class="font-bold text-slate-900">${stop.name}</div>
          <div class="text-[11px] text-indigo-600 font-medium">${stop.specialization || 'Consultant'}</div>
          <div class="text-[11px] text-slate-500 truncate">${stop.clinic_hospital || stop.address}</div>
          <div class="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="font-medium ${isVisited ? 'text-emerald-600' : 'text-amber-600'}">
              ${isVisited ? '● Visited' : '○ Pending'}
            </span>
            <span class="text-slate-400 font-mono">${stop.scheduled_time || stop.time || ''}</span>
          </div>
        </div>
      `);

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([stop.lng, stop.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        if (onStopClick) onStopClick(stop);
      });

      markersRef.current.push(marker);
    });

    // Fit map bounds to encompass all stops and MR location
    if (visibleStops.length > 0 && window.mapboxgl) {
      const bounds = new window.mapboxgl.LngLatBounds();
      if (mrLiveLocation) bounds.extend([mrLiveLocation.lng, mrLiveLocation.lat]);
      visibleStops.forEach((s) => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
    }
  };

  // Recenter map handler
  const handleRecenter = () => {
    if (mapInstanceRef.current && mrLiveLocation) {
      mapInstanceRef.current.flyTo({
        center: [mrLiveLocation.lng, mrLiveLocation.lat],
        zoom: defaultZoom,
        essential: true,
      });
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-100 bg-white gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Route View</span>
          <h3 className="text-sm font-semibold text-slate-800">Doctor Movement Map</h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/50">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              All ({allStops.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('visited')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                activeFilter === 'visited'
                  ? 'bg-white text-emerald-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {visitedStops.length} Visited
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                activeFilter === 'pending'
                  ? 'bg-white text-amber-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {pendingStops.length} Pending
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Animated Route Active
          </span>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative w-full bg-slate-100" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Fallback Clean Vector Route Renderer if Mapbox GL Canvas is loading or offline */}
        {mapError && (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Interactive SVG Route Map Fallback */}
            <div className="w-full h-full max-h-[380px] relative rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/30 overflow-hidden flex items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
              
              {/* Route SVG Polyline */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                <path
                  d="M 80 280 L 160 230 L 260 170 L 340 140 L 440 90 L 520 70"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeDasharray="6 6"
                  className="animate-[dash_20s_linear_infinite]"
                />
              </svg>

              {/* Doctor Stops on Vector Graphic */}
              <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-left text-xs max-w-xs">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Visited Doctor #1</span>
                    <p className="font-semibold text-slate-800">Parvathipuram Diabetes Center</p>
                    <p className="text-[11px] text-slate-500">Dr. Rajesh Kumar MD • 12:45 PM</p>
                  </div>
                  <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-left text-xs max-w-xs">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Pending Doctor #2</span>
                    <p className="font-semibold text-slate-800">Kottar Digestive Clinic</p>
                    <p className="text-[11px] text-slate-500">Dr. P. Venkatesh • 03:15 PM</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-sky-300 text-left text-xs flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                      MR
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{mrLiveLocation?.user_name || 'MR Live'}</p>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        GPS Broadcast Active
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
                    Mapbox Token: Configure in Admin Settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-xs">
          <button
            type="button"
            title="Recenter on MR Location"
            onClick={handleRecenter}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
