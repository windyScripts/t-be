import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import Show from "./Show.js";
import Ticket from "./Ticket.js";

class ShowTicket extends Model<
  InferAttributes<ShowTicket>,
  InferCreationAttributes<ShowTicket>
> {
  declare id: CreationOptional<number>;
  declare showId: number;
  declare ticketId: number;
  declare remainingTickets: number;
}

ShowTicket.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Show, key: "id" },
      onDelete: "CASCADE",
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Ticket, key: "id" },
      onDelete: "CASCADE",
    },
    remainingTickets: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    indexes: [
      { unique: true, fields: ["showId", "ticketId"] },
    ],
  }
);

export default ShowTicket;
