import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Battery, 
  BatteryCharging, 
  Clock, 
  ExternalLink, 
  Navigation, 
  ShieldAlert, 
  Copy, 
  Check, 
  Radio, 
  Compass, 
  ArrowUpRight,
  ChevronRight,
  RotateCw 
} from 'lucide-react';

export default function MRLiveTrackingModal({ 
  mr = null, 
  isOpen = false, 
  onClose,
  mapboxConfig = {} 
}) {
  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const loc = mr?.latest_location;
  const hasLiveLocation = Boolean(loc && loc.latitude && loc.longitude);
  const lat = hasLiveLocation ? Number(loc.latitude) : null;
  const lng = hasLiveLocation ? Number(loc.longitude) : null;

  const token = (mapboxConfig.token || (typeof window !== 'undefined' ? window.MAPBOX_TOKEN : '') || '').trim();
  const mapStyle = mapboxConfig.style || 'mapbox://styles/mapbox/streets-v12';

  const handleCopyCoords = () => {
    if (!lat || !lng) return;
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = hasLiveLocation
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : '';

  // Initialize Mapbox GL JS SDK (same engine as Field Operations & Map page)
  useEffect(() => {
    if (!isOpen || !hasLiveLocation || !lat || !lng) return;

    let isMounted = true;
    setMapLoaded(false);
    setMapError(false);

    const initMapbox = () => {
      if (!mapContainerRef.current || !window.mapboxgl) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const hasValidMapboxToken = Boolean(token && token.startsWith('pk.'));
        const effectiveToken = hasValidMapboxToken
          ? token
          : 'pk.eyJ1IjoibXJjb25uZWN0LWRlbW8iLCJhIjoiY2x6cTFxZmxwMDJiazJqcXB0eGdxOGNteSJ9.mock';
        window.mapboxgl.accessToken = effectiveToken;

        // Use Mapbox streets style if token is configured; otherwise use full raster street tiles so map is never blank
        const effectiveStyle = hasValidMapboxToken
          ? mapStyle
          : {
              version: 8,
              sources: {
                'osm-raster-tiles': {
                  type: 'raster',
                  tiles: [
                    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  ],
                  tileSize: 256,
                  attribution: '© OpenStreetMap contributors',
                },
              },
              layers: [
                {
                  id: 'osm-tiles-layer',
                  type: 'raster',
                  source: 'osm-raster-tiles',
                  minzoom: 0,
                  maxzoom: 19,
                },
              ],
            };

        const map = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: effectiveStyle,
          center: [lng, lat],
          zoom: 15,
          attributionControl: true,
        });

        map.addControl(new window.mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');

        map.on('load', () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);

          // Add pulsating live MR position marker
          const mrEl = document.createElement('div');
          mrEl.className = 'relative flex items-center justify-center cursor-pointer';
          mrEl.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-10 h-10 rounded-full bg-violet-500/25 animate-ping"></span>
              <span class="absolute w-7 h-7 rounded-full bg-violet-500/40"></span>
              <div class="relative w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center border-2 border-white text-[11px] font-bold shadow-lg">
                ${mr?.name ? mr.name.charAt(0).toUpperCase() : 'M'}
              </div>
            </div>
          `;

          const mrPopup = new window.mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 font-sans text-xs">
              <div class="font-bold text-slate-900">${mr?.name || 'Representative'}</div>
              <div class="text-[11px] text-slate-500">${mr?.emp_code || ''} • Live GPS</div>
              <div class="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active in Field
              </div>
            </div>
          `);

          const marker = new window.mapboxgl.Marker(mrEl)
            .setLngLat([lng, lat])
            .setPopup(mrPopup)
            .addTo(map);

          markerRef.current = marker;

          // Trigger map resize after DOM mount
          setTimeout(() => {
            if (isMounted && map) {
              map.resize();
            }
          }, 150);
        });

        map.on('error', () => {
          if (!mapLoaded) {
            setMapError(true);
          }
        });
      } catch (err) {
        setMapError(true);
      }
    };

    const loadMapboxSDK = async () => {
      if (window.mapboxgl) {
        initMapbox();
        return;
      }

      try {
        if (!document.getElementById('mapbox-gl-css')) {
          const link = document.createElement('link');
          link.id = 'mapbox-gl-css';
          link.rel = 'stylesheet';
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css';
          document.head.appendChild(link);
        }

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

    loadMapboxSDK();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, hasLiveLocation, lat, lng, token, mapStyle]);

  if (!isOpen || !mr) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm flex items-center justify-center shrink-0">
              {mr.name ? mr.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {mr.name}
                </h3>
                <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                  {mr.emp_code}
                </span>
                {hasLiveLocation ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Location Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                    Location Offline
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {mr.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {hasLiveLocation ? (
            <>
              {/* Mapbox GL Map Container */}
              <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                
                {/* Mapbox Mount Element */}
                <div ref={mapContainerRef} className="w-full h-full" />

                {/* Loading State */}
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <RotateCw className="w-4 h-4 animate-spin text-violet-600" />
                    <span>Loading Mapbox View...</span>
                  </div>
                )}

                {/* Fallback in the rare case Mapbox SDK cannot load */}
                {mapError && (
                  <iframe
                    title={`Live Location of ${mr.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.006}%2C${lng + 0.008}%2C${lat + 0.006}&layer=mapnik&marker=${lat}%2C${lng}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                )}

                {/* Floating Map Overlay Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200/80 flex items-center gap-2 pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 relative" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800">
                    Mapbox Live Telemetry
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {loc.updated_at || 'Just now'}
                  </span>
                </div>

                {/* Direct Google Maps Anchor */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-violet-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md border border-slate-200/90 flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-violet-600" />
                  <span>Google Maps View</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              {/* Real-time Telemetry Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Coordinates */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    GPS Coordinates
                  </span>
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <span className="text-xs font-mono font-semibold text-slate-800 truncate" title={`${lat}, ${lng}`}>
                      {lat.toFixed(5)}, {lng.toFixed(5)}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCoords}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Copy coordinates"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Last Synced */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    Last Ping
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {loc.updated_at || 'Just now'}
                    </span>
                  </div>
                </div>

                {/* Battery Status */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    Device Battery
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {loc.battery_status === 'charging' ? (
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Battery className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                      {loc.battery_level ? `${loc.battery_level}%` : '85%'}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {loc.battery_status || 'normal'}
                    </span>
                  </div>
                </div>

                {/* Field Activity */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    Activity
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Radio className="w-3.5 h-3.5 text-violet-600" />
                    <span className="text-xs font-semibold text-slate-800 capitalize truncate">
                      {loc.current_activity ? loc.current_activity.replace('_', ' ') : 'In Field'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Address Display if resolved */}
              {loc.address && (
                <div className="p-3 rounded-xl bg-violet-50/50 border border-violet-100 text-xs text-slate-700 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Approximate Location: </span>
                    <span className="text-slate-600">{loc.address}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Location Offline / Not Available State */
            <div className="py-10 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-600 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="text-base font-semibold text-slate-900">
                  Live Location Offline
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This representative (<span className="font-semibold text-slate-700">{mr.name}</span>) has not enabled device GPS or hasn't submitted a field check-in ping yet today.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 text-left text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <Compass className="w-4 h-4 text-violet-600" />
                  <span>How it works</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Once the representative opens the MR Portal on their mobile device and grants <strong>"Allow Location"</strong> permission, their real-time field coordinates will automatically appear here.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            {hasLiveLocation && (
              <a
                href={`/admin/tracking?user_id=${mr.id}`}
                className="text-xs font-medium text-violet-700 hover:text-violet-800 inline-flex items-center gap-1 hover:underline"
              >
                <span>Full Field Operations & Tour Route</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
