import { useEffect, useState } from 'react';
import { DeviceInfo, gatherDeviceInfo } from './lib/device-info';
import { exportToSlides } from './lib/slides';
import { motion } from 'motion/react';

const THEMES = [
  {
    id: 'matrix',
    title: 'DIGITAL_FOOTPRINT // v4.02',
    vars: {
      '--bg-main': '#0A0A0B',
      '--bg-panel': '#111111',
      '--bg-panel-inner': '#181818',
      '--text-main': '#D1D1D1',
      '--text-accent': '#00FF41',
      '--text-muted': '#555555',
      '--border-color': '#333333',
      '--border-dim': '#222222',
      '--danger': '#FF3B30'
    }
  },
  {
    id: 'cyber',
    title: 'CYBER_LINK // v7.88',
    vars: {
      '--bg-main': '#050A1F',
      '--bg-panel': '#0A1128',
      '--bg-panel-inner': '#0D1838',
      '--text-main': '#B0C4DE',
      '--text-accent': '#00E5FF',
      '--text-muted': '#4A628A',
      '--border-color': '#1E2D5A',
      '--border-dim': '#131C38',
      '--danger': '#FF0055'
    }
  },
  {
    id: 'crimson',
    title: 'ALERT_OVERRIDE // v1.00',
    vars: {
      '--bg-main': '#1A0505',
      '--bg-panel': '#2A0A0A',
      '--bg-panel-inner': '#380D0D',
      '--text-main': '#E6B3B3',
      '--text-accent': '#FF2A2A',
      '--text-muted': '#8A4A4A',
      '--border-color': '#5A1E1E',
      '--border-dim': '#381313',
      '--danger': '#FFB000'
    }
  },
  {
    id: 'amber',
    title: 'MAINFRAME_ACCESS // v9.11',
    vars: {
      '--bg-main': '#141000',
      '--bg-panel': '#1F1700',
      '--bg-panel-inner': '#2E2200',
      '--text-main': '#D4C499',
      '--text-accent': '#FFB000',
      '--text-muted': '#8A7A4A',
      '--border-color': '#5A4D1E',
      '--border-dim': '#382F13',
      '--danger': '#FF3B30'
    }
  },
  {
    id: 'neon',
    title: 'NEON_SYNTH // v5.55',
    vars: {
      '--bg-main': '#0b001a',
      '--bg-panel': '#160033',
      '--bg-panel-inner': '#22004c',
      '--text-main': '#ffb3ff',
      '--text-accent': '#00ffff',
      '--text-muted': '#b300b3',
      '--border-color': '#4c0099',
      '--border-dim': '#330066',
      '--danger': '#ff3300'
    }
  },
  {
    id: 'monochrome',
    title: 'TERMINAL_ZERO // v0.99',
    vars: {
      '--bg-main': '#000000',
      '--bg-panel': '#000000',
      '--bg-panel-inner': '#111111',
      '--text-main': '#ffffff',
      '--text-accent': '#ffffff',
      '--text-muted': '#666666',
      '--border-color': '#ffffff',
      '--border-dim': '#333333',
      '--danger': '#ffffff'
    }
  },
  {
    id: 'pipboy',
    title: 'ROBCO_OS // v8.1',
    vars: {
      '--bg-main': '#0d1a0d',
      '--bg-panel': '#112611',
      '--bg-panel-inner': '#1a331a',
      '--text-main': '#4dff4d',
      '--text-accent': '#b3ffb3',
      '--text-muted': '#268026',
      '--border-color': '#339933',
      '--border-dim': '#1a4d1a',
      '--danger': '#ff0000'
    }
  },
  {
    id: 'solarized',
    title: 'SOLAR_SCAN // v2.3',
    vars: {
      '--bg-main': '#002b36',
      '--bg-panel': '#073642',
      '--bg-panel-inner': '#002b36',
      '--text-main': '#839496',
      '--text-accent': '#2aa198',
      '--text-muted': '#586e75',
      '--border-color': '#2aa198',
      '--border-dim': '#073642',
      '--danger': '#dc322f'
    }
  }
];

export default function App() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccessUrl, setExportSuccessUrl] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [theme] = useState(() => THEMES[Math.floor(Math.random() * THEMES.length)]);

  useEffect(() => {
    gatherDeviceInfo().then((data) => {
      setInfo(data);
      setLoading(false);
    });
  }, []);

  const handleExport = async () => {
    if (!info) return;
    setExporting(true);
    setExportError(null);
    setExportSuccessUrl(null);
    try {
      const { url, user } = await exportToSlides(info);
      setExportSuccessUrl(url);
      setGoogleUser(user);
    } catch (err: any) {
      setExportError(err.message || "Failed to export to Slides");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center font-mono"
        style={{ backgroundColor: theme.vars['--bg-main'] } as any}
      >
        <div 
          className="text-xs animate-pulse tracking-widest"
          style={{ color: theme.vars['--text-accent'] }}
        >INITIALIZING_TELEMETRY_STREAM...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen font-mono p-4 md:p-6 flex flex-col overflow-x-hidden"
      style={{ ...theme.vars, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' } as React.CSSProperties}
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col flex-1 gap-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 gap-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter" style={{ color: 'var(--text-main)' }}>{theme.title}</h1>
            <p className="text-[10px] opacity-80 tracking-widest uppercase mt-1" style={{ color: 'var(--text-accent)' }}>Real-time data harvest protocol active</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Capture_Timestamp</p>
            <p className="text-xs">{new Date().toISOString()}</p>
          </div>
        </header>

        {/* Action Bar */}
        <div className="border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <div>
            <h2 className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-accent)' }}>System_Command // Export</h2>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Extract telemetry stream to Google Slides.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {exportSuccessUrl && (
              <a href={exportSuccessUrl} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>
                [ View_Export ]
              </a>
            )}
            {exportError && (
              <p className="text-[10px] uppercase px-2 py-1 border" style={{ color: 'var(--danger)', backgroundColor: 'color-mix(in srgb, var(--danger) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--danger) 30%, transparent)' }}>{exportError}</p>
            )}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="text-black text-[10px] font-bold px-4 py-2 uppercase tracking-widest transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
              style={{ backgroundColor: 'var(--text-accent)' }}
            >
              {exporting ? 'Processing...' : 'Execute_Export'}
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
          {/* Left Column */}
          <section className="col-span-1 md:col-span-4 flex flex-col gap-4">
            
            {/* Geographic Intelligence */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border p-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[10px] uppercase tracking-widest mb-3 border-b pb-1" style={{ color: 'var(--text-accent)', borderColor: 'var(--border-dim)' }}>01. Geo-Spatial Intelligence</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Remote_Addr</span>
                  <span className="font-bold">{info?.server.ip || 'Unknown'}</span>
                </div>
                {info?.location && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Location_Est</span>
                      <span style={{ color: 'var(--text-accent)' }}>{info.location.city}, {info.location.region}, {info.location.country}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Coordinates</span>
                      <span>{info.location.lat}, {info.location.lon}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>ISP_Org</span>
                      <span>{info.location.org}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Timezone</span>
                  <span>{info?.client.timezone}</span>
                </div>
              </div>
            </motion.div>

            {/* Network Identity */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="border p-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[10px] uppercase tracking-widest mb-3 border-b pb-1" style={{ color: 'var(--text-accent)', borderColor: 'var(--border-dim)' }}>02. Network Identity</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Remote_Addr</span>
                  <span className="font-bold">{info?.server.ip || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Protocol</span>
                  <span>{info?.server.protocol?.toUpperCase() || 'HTTP'}</span>
                </div>
                {info?.client.connection && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Conn_Type</span>
                      <span style={{ color: 'var(--text-accent)' }}>{info.client.connection.effectiveType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Downlink_Est</span>
                      <span>{info.client.connection.downlink ? `${info.client.connection.downlink} Mbps` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Round_Trip_Time</span>
                      <span>{info.client.connection.rtt ? `${info.client.connection.rtt} ms` : 'N/A'}</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Google Profile Extraction */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="border p-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[10px] uppercase tracking-widest mb-3 border-b pb-1" style={{ color: 'var(--text-accent)', borderColor: 'var(--border-dim)' }}>03. Authorized Identity Cache</h2>
              {googleUser ? (
                <div className="flex gap-4 items-center">
                  {googleUser.photoURL && (
                    <img src={googleUser.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2" style={{ borderColor: 'var(--border-color)' }} referrerPolicy="no-referrer" />
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Display_Name</span>
                      <span className="font-bold">{googleUser.displayName || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Email_Address</span>
                      <span className="font-bold">{googleUser.email || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Auth_Provider</span>
                      <span style={{ color: 'var(--text-accent)' }}>Google_OAuth_Token</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>Identity Data Masked</p>
                  <p className="text-[9px] mt-2 opacity-50">Execute export command to unmask via OAuth.</p>
                </div>
              )}
            </motion.div>

            {/* Hardware Profile */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="border p-4 flex-1" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[10px] uppercase tracking-widest mb-3 border-b pb-1" style={{ color: 'var(--text-accent)', borderColor: 'var(--border-dim)' }}>04. Hardware Profile</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>LOGICAL_RES</p>
                  <p className="text-[10px] mt-1">{info?.client.screenWidth}x{info?.client.screenHeight}</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>AVAIL_RES</p>
                  <p className="text-[10px] mt-1">{info?.client.availWidth}x{info?.client.availHeight}</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>PIXEL_RATIO</p>
                  <p className="text-[10px] mt-1">{info?.client.devicePixelRatio}</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>COLOR_DEPTH</p>
                  <p className="text-[10px] mt-1">{info?.client.colorDepth}-bit</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>PLATFORM</p>
                  <p className="text-[10px] mt-1 break-all">{info?.client.platform || 'Unknown'}</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>MAX_TOUCH</p>
                  <p className="text-[10px] mt-1 break-all">{info?.client.maxTouchPoints || 0} Points</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>MEDIA_DEVICES</p>
                  <p className="text-[10px] mt-1 break-all">{info?.client.mediaDeviceCount}</p>
                </div>
                <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>BATTERY</p>
                  <p className="text-[10px] mt-1 break-all">{info?.client.batteryLevel} ({info?.client.batteryCharging})</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border p-3 flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-color)' }}>
                  <p className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Memory_Est</p>
                  <p className="text-2xl font-bold mt-1">{info?.client.deviceMemory || '?'}<span className="text-xs opacity-50 ml-1">GB</span></p>
                </div>
                <div className="border p-3 flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-color)' }}>
                  <p className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Cores_Logic</p>
                  <p className="text-2xl font-bold mt-1">{info?.client.hardwareConcurrency || '?'}</p>
                </div>
                {info?.client.storageQuotaGB && (
                  <div className="border p-3 flex flex-col justify-center col-span-2" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-color)' }}>
                    <p className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Storage_Quota</p>
                    <p className="text-xl font-bold mt-1">{info.client.storageQuotaGB}<span className="text-xs opacity-50 ml-1">GB</span></p>
                  </div>
                )}
              </div>
            </motion.div>

          </section>

          {/* Right Column */}
          <section className="col-span-1 md:col-span-8 flex flex-col gap-4">
            
            {/* Browser Fingerprint */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="border p-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[10px] uppercase tracking-widest mb-3 border-b pb-1" style={{ color: 'var(--text-accent)', borderColor: 'var(--border-dim)' }}>05. Deep Browser Fingerprint</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>USER_AGENT_STRING</p>
                  <p className="text-[11px] leading-tight opacity-90">{info?.client.userAgent}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>WEBGL_RENDERER_UNMASKED</p>
                    <p className="text-[11px] leading-tight opacity-90">{info?.client.webglRenderer} <span className="opacity-50">({info?.client.webglVendor})</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>CANVAS_HASH</p>
                    <p className="text-[11px] font-bold" style={{ color: 'var(--text-accent)' }}>{info?.client.canvasFingerprint}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>LANGUAGE</p>
                    <p className="text-[10px] mt-1">{info?.client.language}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>COOKIES</p>
                    <p className="text-[10px] mt-1">{info?.client.cookiesEnabled ? 'ENABLED' : 'DISABLED'}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>DO_NOT_TRACK</p>
                    <p className="text-[10px] mt-1">{info?.client.doNotTrack || 'NULL'}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>PDF_VIEWER</p>
                    <p className="text-[10px] mt-1">{info?.client.pdfViewerEnabled ? 'ACTIVE' : 'INACTIVE'}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>WEBDRIVER</p>
                    <p className="text-[10px] mt-1">{info?.client.webdriver ? 'DETECTED' : 'CLEAN'}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>PLUGINS</p>
                    <p className="text-[10px] mt-1">{info?.client.pluginsCount} INSTALLED</p>
                  </div>
                  <div className="p-2 border col-span-2 sm:col-span-1" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>BROWSER_VENDOR</p>
                    <p className="text-[10px] mt-1">{info?.client.vendor || 'UNKNOWN'}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>PREF_THEME</p>
                    <p className="text-[10px] mt-1">{info?.client.colorScheme}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>BLUETOOTH_API</p>
                    <p className="text-[10px] mt-1">{info?.client.bluetoothAvailable ? 'EXPOSED' : 'HIDDEN'}</p>
                  </div>
                  <div className="p-2 border" style={{ backgroundColor: 'var(--bg-panel-inner)', borderColor: 'var(--border-dim)' }}>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>USB_API</p>
                    <p className="text-[10px] mt-1">{info?.client.usbAvailable ? 'EXPOSED' : 'HIDDEN'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Raw Headers Stream */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="border flex-1 p-4 flex flex-col min-h-[300px]" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[10px] uppercase tracking-widest mb-3 border-b pb-1" style={{ color: 'var(--text-accent)', borderColor: 'var(--border-dim)' }}>06. Raw Header Telemetry</h2>
              
              <div className="flex-1 w-full border overflow-hidden relative" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-main) 50%, black)', borderColor: 'var(--border-dim)' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--text-accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute inset-0 p-3 overflow-y-auto z-10">
                  <pre className="text-[10px] font-mono whitespace-pre-wrap opacity-70">
                    {JSON.stringify(info?.server.headers, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>SYSTEM_NOTICE</p>
                  <p className="text-[11px]">This data is automatically transmitted with every HTTP request.</p>
                </div>
                <div className="text-black text-[10px] font-bold px-3 py-1 uppercase animate-pulse" style={{ backgroundColor: 'var(--danger)' }}>
                  Privacy Risk: Critical
                </div>
              </div>
            </motion.div>

          </section>
        </div>
        
        <footer className="mt-2 grid grid-cols-3 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--text-accent)' }}></div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>UPLINK STABLE</span>
          </div>
          <div className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>ENCRYPTION: AES-256-GCM // CREATOR: FOKHRUL ISLAM</div>
          <div className="text-[10px] text-right" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} PRIVACY_PROBE</div>
        </footer>
      </div>
    </div>
  );
}
