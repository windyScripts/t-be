import User from "./User.js";
import Role from "./Role.js";
import UserRole from "./UserRole.js";
import Show from "./Show.js";
import Ticket from "./Ticket.js";
import ShowTicket from "./ShowTicket.js";
import Booking from "./Booking.js";
import Payment from "./Payment.js";

// Each user has exactly one role; each role can be assigned to many users.
User.hasOne(UserRole, { foreignKey: "userId", as: "userRole" });
UserRole.belongsTo(User, { foreignKey: "userId", as: "user" });

Role.hasMany(UserRole, { foreignKey: "roleId", as: "userRoles" });
UserRole.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// A show has many ShowTickets; each ShowTicket belongs to one show
Show.hasMany(ShowTicket, { foreignKey: "showId", as: "showTickets" });
ShowTicket.belongsTo(Show, { foreignKey: "showId", as: "show" });

// A ticket can appear in many ShowTickets; each ShowTicket references one ticket
Ticket.hasMany(ShowTicket, { foreignKey: "ticketId", as: "showTickets" });
ShowTicket.belongsTo(Ticket, { foreignKey: "ticketId", as: "ticket" });

// Bookings: a user books a specific show-ticket combination
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

ShowTicket.hasMany(Booking, { foreignKey: "showTicketId", as: "bookings" });
Booking.belongsTo(ShowTicket, { foreignKey: "showTicketId", as: "showTicket" });

// Payments: tie a payment to a user and a booking
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });

Booking.hasMany(Payment, { foreignKey: "bookingId", as: "payments" });
Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });
