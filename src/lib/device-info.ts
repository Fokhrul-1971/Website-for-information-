export interface DeviceInfo {
  server: {
    ip: string | string[];
    headers: Record<string, string | string[] | undefined>;
    protocol: string;
  };
  client: {
    userAgent: string;
    language: string;
    languages: readonly string[];
    platform: string;
    vendor: string;
    hardwareConcurrency?: number;
    deviceMemory?: number;
    screenWidth: number;
    screenHeight: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    devicePixelRatio: number;
    timezone: string;
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
    };
    cookiesEnabled: boolean;
    doNotTrack: string | null;
    maxTouchPoints: number;
    pdfViewerEnabled: boolean;
    webdriver: boolean;
    pluginsCount: number;
    webglVendor: string;
    webglRenderer: string;
    batteryLevel: string;
    batteryCharging: string;
    mediaDeviceCount: number | string;
    location?: {
      city: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
      org: string;
    };
    canvasFingerprint: string;
    storageQuotaGB?: string;
    colorScheme: string;
    reducedMotion: boolean;
    bluetoothAvailable: boolean;
    usbAvailable: boolean;
  };
}

export async function gatherDeviceInfo(): Promise<DeviceInfo> {
  let serverData = { ip: 'Unknown', headers: {}, protocol: 'unknown' };
  try {
    const res = await fetch('/api/visitor');
    if (res.ok) {
      serverData = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch server visitor info', e);
  }

  // Safely access navigator.connection
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  // WebGL Fingerprint
  let webglVendor = 'Unknown';
  let webglRenderer = 'Unknown';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {}

  // Battery API
  let batteryLevel = 'Unknown';
  let batteryCharging = 'Unknown';
  try {
    if ('getBattery' in navigator) {
      const battery: any = await (navigator as any).getBattery();
      batteryLevel = `${Math.round(battery.level * 100)}%`;
      batteryCharging = battery.charging ? 'Charging' : 'Discharging';
    }
  } catch (e) {}

  // Media Devices
  let mediaDeviceCount: number | string = 'Unknown';
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      mediaDeviceCount = devices.length;
    }
  } catch (e) {}

  // Geolocation (IP based)
  let locationData;
  try {
    const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (geoRes.ok) {
      const geo = await geoRes.json();
      locationData = {
        city: geo.city,
        region: geo.region,
        country: geo.country,
        lat: parseFloat(geo.latitude),
        lon: parseFloat(geo.longitude),
        org: geo.organization || geo.organization_name || 'Unknown'
      };
    }
  } catch (e) {}

  // Canvas fingerprinting
  let canvasFingerprint = 'Unknown';
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Digital Footprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Digital Footprint', 4, 17);
      const dataURL = canvas.toDataURL();
      
      let hash = 0;
      for (let i = 0; i < dataURL.length; i++) {
        const char = dataURL.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      canvasFingerprint = Math.abs(hash).toString(16);
    }
  } catch (e) {}

  // Storage
  let storageQuotaGB;
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota) {
        storageQuotaGB = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);
      }
    }
  } catch (e) {}

  return {
    server: serverData,
    client: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      vendor: navigator.vendor,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: nav.deviceMemory,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      devicePixelRatio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      } : undefined,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      maxTouchPoints: navigator.maxTouchPoints,
      pdfViewerEnabled: navigator.pdfViewerEnabled,
      webdriver: navigator.webdriver,
      pluginsCount: navigator.plugins.length,
      webglVendor,
      webglRenderer,
      batteryLevel,
      batteryCharging,
      mediaDeviceCount,
      location: locationData,
      canvasFingerprint,
      storageQuotaGB,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      bluetoothAvailable: 'bluetooth' in navigator,
      usbAvailable: 'usb' in navigator
    }
  };
}
