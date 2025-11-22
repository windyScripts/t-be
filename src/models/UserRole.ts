import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

class UserRole extends Model<
  InferAttributes<UserRole>,
  InferCreationAttributes<UserRole>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare roleId: number;
  declare isEnabled: CreationOptional<boolean>;
  declare updatedAt: CreationOptional<Date>;
}

UserRole.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    isEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    indexes: [{ unique: true, fields: ["userId"] }],
  }
);

export default UserRole;
