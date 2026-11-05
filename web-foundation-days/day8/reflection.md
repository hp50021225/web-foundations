# Course Reflection

## 1. Most Difficult Concept Overcome
The most challenging concept in the course was mastering system concurrency and race condition mitigation. Understanding how concurrent web requests hit backend servers simultaneously—potentially causing double-bookings or inconsistent database states—was difficult to grasp conceptually. I overcame this by breaking down transaction isolation levels and practicing SQL atomic updates (`UPDATE ... WHERE status = 'AVAILABLE'`) combined with optimistic concurrency control using explicit version counters.

## 2. Capstone Improvement Plan
Based on peer and mentor feedback from design reviews, I would improve the caching strategy for my QuickNotes design. Specifically, I would introduce explicit cache invalidation logic using the Cache-Aside pattern paired with TTL expirations to guarantee users never receive stale search results or deleted notes. Additionally, I would add gateway rate-limiting middleware to protect public API endpoints against automated scraping and brute-force traffic spikes.

## 3. What I Will Learn Next
To build on these foundations, I will implement a production backend using Node.js and Express integrated with PostgreSQL. I also plan to study Redis in depth to build real-time distributed caching layers, pub/sub event channels, and asynchronous worker queues for complex application architectures.