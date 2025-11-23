import Ticket from "./models/Ticket.js";
import RoleModel from "./models/Role.js";
import { Role, RoleDescription, TicketCost, TicketType } from "./enums.js";

export async function seedData() {
  await seedRoles();
  await seedTickets();
}

async function seedRoles() {
  const descriptions: Record<Role, RoleDescription> = {
    [Role.User]: RoleDescription.User,
    [Role.Admin]: RoleDescription.Admin,
    [Role.Owner]: RoleDescription.Owner,
  };

  for (const role of Object.values(Role)) {
    await RoleModel.findOrCreate({
      where: { role },
      defaults: { role, description: descriptions[role] },
    });
  }
}

async function seedTickets() {
  await Ticket.findOrCreate({
    where: { kind: TicketType.Regular },
    defaults: { kind: TicketType.Regular, price: TicketCost.Regular },
  });
  await Ticket.findOrCreate({
    where: { kind: TicketType.Priority },
    defaults: { kind: TicketType.Priority, price: TicketCost.Priority },
  });
}
