import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Role as RoleEnum, RoleDescription } from "../enums.js";

class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  declare id: CreationOptional<number>;
  declare role: RoleEnum;
  declare description: RoleDescription;
}

Role.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role: {
      type: DataTypes.ENUM(RoleEnum.Admin, RoleEnum.User, RoleEnum.Owner),
      allowNull: false,
    },
    description: {
      type: DataTypes.ENUM(
        RoleDescription.Admin,
        RoleDescription.User,
        RoleDescription.Owner
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    indexes: [{ unique: true, fields: ["role"] }],
  }
);

export default Role;
