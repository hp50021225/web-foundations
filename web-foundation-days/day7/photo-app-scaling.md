# Scaling Plan: High-Scale Photo-Sharing Platform

## 1. System Architecture Overview

    [Client App / Web]
            |
            v
    [CDN (Cloudflare / CloudFront)]
            |
            v
    [Load Balancer (Nginx / ALB)]
            |
            v
    [API Application Servers (Node/Python)]
           /         |                     \
          /          |                      \
         v           v                       v
    [Redis Cache]  [PostgreSQL Primary]   [S3 Object Storage]
                         |                         |
                         v                         v
                   [Read Replicas]         [Message Queue (SQS)]
                                                   |
                                                   v
                                           [Background Workers]

---

## 2. Component Descriptions

* **CDN (Content Delivery Network):** Caches static assets and high-demand image files globally edge-side to drastically reduce latency and offload bandwidth from origin servers.
* **Load Balancer:** Distributes incoming HTTP traffic evenly across multiple application server instances to ensure high availability and prevent single-point overload.
* **API Application Servers:** Handles client requests, user authentication, business logic validation, metadata database transactions, and background task dispatching.
* **Redis In-Memory Cache:** Stores frequently accessed database queries, user sessions, and trending feed data in RAM for sub-millisecond retrieval speeds.
* **PostgreSQL Primary Database:** Serves as the authoritative ACID-compliant transactional database handling all database write operations (user registration, photo metadata creation, comments).
* **PostgreSQL Read Replicas:** Asynchronously replicates data from the primary instance to serve high-volume `GET` read queries without locks or primary database exhaustion.
* **S3 Object Storage:** Provides highly durable, horizontally scalable storage designed specifically for storing raw, high-resolution image binaries and generated thumbnail files.
* **Message Queue (RabbitMQ / AWS SQS):** Decouples image processing pipelines by queuing asynchronous background jobs immediately after file uploads complete.
* **Background Image Workers:** Consumes job messages from the queue to process, resize, optimize, and generate multi-resolution thumbnails without blocking user requests.

---

## 3. End-to-End Image Upload Lifecycle Walkthrough

1. **Upload Initiation:** The client application issues an HTTP `POST /api/photos/upload` request containing the image binary and photo metadata (title, caption, location) to the API Gateway/Load Balancer.
2. **Metadata Validation & Storage:** An Application Server instance validates the request payload, generates a unique image ID, and writes the lightweight metadata record into the **PostgreSQL Primary Database**.
3. **Binary Storage Offloading:** The Application Server uploads the raw image file directly to **S3 Object Storage** under a key corresponding to the generated image ID.
4. **Asynchronous Job Dispatch:** Once S3 confirms file receipt, the Application Server pushes a `process-thumbnail` payload containing the `imageId` and `s3Path` into the **Message Queue**.
5. **Immediate Client Response:** The Application Server responds to the user with `201 Created` and the new photo details, allowing the user to continue browsing immediately without waiting for thumbnail generation.
6. **Worker Processing:** A **Background Image Worker** picks up the job from the Message Queue, fetches the raw image from S3, generates standard display resolutions and thumbnails, and uploads the processed variants back to S3.
7. **Cache Invalidation & Feed Sync:** The worker updates the photo status in the database to `ready` and invalidates relevant **Redis Cache** keys so the user's updated feed reflects the newly available thumbnails.

---

## 4. Architectural Trade-offs & Mitigation

### Trade-off 1: Replication Lag & Eventual Consistency
* **Issue:** Because read replicas receive updates asynchronously from the primary database, there is a short millisecond-level delay before newly written records propagate to every read replica. A user posting a picture might immediately refresh their feed and hit a replica that has not yet received the new row.
* **Mitigation:** Implement read-your-own-writes consistency by routing initial feed refreshes for the active author directly to the primary database or local session cache for the first 5 seconds following an upload action.

### Trade-off 2: Message Queue Backlog During Traffic Spikes
* **Issue:** During peak hours or breaking viral events, the rate of incoming photo uploads can exceed the capacity of active background image workers, creating a backlog in the message queue and delaying thumbnail generation for end users.
* **Mitigation:** Configure Auto-Scaling Policies for worker nodes based on total queue depth (e.g., spin up additional worker instances whenever the queue length exceeds 1,000 pending messages).