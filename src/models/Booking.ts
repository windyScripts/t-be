import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import User from "./User.js";
import ShowTicket from "./ShowTicket.js";
import { BookingStatus } from "../enums.js";

// User(ShowTicket) bridge: links a user to a specific show-ticket allocation.
class Booking extends Model<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare showTicketId: number;
  declare quantity: number;
  declare status: BookingStatus;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    showTicketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ShowTicket, key: "id" },
      onDelete: "CASCADE",
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(BookingStatus)),
      allowNull: false,
      defaultValue: BookingStatus.Pending,
    },
  },
  {
    sequelize,
    indexes: [{ unique: true, fields: ["userId", "showTicketId"] }],
  }
);

export default Booking;
