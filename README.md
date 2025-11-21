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