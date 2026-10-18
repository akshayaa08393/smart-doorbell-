# SmartGuard — Smart Contactless Doorbell with Intelligent Visitor Monitoring

A modern, high-precision IoT contactless doorbell software prototype designed for smart-home security. The system automatically detects approaching visitors without physical contact, captures high-resolution imagery via an ESP32-CAM (OV2640), validates and transmits event telemetry over Wi-Fi, logs records to Firebase (with full local simulation fallback), and provides a smart-home homeowner dashboard.

---

## 🌟 Key Features

1. **Contactless IR Detection & Camera Simulation**
   - Realistic 7-stage pipeline simulation:
     `IR Sensor Trigger` ➔ `ESP32-CAM Wake & Capture` ➔ `Payload Validation` ➔ `Wi-Fi Transmission` ➔ `Firebase Storage & Indexing` ➔ `Homeowner Notification & Chime` ➔ `Live Dashboard Update`
   - Real-time ESP32 UART serial monitor telemetry logs during simulation.

2. **Smart-Home Security Dashboard**
   - Dark navy & cyan glassmorphism theme with glowing status badges.
   - Live system status: `🟢 Monitoring Active`, `🟡 Detecting Visitor...`, `🔵 Capturing Image...`, `🔵 Uploading...`, `🟢 Visitor Recorded`.
   - Metrics cards: Total Visitors, Today's Visitors, and Unread Security Alerts.
   - Latest Visitor featured card with camera viewfinder overlay (recording red dot, crosshairs, ISO, timestamp HUD).
   - Interactive Workflow Architecture diagram showing the end-to-end data flow.

3. **Live Visitor Stream**
   - Real-time monitor with dual status indicators: `🟢 Monitoring Active` and `🟢 Visitor Detected`.
   - High-definition captured photo frame with camera HUD.
   - Instant controls: **View Image**, **Save Record**, **Dismiss**, and **Simulate Trigger**.

4. **Visitor History Records**
   - View past visitor records with photos, timestamps, detection trigger, and cloud storage status.
   - Card Grid and Table View toggles.
   - Live search keyword filtering (by visitor ID, classification, notes, or date).
   - Date filtering (All, Today, Yesterday) and sorting (Newest / Oldest first).
   - Record detail modal with zoomed inspection and deletion controls.

5. **Homeowner Notifications & Doorbell Chime**
   - In-app notification dropdown and dedicated management page.
   - Synthesized real dual-tone audio chime (Ding-Dong at 659Hz / 523Hz) using browser Web Audio API (no external MP3 asset dependency).
   - Read / unread status tracking and "View Visitor" quick navigation.

6. **Authentication & Evaluation Mode**
   - Complete login and registration forms with validation.
   - **1-Click Demo Login** button designed specifically for faculty evaluation.
   - Pre-configured demo user: `homeowner@smartguard.com`.
   - Supports both Firebase Authentication and local persistent mock sessions.

7. **Hardware Integration Ready**
   - Settings toggle between `Demo / Simulation Mode` and `Physical ESP32-CAM Hardware Mode`.
   - Configurable ESP32-CAM local web server endpoint (e.g. `http://192.168.1.145`).
   - Includes full Arduino C++ firmware sketch in [`esp32_firmware/SmartGuard_ESP32CAM.ino`](esp32_firmware/SmartGuard_ESP32CAM.ino).

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- Modern web browser (Chrome, Edge, Firefox, Brave)

### Steps

1. **Install Dependencies** (already installed in workspace):
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the Application**:
   Navigate to [http://localhost:5173/](http://localhost:5173/) in your web browser.

4. **Sign In**:
   - Click the **"1-Click Demo Login (College Evaluation)"** button, or enter:
     - **Email:** `homeowner@smartguard.com`
     - **Password:** `password123`

---

## 📁 Project Architecture

```
doorbell/
├── esp32_firmware/
│   └── SmartGuard_ESP32CAM.ino     # Complete Arduino firmware for ESP32-CAM & IR Sensor
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Brand header, live clock, cloud status, profile
│   │   ├── Sidebar.jsx             # Navigation drawer & active monitoring widget
│   │   ├── StatusCard.jsx          # Reusable dashboard metric cards
│   │   ├── VisitorCard.jsx         # Latest visitor featured viewfinder card
│   │   ├── VisitorTable.jsx        # History table with search, filters, and actions
│   │   ├── NotificationPanel.jsx   # Notification list & dropdown
│   │   ├── VisitorModal.jsx        # High-res inspection modal with hardware specs
│   │   ├── WorkflowSimulationModal.jsx # Real-time serial monitor & simulation tracker
│   │   ├── WorkflowTimeline.jsx    # Visual pipeline diagram of system architecture
│   │   └── Toast.jsx               # Floating toast notifications
│   ├── data/
│   │   ├── mockVisitors.js         # Initial mock visitor dataset with realistic portraits
│   │   └── mockNotifications.js    # Default security alert logs
│   ├── pages/
│   │   ├── Login.jsx               # Login page with 1-click Demo Login
│   │   ├── Register.jsx            # Account registration with validation
│   │   ├── Dashboard.jsx           # Master monitoring dashboard
│   │   ├── LiveVisitor.jsx         # Dedicated current visitor feed
│   │   ├── VisitorHistory.jsx      # Filterable history archive (grid & table modes)
│   │   ├── Notifications.jsx       # Alert center with audio toggle
│   │   └── Settings.jsx            # Hardware mode, Firebase telemetry, and profile
│   ├── services/
│   │   ├── authService.js          # Authentication service (Firebase + Local Mock)
│   │   ├── firebase.js             # Firebase configuration with graceful auto-fallback
│   │   ├── visitorService.js       # Visitor CRUD, storage, and 7-stage simulation runner
│   │   ├── notificationService.js  # Notification dispatcher with synthesized audio chime
│   │   └── esp32Service.js         # Hardware abstraction layer (Simulation & Real ESP32)
│   ├── utils/
│   │   ├── dateTime.js             # Date/time formatting and visitor ID generators
│   │   └── validation.js           # Form input validation helpers
│   ├── App.css                     # Responsive layout and drawer rules
│   ├── App.jsx                     # Top-level state and page router
│   ├── index.css                   # Security dark theme tokens and glassmorphism styling
│   └── main.jsx                    # React entrypoint
├── .env.example                    # Firebase environment variable template
├── package.json
└── vite.config.js
```

---

## 🔥 Firebase Setup (Optional)

SmartGuard works **100% out of the box** without any cloud setup required. If you want to connect a live Google Firebase project for production:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Enable:
   - **Authentication** (Email/Password provider)
   - **Cloud Firestore Database** (in test/production mode)
   - **Cloud Storage** (for visitor image blobs)
3. Create a `.env` file in the root folder with your credentials (see `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-app
   VITE_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:...
   ```
4. Restart the development server (`npm run dev`). The cloud badge on the top navbar will automatically switch to **"🟢 Firebase Synced"**.

---

## 🎬 College Faculty Demonstration Flow

Here is the exact step-by-step walkthrough to demonstrate the project to professors and evaluators:

1. **Sign In**:
   - Open [http://localhost:5173/](http://localhost:5173/).
   - Point out the **"Local Mock Authentication Mode"** banner indicating zero external dependencies.
   - Click **"1-Click Demo Login (College Evaluation)"**.

2. **Review the Dashboard & Architecture**:
   - Point out the top header: Brand, hardware mode (`HW: Simulation Mode`), Cloud status (`Cloud: Local Mock Storage`), and live digital clock.
   - Point out the **System Status**: `🟢 Monitoring Active`.
   - Explain the **System Workflow Architecture** interactive pipeline diagram (`IR Sensor` ➔ `ESP32-CAM` ➔ `Validation` ➔ `Wi-Fi` ➔ `Firebase` ➔ `Push Notification` ➔ `Live Dashboard`).

3. **Demonstrate Visitor Detection (Simulate Visitor)**:
   - Click the green **"Simulate Visitor"** button on the dashboard.
   - The **Simulation Engine Modal** will appear:
     - Notice the system status dynamically changing (`🟡 Detecting Visitor...` ➔ `🔵 Capturing Image...` ➔ `🔵 Uploading...` ➔ `🟢 Visitor Recorded`).
     - Point out the **ESP32-CAM Serial Monitor** logs displaying real-time UART messages (`[IR_SENSOR] GPIO 13 HIGH`, `[OV2640] Frame buffer captured`, etc.).
     - Hear the synthesized doorbell chime sound.
     - A floating notification toast will pop up in the lower-right corner.

4. **Inspect Latest Visitor Card**:
   - Note that the newly detected visitor now appears as the featured **Latest Visitor** with `New Visitor` badge, camera timestamp, and viewfinder crosshairs.
   - Click **"View Details"** to show the **Visitor Detail Modal** with high-resolution image, trigger pin (`GPIO 13`), camera sensor (`OV2640`), and storage verification.

5. **Examine Live Visitor Page**:
   - In the sidebar, click **"Live Visitor"**.
   - Show the live stream viewfinder and dual status badges (`🟢 Monitoring Active` and `🟢 Visitor Detected`).
   - Click **"Save Record"** or **"Simulate Visitor Detection"**.

6. **Inspect Visitor History**:
   - In the sidebar, click **"Visitor History"**.
   - Show that the newly simulated visitor has been added to the chronological archive.
   - Demonstrate the **Search Bar** (type `VIS-` or `Courier` or `Neighbor`).
   - Switch between **Card Grid** and **Table View**.

7. **Show Notifications Center**:
   - Click the bell icon in the navbar or **"Notifications"** in the sidebar.
   - Show unread alerts (`New Visitor Detected`, `Visitor Image Stored`).
   - Click **"Mark All as Read"** and demonstrate the **Sound: Active / Muted** toggle.

8. **Review System Settings & Hardware Preparation**:
   - Click **"Settings"** in the sidebar.
   - Show the **Hardware Integration Mode**:
     - `(•) Demo / Simulation Mode` (active)
     - `( ) Physical ESP32-CAM Hardware Mode`
   - Point out the configurable ESP32-CAM IP URL (`http://192.168.1.145`) and mention the provided Arduino firmware in `esp32_firmware/SmartGuard_ESP32CAM.ino`.

---

## 🔌 How Physical ESP32-CAM Hardware Integrates Later

When you are ready to connect physical hardware:
1. Flash the ESP32-CAM using the Arduino IDE with [`esp32_firmware/SmartGuard_ESP32CAM.ino`](esp32_firmware/SmartGuard_ESP32CAM.ino).
2. Wire the IR sensor output to **GPIO 13** of the ESP32-CAM.
3. Power the ESP32-CAM (5V / 2A recommended) and note the IP printed in the Arduino Serial Monitor (e.g. `192.168.1.145`).
4. In the web dashboard **Settings** page:
   - Select **Physical ESP32-CAM Hardware Mode**.
   - Enter your ESP32-CAM IP URL.
5. `esp32Service.js` will automatically poll the physical hardware's `/status` and `/capture` endpoints instead of the mock data generator.
