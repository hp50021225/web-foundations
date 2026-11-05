# TicketHub System Design Document

## 1. Context, Goals, & Requirements

### Context
TicketHub is a high-concurrency event ticketing platform where users browse concerts/events, reserve seats, and purchase tickets. The system must support smooth daily usage as well as high-volume flash sales when high-demand concert tickets drop.

### Goals
- Enable users to browse events and view real-time seat availability maps.
- Allow users to temporarily hold seats for a 10-minute payment window.
- Process ticket purchases reliably without double-booking any seat.

### Non-Goals
- Third-party ticket resale or secondary marketplace trading.
- Dynamic ticket pricing algorithms or auction systems.

### Functional Requirements
1. Users can view a list of upcoming events and inspect detailed seat maps for a specific event.
2. Users can place a selected seat on a temporary 10-minute hold.
3. Users can complete payment to convert a held seat into a confirmed ticket order.
4. Users can view their purchased tickets in a personal dashboard.

### Non-Functional Requirements
- **Speed**: Seat map API requests must return in under 100 ms; cached seat states served in under 10 ms.
- **Correctness**: Absolute zero double-booking tolerance. Under no circumstances can two users purchase or hold the same physical seat.
- **Fairness & Availability**: First-come, first-served purchasing during flash sales with graceful degradation under traffic surges.

---

## 2. Estimates & Traffic Calculations

### Normal Day Traffic
- **Daily Active Visitors**: 50,000 visitors/day.
- **Page Views**: 50,000 visitors $\times$ 10 pages = 500,000 page views/day.
- **Normal Read RPS**: 500,000 requests $\div$ 86,400 seconds $\approx$ **5.78 reads/sec average** (peak ~30 reads/sec).
- **Daily Ticket Sales**: 5,000 tickets sold/day $\approx$ **0.06 writes/sec average**.

### Flash Sale Peak Traffic ("Big Sale")
- **Peak Load**: 200,000 users attempting to buy 20,000 seats within a **10-minute window (600 seconds)**.
- **Read Requests (Seat Maps)**: 200,000 users constantly refreshing seat maps (~5 refreshes/user in 10 min) = 1,000,000 requests $\div$ 600 seconds = **1,666.7 reads/sec average** (peak ~5,000 reads/sec).
- **Write Requests (Checkout / Holds)**: 20,000 successful seat reservations $\div$ 600 seconds = **33.3 writes/sec average**. However, attempt spikes can reach over **2,000 attempt requests/sec** at the exact second the sale opens.

### Comparison Summary
Normal traffic is negligible (~6 reads/sec), whereas flash sales cause an instantaneous **300x spike in reads** and an intense burst of concurrent write attempts targeting a small set of database rows.

---

## 3. API Design

### 1. `GET /api/v1/events`
- **Description**: Fetch list of upcoming events.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "evt_101",
      "title": "Live in Concert",
      "venue": "National Stadium",
      "date": "2026-12-15T20:00:00Z"
    }
  ]