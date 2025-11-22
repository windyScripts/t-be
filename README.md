Backend using node, express, sql (or mongo, going with sql), .env (would like to use that env thing that allowed for multiple envs dotenvx)
How are tickets and booking different?

additional considerations:
sqeuelize as ORM
Bcrypt for credential encryption
credentials, 
session management,
authentication,
authorization

database structure:



API endpoints:
get/tickets
post/tickets (check admin role)
get/safari-timings

post/bookings
get/bookings/:id
get/users/:id/bookings

post/payments/initiate
post/payments/verify

can deploy on railway if I get time.

user: id, username, password, email, role
role: id, role (admin: user and can add tickets without going through transactions, user: can book tickets through regular flow, owner: admin but also can invite admins), descriptions
userRole: id, userId, roleId
<!-- Booking (userTickets): id, ticket ids, userid -->
ticket: id, price, kind (regular, special)
<!-- bookingTicket: id, bookingid, ticketid -->
payment: id, bookingid, amount,
show: show has a id, startTime, endTime (both datetimes) and an array of objects: {ticket ids and ticket quantities}
showTickets: has showid, with ticketId and quantity of remaining, allows users to select timing, and cost
Booking: UserShowTicket: A user can have many showTickets, each showTicket belongs to one user. has Quantity booked.

Why would the frontend have an id? it should check by email.

a ticket is associated with a user, a show and a booking. A booking belongs to a user, has a number of ShowTickets

is a booking a user(ShowTicket)

A payment has an id, a status and a bookingId

When you create a show, you also create two showTickets, one for regular and one for priority. When you create a booking, you reduce the number of tickets available in each showTicket, as long as the number of remaining tickets is greater than the booking requirement

