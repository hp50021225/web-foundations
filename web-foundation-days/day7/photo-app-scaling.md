# SnapShare: Scaling Plan & Architecture

## 1. Assumptions & Daily Active Users (DAU)
- **Registered Users**: 10,000,000 users.
- **Activity Rate**: 10% active per day.
- **Calculation**: $10,000,000 \times 10\% = 1,000,000$ Daily Active Users (DAU).
- **Behavior**: Each active user uploads 1 photo/day and views 50 feed pages/day.
- **File Sizes**: Average photo is 2 MB; thumbnail version is 50 KB (0.05 MB). Total size per upload = 2.05 MB.
- **Rounding Rule**: 1 day $\approx 100,000$ seconds for estimation convenience. Peak traffic is calculated as $\sim 5\times$ average load.

---

## 2. Load & Storage Calculations
### Uploads (Writes) per Second
- **Daily Volume**: $1,000,000 \text{ users} \times 1 \text{ upload} = 1,000,000 \text{ uploads/day}$
- **Average Rate**: $1,000,000 \div 100,000 \text{ seconds} = 10 \text{ writes/sec}$
- **Peak Rate ($5\times$)**: $\approx 50 \text{ writes/sec}$

### Feed Views (Reads) per Second
- **Daily Volume**: $1,000,000 \text{ users} \times 50 \text{ feed views} = 50,000,000 \text{ views/day}$
- **Average Rate**: $50,000,000 \div 100,000 \text{ seconds} = 500 \text{ reads/sec}$
- **Peak Rate ($5\times$)**: $\approx 2,500 \text{ reads/sec}$

### Annual Storage Growth
- **Daily Storage**: $1,000,000 \text{ uploads} \times 2.05 \text{ MB} = 2,050,000 \text{ MB/day} = 2.05 \text{ TB/day}$
- **Annual Storage**: $2.05 \text{ TB/day} \times 365 \text{ days} = 748.25 \text{ TB/year}$ (approx. ~750 TB/year)

---

## 3. System Read/Write Profile
- **Profile**: The system is **heavily read-heavy** (500 feed reads vs. 10 writes per second, or a 50:1 ratio).
- **Design Impact**: Because reads heavily outweigh writes, the architecture relies heavily on read replicas to scale database queries and a Redis cache to serve fast feed views.

---

## 4. Why Photos Don't Belong in the Database
Storing massive binary files (like 2 MB photos) directly inside a relational database will quickly bloat table sizes, slow down query performance, and make backups extremely difficult. Instead, databases should only store lightweight **metadata** (such as owner ID, caption text, upload timestamp, and the public URL string), while the actual image files are offloaded to dedicated **Object Storage** (like AWS S3).

---

## 5. Architecture Diagram

```text
[Browser / Mobile Client]
     │
     ├─> Static UI files (HTML/CSS/JS) ──> [ CDN ]
     │
     └─> API Requests (Upload / Feed) ──> [ Load Balancer ]
                                                 │
                            ┌────────────────────┼────────────────────┐
                            v                    v                    v
                       [ App Server 1 ]     [ App Server 2 ]     [ App Server 3 ]
                            │                    │                    │
                            ├────────────────────┴────────────────────┤
                            │                                         v
                            │                                   [ Redis Cache ]
                            v writes                              (feed caches)
                       [ Primary DB ]
                            │ copy
                            v
                       [ Read Replica ] <── reads (feed lists)
                            │
                            │ enqueue thumbnail job
                            v
                       [ Message Queue ] ──> [ Background Worker ] ──> Generates Thumbnail
                                                      │
                                                      └──────> [ Object Storage (S3) ]