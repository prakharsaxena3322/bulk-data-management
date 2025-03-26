import { DataTypes } from "sequelize";
import { db } from "../db.js";

const Record = db.define("Record", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export { Record };
