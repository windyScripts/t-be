import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import User from "./User.js";
import Booking from "./Booking.js";
import { PaymentStatus } from "../enums.js";

class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare id: CreationOptional<number>;
  declare status: PaymentStatus;
  declare userId: number;
  declare bookingId: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: {
      type: DataTypes.ENUM(
        PaymentStatus.Pending,
        PaymentStatus.Success,
        PaymentStatus.Failed
      ),
      allowNull: false,
      defaultValue: PaymentStatus.Pending,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Booking, key: "id" },
      onDelete: "CASCADE",
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    timestamps: true,
    indexes: [{ fields: ["userId"] }, { fields: ["bookingId"] }],
  }
);

export default Payment;
