import { sequelize } from "../sequelize.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

class Show extends Model<
  InferAttributes<Show>,
  InferCreationAttributes<Show>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare startTime: Date;
  declare endTime: Date;
}

Show.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize }
);

export default Show;
