'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init({
    course_name: DataTypes.STRING,
    course_start_date: DataTypes.DATE,
    course_end_date: DataTypes.DATE,
    course_status:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};