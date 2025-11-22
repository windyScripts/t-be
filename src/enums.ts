export enum Role {
  User = "regular_user",
  Admin = "admin",
  Owner = "owner",
}

export enum TicketType {
  Regular = "regular_ticket",
  Priority = "priority_ticket",
}

export enum RoleDescription {
  Admin = "user but can also add tickets without going through transactions",
  User = "can book tickets through regular flow, read bookings",
  Owner = "admin but can also invite admins",
}

export enum TicketCost {
  Regular = 100,
  Priority = 500,
}

export enum PaymentStatus {
  Pending = "pending",
  Success = "success",
  Failed = "failed",
}

export enum BookingStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
}
