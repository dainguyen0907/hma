import { Op } from "sequelize";
import db from "../models/index";

const serviceDetail = db.Service_detail;
const service = db.Service;
const bed = db.Bed;

serviceDetail.belongsTo(service, { foreignKey: 'id_service' });
service.hasMany(serviceDetail,{ foreignKey: 'id_service' })
serviceDetail.belongsTo(bed, { foreignKey: 'id_bed' });

const getServiceDetailByIDBed = async (id) => {
    try {
        const sd = await serviceDetail.findAll({
            include: [service],
            where: {
                id_bed: id
            },
            order: [
                ['id', 'ASC']
            ],
        });
        return { status: true, result: sd }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getServiceRevenue = async (fromDay, toDay) => {
    try {
        let bedList = [];
        const findBed = await bed.findAll({
            where: {
                bed_checkout: {
                    [Op.between]: [fromDay, toDay]
                },
                bed_status: false,
            }
        })
        findBed.forEach(element => {
            bedList.push(element.id)
        });
        const countValue = await serviceDetail.sum('service_quantity', {
            where:{
                id_bed:{
                    [Op.in]:bedList
                }
            }
        })
        const sumPayment = await serviceDetail.sum('total_price', {
            where:{
                id_bed:{
                    [Op.in]:bedList
                }
            }
        })
        return { status: true, result: { countValue: countValue, sumPayment: sumPayment } }
    } catch (error) {
        console.log(error)
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}

const getServiceDetailRevenue = async (fromDay, toDay) => {
    try {
        let bedList = [];
        const findBed = await bed.findAll({
            where: {
                bed_checkout: {
                    [Op.between]: [fromDay, toDay]
                },
                bed_status: false,
            }
        })
        findBed.forEach(element => {
            bedList.push(element.id)
        });
        const findData = await service.findAll({
            include:[{
                model:serviceDetail,
                where:{
                    id_bed:{
                        [Op.in]:bedList
                    }
                }
            }]
        })
        return { status: true, result:  findData}
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu" }
    }
}



const insertServiceDetail = async (sDetail) => {
    try {
        const sdetail = await serviceDetail.create({
            id_bed: sDetail.id_bed,
            id_service: sDetail.id_service,
            service_quantity: sDetail.quantity,
            total_price: sDetail.price,
        })
        return { status: true, result: sdetail }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updateServiceDetail = async (sDetail) => {
    try {
        await serviceDetail.update({
            service_quantity: sDetail.quantity,
            total_price: sDetail.price,
        }, {
            where: {
                id_bed: sDetail.id_bed,
                id_service: sDetail.id_service
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteServiceDetail = async (id) => {
    try {
        await serviceDetail.destroy({
            where: {
                id: id
            }
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi xoá dữ liệu" }
    }
}

module.exports = {
    getServiceDetailByIDBed, insertServiceDetail, deleteServiceDetail, updateServiceDetail,
    getServiceRevenue, getServiceDetailRevenue
}