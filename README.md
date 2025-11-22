Backend for a simple ticketing system built with Node/Express and Sequelize (MySQL), using JWT auth and dotenvx for environment management.

What it does:
- Users can register/login (bcrypt-hashed passwords). Login returns a JWT plus user info.
- Roles are enforced via a Role/UserRole join (user/admin/owner) with an `isEnabled` flag; admin/owner guard certain routes.
- Shows have a name, start/end times. ShowTickets link a show to a ticket type with remaining inventory.
- Tickets are seeded (regular/priority) with prices from enums.
- Bookings tie a user to a show-ticket combo with a quantity and status (pending/paid/failed); inventory is decremented atomically on booking.
- Payments belong to a booking/user; initiation creates a pending payment, verify simulates success and marks booking paid.
- Safari timings endpoint returns shows in a date range with ticket availability and prices. Admin endpoints manage users, roles, shows, bookings.

Key routes (JSON, JWT where required):
- `/register`, `/login`
- `/bookings` GET/POST (current user), `/payments/initiate`, `/payments/verify`
- `/safari-timings` (shows with ticket availability)
- `/admin/*` for admin/owner operations (create/update user, create safari/show, fetch bookings by user's email id)
