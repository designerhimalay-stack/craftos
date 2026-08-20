# CraftOS — Next-Generation Workforce & Shift Management App (ELROI 2.0)

A high-performance, human-centered UI/UX web application designed for industrial trades and remote workforce operations (mining, energy, fabrication, FIFO/DIDO).

![CraftOS Prototype](https://img.shields.io/badge/CraftOS-ELROI%202.0-C5221F?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/ES6_JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🌟 Key Features

### 1. Zero-Trust Authentication & 2FA Setup
- **Interactive 4-Step Stepper**: Corporate sign-in, credential verification, and real-time password compliance checklist.
- **Dynamic 2FA Authenticator Enrollment**: SVG QR code generator, 1-click secret setup key clipboard copy, and auto-advancing 6-digit TOTP input fields.
- **Emergency Offline Backup Codes**: Encrypted 5-code vault for remote site access.

### 2. 9-Slide Feature Onboarding Tour
- Engaging carousel covering all core operational features with progress indicators, smooth transitions, and skip options.

### 3. Operations Dashboard & Dynamic Shift Calendar
- **Mobilization Countdown Banner**: Live hero countdown to upcoming site swing (*"Mobilising in 4 Days"*).
- **Interactive Multi-Day Calendar**: Timeline visualization for Confirmed Rosters, Training Sessions, and RNR / Leave periods with filter controls.
- **Date Inspection & Mobilization Sheet**: Bottom sheet modal showing flight details (`QF1924`) and camp accommodation.

### 4. Work Rosters & Smart Support Inquiries
- Real-time job assignment cards with confirmation status alerts.
- **1-Tap Inquiry**: Pre-fills support messages with Job Code and Site metadata.

### 5. Live Departmental Support Desk
- Multi-department ticketing (*Compliance, HSE, Planning, Recruitment*).
- Interactive 1-on-1 live chat interface with real-time response simulation.

### 6. Leave Scheduler & Qualifications Wallet
- Date range leave planner with conflict prevention.
- Digital ticket wallet with expiry countdown warnings (*"Expires in 28 Days"*) and ticket upload simulator.

### 7. Safety & Policy Library
- Comprehensive repository for OH&S policies, SWMS, and site cardinal rules with offline document viewer.

---

## 📱 Hardware & Viewport Simulation

- **Apple iPhone 12 Pro Max Viewport**: Configured to exact physical dimensions (`428px × 926px`, `19.5:9` aspect ratio) with notch, iOS status bar, and home swipe indicator.
- **Fluid Screen Switcher**: 1-click toggle to expand the interface to a responsive desktop/tablet layout.

---

## 🚀 Running the Project Locally

### Instant Browser Launch
Simply open `index.html` in any web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Local HTTP Server
Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then navigate to `http://localhost:8080/`.

---

## 🛠️ Tech Stack
- **Architecture**: Zero-dependency Vanilla HTML5, CSS3, ES6 JavaScript.
- **Typography**: Plus Jakarta Sans & JetBrains Mono (Google Fonts).
- **Design System**: Industrial precision design tokens with HSL color architecture and accessible contrast standards.

---

## 📄 License
© 2026 CraftOS. All rights reserved.
