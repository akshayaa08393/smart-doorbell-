// Mock notifications data for SmartGuard

export const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: "notif_001",
    title: "New Visitor Detected",
    message: "IR sensor detected someone at your front door.",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    timeFormatted: "10:42 AM",
    read: false,
    type: "visitor",
    visitorId: "VIS-003",
    icon: "user-check",
    priority: "high"
  },
  {
    id: "notif_002",
    title: "Visitor Image Stored",
    message: "ESP32-CAM image successfully stored in cloud storage.",
    timestamp: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    timeFormatted: "10:43 AM",
    read: false,
    type: "storage",
    visitorId: "VIS-003",
    icon: "database",
    priority: "normal"
  },
  {
    id: "notif_003",
    title: "Visitor Detected",
    message: "Visitor VIS-002 detected at 09:18 AM.",
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    timeFormatted: "09:18 AM",
    read: true,
    type: "visitor",
    visitorId: "VIS-002",
    icon: "user-check",
    priority: "normal"
  },
  {
    id: "notif_004",
    title: "Hardware Gateway Online",
    message: "ESP32-CAM Wi-Fi connected (RSSI: -58 dBm, IP: 192.168.1.145).",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    timeFormatted: "05:30 AM",
    read: true,
    type: "system",
    icon: "wifi",
    priority: "low"
  }
];
