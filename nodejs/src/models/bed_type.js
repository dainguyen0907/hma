'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Bed_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bed_type.init({
    bed_type_name: DataTypes.STRING,
    bed_type_default_price: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Bed_type',
  });
  return Bed_type;
};