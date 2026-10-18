// Mock visitor dataset for initial state and simulation pool

export const SAMPLE_VISITOR_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    label: "Delivery Courier / Guest",
    type: "Delivery Courier"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    label: "Service Technician",
    type: "Service Personnel"
  },
  {
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    label: "Visitor at Front Porch",
    type: "Guest / Friend"
  },
  {
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    label: "Postal Carrier",
    type: "Postal Service"
  },
  {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    label: "Neighbor",
    type: "Neighbor"
  },
  {
    url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    label: "Unknown Visitor",
    type: "Unknown Visitor"
  }
];

export const INITIAL_MOCK_VISITORS = [
  {
    id: "rec_001",
    visitorId: "VIS-003",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    detectedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    date: "18 October 2026",
    time: "10:42 AM",
    status: "Detected",
    isNew: true,
    storageStatus: "Stored",
    notificationStatus: "Delivered",
    visitorType: "Delivery Courier",
    confidence: "98.2%",
    sensorTrigger: "IR Sensor (Digital Pin 13 HIGH)",
    cameraDevice: "ESP32-CAM (OV2640)",
    resolution: "1600x1200 UXGA",
    notes: "Courier standing in front of contactless doorbell scanner."
  },
  {
    id: "rec_002",
    visitorId: "VIS-002",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    detectedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(), // ~2 hrs ago
    date: "18 October 2026",
    time: "09:18 AM",
    status: "Detected",
    isNew: false,
    storageStatus: "Stored",
    notificationStatus: "Delivered",
    visitorType: "Service Personnel",
    confidence: "97.5%",
    sensorTrigger: "IR Sensor (Digital Pin 13 HIGH)",
    cameraDevice: "ESP32-CAM (OV2640)",
    resolution: "1600x1200 UXGA",
    notes: "Maintenance technician arrived for inspection."
  },
  {
    id: "rec_003",
    visitorId: "VIS-001",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // Yesterday
    date: "17 October 2026",
    time: "04:30 PM",
    status: "Detected",
    isNew: false,
    storageStatus: "Stored",
    notificationStatus: "Delivered",
    visitorType: "Postal Service",
    confidence: "99.1%",
    sensorTrigger: "IR Sensor (Digital Pin 13 HIGH)",
    cameraDevice: "ESP32-CAM (OV2640)",
    resolution: "1600x1200 UXGA",
    notes: "Mail carrier dropped parcel into mailbox."
  }
];
