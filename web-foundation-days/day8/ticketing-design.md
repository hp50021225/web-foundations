# TicketHub System Design Specification

## 1. Requirements

### Functional Requirements
* **User Management:** Users can register, log in, and view their purchase history.
* **Event & Seat Discovery:** Users can browse active events and view real-time seat availability maps.
* **Seat Reservation (Hold):** Users can temporarily lock/hold a specific seat for 10 minutes during checkout to prevent double-booking.
* **Checkout & Payment:** Users can complete secure payment to convert a held seat into a confirmed order and ticket.
* **Ticket Management:** Users can view and download their purchased tickets with unique validation QR codes.

### Non-Functional Requirements
* **High Availability & Scalability:** The system must handle a 300× flash-sale traffic surge without crashing.
* **Correctness & Consistency:** Zero tolerance for double-booking; atomic seat locking is mandatory.
* **Low Latency:** Seat map reads must return under 200ms; checkout confirmation under 2 seconds.

---

## 2. Traffic Estimates & Load Calculations
* **Daily Active Users (DAU):** 1,000,000 users.
* **Normal Traffic:** 5,000 requests per second (RPS) read load, 100 RPS write load.
* **Flash-Sale Surge (Peak):** 
  * Read load spikes 300× to **1,500,000 RPS** (users refreshing seat maps).
  * Write load spikes to **15,000 RPS** (simultaneous checkout attempts for high-demand tickets).

---

## 3. API Endpoints Design

### 1. View Seat Map
* **Endpoint:** `GET /api/events/{event_id}/seats`
* **Description:** Retrieves the real-time availability status of all seats for a given event.
* **Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "event_id": "ev_8f7e6d5c4b",
    "seats": [
      { "seat_id": "seat_a1", "section": "VIP", "status": "available", "price": 150.00 },
      { "seat_id": "seat_a2", "section": "VIP", "status": "held", "price": 150.00 }
    ]
  }
}
{
  "event_id": "ev_8f7e6d5c4b",
  "seat_id": "seat_a1"
}
{
  "status": "success",
  "message": "Seat successfully held for 10 minutes.",
  "hold_token": "hold_9a8b7c6d5e",
  "expires_at": "2026-11-07T21:15:00Z"
}
{
  "hold_token": "hold_9a8b7c6d5e",
  "payment_method_nonce": "pm_card_visa_debit"
}
{
  "status": "success",
  "data": {
    "order_id": "ord_123456789",
    "total_amount": 150.00,
    "status": "confirmed",
    "tickets": [
      { "ticket_id": "tix_987654", "seat_id": "seat_a1", "qr_code": "[https://tickethub.io/qr/tix_987654](https://tickethub.io/qr/tix_987654)" }
    ]
  }
}
{
  "status": "success",
  "results": 1,
  "data": {
    "tickets": [
      {
        "ticket_id": "tix_987654",
        "event_name": "World Tour Live",
        "seat_id": "seat_a1",
        "purchased_at": "2026-11-07T20:05:00Z"
      }
    ]
  }
}
{
  "status": "success",
  "message": "Seat hold released successfully."
}
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'available', -- available, held, booked
    version INT DEFAULT 0, -- Used for optimistic concurrency control
    CONSTRAINT unique_event_seat UNIQUE (event_id, seat_number)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    seat_id INT REFERENCES seats(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);