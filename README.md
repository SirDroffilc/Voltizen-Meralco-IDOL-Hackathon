# ⚡Voltizen 

> A unified "social utility" platform from Team BoltezV — Meralco IDOL Hackathon 2025.

Voltizen helps households move from "bill shock" to "bill control" by combining appliance-level consumption insights with community-driven maps and reporting.

## Problem — "Bill Shock"

Monthly electricity bills can spike unexpectedly, leaving households confused and without clear ways to identify causes. Existing tools are helpful but fragmentary: users still lack a single, trusted surface to understand personal consumption, compare with peers, and collaborate on conservation.

## Our solution

Voltizen is built around two interconnected pillars:

-   **Intelligent Consumption Hub** — a personal appliance inventory with estimated bills and AI-powered appliance detection.
-   **Community-Driven Map** — an interactive map that overlays community data (reports, announcements, hazards) and social consumption info.

These pieces turn passive consumers into empowered, connected "Voltizens" who can monitor, learn, and act together.

## Core features

### 1) Intelligent Consumption Hub

-   Manual entry: input device type, wattage and usage.
-   AI Appliance Scanner (YOLOv8): detect appliances from images and suggest average wattage.
-   Trusted connections: build a private network, control sharing (Private / Network Only / Public).

### 2) Community-Driven Map

-   Social consumption layer: view connections' shared consumption summaries on the map.
-   Community reporting: report hazards (leaning poles, exposed wires) with a credibility/karma system and admin verification to prevent spam.
-   Meralco announcements: show maintenance and warning layers on the map.

## Technologies

-   Frontend: React + Vite
    -   Routing: React Router
    -   Mapping: React Leaflet
-   Backend / BaaS: Firebase
    -   Auth: Firebase Auth
    -   Database: Cloud Firestore (real-time listeners)
-   AI / ML: Python + Flask backend running YOLOv8 (custom dataset)
-   Image hosting: Cloudinary
-   Version control: Git & GitHub

## Team (BoltezV)

-   Ford Torion — Project Manager / Backend Lead
-   Patrick Ancajas — Frontend Lead
-   Axel Arceleta — Backend Lead
-   Anthon Maniago — AI/ML Lead
-   Irwen Fronda — Frontend Lead

---

For setup, usage notes, and contribution guidelines see the `src/` folder and the project documentation.
