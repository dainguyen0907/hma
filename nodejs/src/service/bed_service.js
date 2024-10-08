import moment from "moment";
import db from "../models/index";
import { Op, where } from "sequelize";

const Bed = db.Bed;
const Customer = db.Customer;
const BedType = db.Bed_type;
const Room = db.Room;
const Price = db.Price;
const Floor = db.Floor;
const Course = db.Course;
const Company = db.Company;
const Area=db.Area;

Bed.belongsTo(Customer, { foreignKey: 'id_customer' });
Bed.belongsTo(BedType, { foreignKey: 'id_bed_type' });
Bed.belongsTo(Room, { foreignKey: 'id_room' });
BedType.belongsTo(Price, { foreignKey: 'bed_type_default_price' })
Bed.belongsTo(Price, { foreignKey: 'id_price' });
Room.belongsTo(Floor, { foreignKey: 'id_floor' });
Customer.belongsTo(Course, { foreignKey: 'id_course' });
Customer.belongsTo(Company, { foreignKey: 'id_company' });
Floor.belongsTo(Area,{ foreignKey:'id_area'});


const countBedInUsedByRoomID = async (id_room) => {
    try {
        const countBed = await Bed.count({
            where: {
                id_room: id_room,
                bed_status: true,
                [Op.or]: {
                    bed_checkout: {
                        [Op.lte]: new moment()
                    },
                    [Op.and]: {
                        bed_checkin: {
                            [Op.lte]: new moment()
                        },
                        bed_checkout: {
                            [Op.gte]: new moment()
                        }
                    }
                }

            }
        })
        return { status: true, result: countBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getBedInRoom = async (id_room) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }]
            }, Room, Price, {
                model: BedType,
                include: [Price]
            }
            ],
            where: {
                id_room: id_room,
                bed_status: true,
                [Op.or]: {
                    bed_checkout: {
                        [Op.lte]: new moment()
                    },
                    [Op.and]: {
                        bed_checkin: {
                            [Op.lte]: new moment()
                        },
                        bed_checkout: {
                            [Op.gte]: new moment()
                        }
                    }
                }
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getPreBookedBedInRoom=async(id_room)=>{
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }]
            }, Room, Price, {
                model: BedType,
                include: [Price]
            }
            ],
            where: {
                id_room: id_room,
                bed_status: true,
                bed_checkin:{
                    [Op.gt]: new moment()
                }
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const countBedInRoom = async (id_room) => {
    try {
        const findBed = await Bed.count({
            where: { id_room: id_room }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getRevenueBed = async (dayFrom, dayTo) => {
    try {
        const countCheckin = await Bed.count({
            col: 'bed_checkout',
            where: {
                bed_checkout: {
                    [Op.between]: [dayFrom, dayTo]
                },
                bed_status: false,
            },
        });
        const countRoom = await Bed.count({
            col: 'id_room',
            distinct: true,
            where: {
                bed_checkout: {
                    [Op.between]: [dayFrom, dayTo]
                },
                bed_status: false,
            },
        })
        return { status: true, result: { countCheckin: countCheckin, countRoom: countRoom } }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getRevenueBedInArea = async (dayFrom, dayTo, id_area) => {
    try {
        const countCheckin = await Room.count({
            include: [{
                model: Floor,
                where: {
                    id_area: id_area
                }
            }, {
                model: Bed,
                where: {
                    bed_checkout: {
                        [Op.between]: [dayFrom, dayTo]
                    },
                    bed_status: false,
                }
            }],
        })
        const countRoom = await await Room.count({
            col: 'id',
            distinct: true,
            include: [{
                model: Floor,
                where: {
                    id_area: id_area
                }
            }, {
                model: Bed,
                where: {
                    bed_checkout: {
                        [Op.between]: [dayFrom, dayTo]
                    },
                    bed_status: false
                }
            }]
        });

        return { status: true, result: { countCheckin: countCheckin, countRoom: countRoom } }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getBedInInvoice = async (id_invoice) => {
    try {
        const findBed = await Bed.findAll({
            include: [Customer, Room, BedType, Price],
            where: {
                id_invoice: id_invoice,
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const insertBed = async (bed) => {
    try {
        const rs = await Bed.create({
            id_room: bed.id_room,
            id_customer: bed.id_customer,
            id_price: bed.id_price,
            id_bed_type: bed.id_bed_type,
            bed_checkin: bed.bed_checkin,
            bed_checkout: bed.bed_checkout,
            bed_status: true,
            bed_deposit: bed.bed_deposit,
            bed_lunch_break: bed.bed_lunch_break
        });
        return { status: true, result: rs };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const updateBed = async (bed) => {
    try {
        await Bed.update({
            id_bed_type: bed.id_bed_type,
            id_price: bed.id_price,
            bed_checkin: bed.bed_checkin,
            bed_checkout: bed.bed_checkout,
            bed_deposit: bed.bed_deposit,
            bed_lunch_break: bed.bed_lunch_break,
        }, {
            where: {
                id: bed.id
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const updateTimeInBed = async (bed) => {
    try {
        await Bed.update({
            bed_checkin: bed.bed_checkin,
            bed_checkout: bed.bed_checkout,
            bed_lunch_break: bed.bed_lunch_break,
        }, {
            where: {
                id: bed.id
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const updateBedStatus = async (bed) => {
    try {
        await Bed.update({
            bed_status: bed.bed_status,
            id_invoice: bed.id_invoice,
            id_price: bed.id_price,
        }, {
            where: {
                id: bed.id
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const updateBedStatusByInvoice = async (bed) => {
    try {
        await Bed.update({
            bed_status: bed.bed_status,
            id_invoice: null,
        }, {
            where: {
                id_invoice: bed.id_invoice,
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const changeRoom = async (bed) => {
    try {
        await Bed.update({
            id_room: bed.id_room
        }, {
            where: {
                id: bed.id_bed
            }
        });
        return { status: true, result: "Cập nhật thành công" };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getBedByID = async (id) => {
    try {
        const findBed = await Bed.findOne({
            include: [Customer, BedType, Room],
            where: {
                id: id
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getBedByIDPrice = async (id_price) => {
    try {
        const findBed = await Bed.findAll({
            where: {
                id_price: id_price
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getBedByIDBedType = async (id_bed_type) => {
    try {
        const findBed = await Bed.findAll({
            where: {
                id_bed_type: id_bed_type
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getUnpaidBedByIDCourseAndIDCompany = async (id_course, id_company) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_company: id_company,
                    id_course: id_course,
                }
            }],
            where: {
                bed_status: false
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const countCustomerBed = async (id_customer) => {
    try {
        const findBed = await Bed.count({
            where: {
                id_customer: id_customer
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const deleteBed = async (id_bed) => {
    try {
        await Bed.destroy({
            where: {
                id: id_bed
            }
        })
        return { status: true, result: 'Xoá giường thành công' }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const checkoutSingleBed = async (id_bed) => {
    try {
        await Bed.update({
            bed_status: false,
        }, {
            where: {
                id: id_bed
            }
        })
        return { status: true, result: 'Cập nhật thành công' }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const checkoutForCustomer = async (id_customer) => {
    try {
        await Bed.update({
            bed_status: false,
        }, {
            where: {
                id_customer: id_customer
            }
        })
        return { status: true, result: 'Cập nhật thành công' }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const checkoutForCustomerList = async (idCustomerList) => {
    try {
        await Bed.update({
            bed_status: false,
        }, {
            where: {
                id_customer: {
                    [Op.in]: idCustomerList
                }
            }
        })
        return { status: true, result: 'Cập nhật thành công' }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getAllUnpaidBed = async () => {
    try {
        const findBed = await Bed.findAll({
            include: [Customer, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getUnpaidBedByCompany = async (id_company) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_company: id_company
                }
            }, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getUnpaidBedByCourse = async (id_course) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_course: id_course
                }
            }, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const getUnpaidBedByCompanyAndCourse = async (id_company, id_course) => {
    try {
        const findBed = await Bed.findAll({
            include: [{
                model: Customer,
                where: {
                    id_company: id_company,
                    id_course: id_course
                }
            }, BedType, Room, Price],
            where: {
                bed_status: false,
                id_invoice: null
            }
        })
        return { status: true, result: findBed }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const countAvaiableBedInRoom = async (id_room) => {
    try {
        const roomInfor = await Room.findOne({
            where: {
                id: id_room,
            },
            attributes: ['room_bed_quantity']
        });
        if (roomInfor) {
            const countBedResult = await Bed.count({
                where: {
                    id_room: id_room,
                    bed_status: true,
                    [Op.or]: {
                        bed_checkout: {
                            [Op.lte]: new moment()
                        },
                        [Op.and]: {
                            bed_checkin: {
                                [Op.lte]: new moment()
                            },
                            bed_checkout: {
                                [Op.gte]: new moment()
                            }
                        }
                    }
                }
            });
            const avaiableBed = parseInt(roomInfor.room_bed_quantity) - parseInt(countBedResult);
            return { status: true, result: avaiableBed }
        } else {
            return { status: true, result: 0 }
        }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getAllCheckoutedBed = async (start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }]
            }, {
                model:Room,
                include:[{
                    model:Floor,
                    include:[Area]
                }]
            }, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            },
            order:[[{model:Customer},'id_company','ASC'],['id_customer','ASC']]
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getCheckoutedBedByCourse = async (id_course, start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }],
                where: {
                    id_course: id_course
                }
            }, {
                model:Room,
                include:[{
                    model:Floor,
                    include:[Area]
                }]
            }, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            },
            order:[[{model:Customer},'id_company','ASC'],['id_customer','ASC']]
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getCheckoutedBedByCompany = async (id_company, start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }],
                where: {
                    id_company: id_company
                }
            }, {
                model:Room,
                include:[{
                    model:Floor,
                    include:[Area]
                }]
            }, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            },
            order:[[{model:Customer},'id_company','ASC'],['id_customer','ASC']]
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getCheckoutedBedByCourseAndCompany = async (id_course, id_company, start_date, end_date) => {
    try {
        const searchResult = await Bed.findAll({
            include: [{
                model: Customer,
                include: [{
                    model: Company,
                    attributes: ['company_name']
                }, {
                    model: Course,
                    attributes: ['course_name']
                }],
                where: {
                    id_course: id_course,
                    id_company: id_company
                }
            }, {
                model:Room,
                include:[{
                    model:Floor,
                    include:[Area]
                }]
            }, Price, BedType],
            where: {
                bed_status: false,
                bed_checkin: {
                    [Op.between]: [start_date, end_date]
                }
            },
            order:[[{model:Customer},'id_company','ASC'],['id_customer','ASC']]
        })
        return { status: true, result: searchResult }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const countCurrentLunchBreakBed=async(id_room)=>{
    try {
        const result=await Bed.count({
            where:{
                id_room:id_room,
                bed_status:true,
                bed_lunch_break:true
            }
        });
        return { status:true, result:result}
    } catch (error) {
        return { status: false, msg: "DB: "+error.message}
    }
}

const countCurrentNightBed=async(id_room)=>{
    try {
        const result=await Bed.count({
            where:{
                id_room:id_room,
                bed_status:true,
                bed_lunch_break:false
            }
        });
        return { status:true, result:result}
    } catch (error) {
        return { status: false, msg: "DB: "+error.message}
    }
}

const quickCheckoutForArea=async(id_area)=>{
    try{
        const roomResult=await Room.findAll({
            include:[
                {
                    model:Floor,
                    where:{
                        id_area:id_area
                    }
                }
            ],
            attributes:['id']
        });
        let idRoomList=[];
        roomResult.forEach((value,index)=>{
            idRoomList.push(value.id);
        });
        await Bed.update({
            bed_status:false,
        },{
            where:{
                id_room:{
                    [Op.in]:idRoomList
                },
                bed_checkout:{
                    [Op.lte]:moment()
                }
            }
        })
        return {status: true, result:'Checkin thành công'};
    }catch{
        return {status:false, msg: "DB: "+error.message}
    }
}

module.exports = {
    countBedInUsedByRoomID, countCurrentNightBed,countCustomerBed, countBedInRoom,countCurrentLunchBreakBed, countAvaiableBedInRoom, 
    insertBed, 
    updateBed, updateTimeInBed, updateBedStatus, updateBedStatusByInvoice, changeRoom,
    getBedInRoom, getBedByID,getBedInInvoice, getRevenueBed, getRevenueBedInArea, getBedByIDPrice, getBedByIDBedType,getUnpaidBedByIDCourseAndIDCompany, getAllUnpaidBed, getUnpaidBedByCompany, getUnpaidBedByCourse, getUnpaidBedByCompanyAndCourse,  getAllCheckoutedBed, getCheckoutedBedByCompany, getCheckoutedBedByCourse, getCheckoutedBedByCourseAndCompany,getPreBookedBedInRoom,
    checkoutForCustomer, checkoutForCustomerList,checkoutSingleBed, quickCheckoutForArea,
    deleteBed,    
}