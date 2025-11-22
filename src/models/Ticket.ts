import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { TicketCost, TicketType } from "../enums.js";

class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  declare id: CreationOptional<number>;
  declare price: number;
  declare kind: TicketType;
}

Ticket.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    kind: {
      type: DataTypes.ENUM(TicketType.Regular, TicketType.Priority),
      allowNull: false,
    },
  },
  {
    sequelize,
    hooks: {
      beforeValidate: (ticket) => {
        if (ticket.kind === TicketType.Regular) {
          ticket.price = TicketCost.Regular;
        } else if (ticket.kind === TicketType.Priority) {
          ticket.price = TicketCost.Priority;
        }
      },
    },
  }
);

export default Ticket;
