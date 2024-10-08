import { Op } from "sequelize";
import db from "../models/index";

const Course = db.Course;
const Customer = db.Customer;
const Bed = db.Bed;

Customer.hasOne(Bed, { foreignKey: 'id_customer' });
Course.hasMany(Customer, { foreignKey: 'id_course' });

const getAllCourse = async () => {
    try {
        const courses = await Course.findAll({
            nest: true,
            raw: true,
            order: [['id', 'ASC']]
        })
        return { status: true, result: courses }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getCoursesStartedDuringThePeriod = async (start_date, end_date) => {
    try {
        const searchResult = await Course.findAll({
            where: {
                [Op.or]: {
                    course_start_date: {
                        [Op.between]: [start_date, end_date]
                    },
                    course_end_date: {
                        [Op.between]: [start_date, end_date]
                    },
                    [Op.and]: {
                        course_start_date: {
                            [Op.lt]: start_date
                        },
                        course_end_date:{
                            [Op.gt]: end_date
                        }
                    },
                    [Op.and]:{
                        course_start_date: {
                            [Op.gte]: start_date
                        },
                        course_end_date:{
                            [Op.lte]: end_date
                        }
                    }
                }

            }
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getEnableCourse = async () => {
    try {
        const courses = await Course.findAll({
            where: {
                course_status: true
            },
            nest: true,
            raw: true,
            order: [['id', 'ASC']]
        })
        return { status: true, result: courses }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getDisableCourse = async () => {
    try {
        const courses = await Course.findAll({
            where: {
                course_status: false
            },
            nest: true,
            raw: true,
            order: [['id', 'ASC']]
        })
        return { status: true, result: courses }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const insertCourse = async (course) => {
    try {
        const newCourse = await Course.create({
            course_name: course.name,
            course_start_date: course.start_date,
            course_end_date: course.end_date,
            course_status: course.status
        })
        return { status: true, result: newCourse }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const updateCourse = async (course) => {
    try {
        await Course.update({
            course_name: course.name,
            course_start_date: course.start_date,
            course_end_date: course.end_date,
            course_status: course.status
        }, {
            where: {
                id: course.id
            }
        })
        return { status: true, result: "Cập nhật Khoá học thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const updateStatusCourse = async (course) => {
    try {
        await Course.update({
            course_status: course.status
        }, {
            where: {
                id: course.id
            }
        })
        return { status: true, result: "Cập nhật Khoá học thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const checkAndUpdateCourseStatus = async (id_course) => {
    try {
        const countCheckoutedCustomer = await Customer.count({
            include: [{
                model: Bed,
                where: {
                    bed_status: false,
                },
                attribute: ['id']
            }],
            where: {
                id_course: id_course
            }
        })
        const countCustomerInCourse = await Customer.count({
            where: {
                id_course: id_course
            }
        })
        if (countCheckoutedCustomer === countCustomerInCourse) {
            await Course.update({
                course_status: false
            }, {
                where: {
                    id: id_course
                }
            })
        }
        return { status: true, msg: 'Kiểm tra và cập nhật khoá học thành công' }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const deleteCourse = async (id) => {
    try {
        await Course.destroy({
            where: {
                id: id
            }
        })
        return { status: true, result: "Xoá Khoá học thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

module.exports = {
    getAllCourse, insertCourse, updateCourse, deleteCourse, getEnableCourse, updateStatusCourse,
    checkAndUpdateCourseStatus, getDisableCourse, getCoursesStartedDuringThePeriod
}