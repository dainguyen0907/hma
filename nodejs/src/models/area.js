'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Area.init({
    area_name: DataTypes.STRING,
    area_floor_quantity: DataTypes.INTEGER,
    area_room_quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Area',
  });
  return Area;
};