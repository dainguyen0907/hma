'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Floor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Floor.init({
    id_area: DataTypes.INTEGER,
    floor_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Floor',
  });
  return Floor;
};