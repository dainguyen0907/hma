import { Op } from "sequelize";
import db from "../models/index";

const serviceDetail = db.Service_detail;
const service = db.Service;
const bed = db.Bed;
const invoice=db.Invoice;

serviceDetail.belongsTo(service, { foreignKey: 'id_service' });
service.hasMany(serviceDetail, { foreignKey: 'id_service' })
serviceDetail.belongsTo(bed, { foreignKey: 'id_bed' });
bed.belongsTo(invoice,{foreignKey:'id_invoice'});


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
        return { status: false, msg: "DB: "+error.message }
    }
}

const getServiceRevenue = async (fromDay, toDay) => {
    try {
        let bedList = [];
        const findBed = await bed.findAll({
            include:{
                model:invoice,
                where:{
                    invoice_payment_date: {
                        [Op.between]: [fromDay,toDay]
                    }
                }
            }
        })
        findBed.forEach(element => {
            bedList.push(element.id)
        });
        const countValue = await serviceDetail.sum('service_quantity', {
            where: {
                id_bed: {
                    [Op.in]: bedList
                }
            }
        })
        const sumPayment = await serviceDetail.sum('total_price', {
            where: {
                id_bed: {
                    [Op.in]: bedList
                }
            }
        })
        return { status: true, result: { countValue: countValue, sumPayment: sumPayment } }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getServiceDetailRevenue = async (fromDay, toDay) => {
    try {
        let bedList = [];
        const findBed = await bed.findAll({
            include:{
                model:invoice,
                where:{
                    invoice_payment_date: {
                        [Op.between]: [fromDay,toDay]
                    }
                }
            }
        })
        findBed.forEach(element => {
            bedList.push(element.id)
        });
        const findData = await service.findAll({
            include: [{
                model: serviceDetail,
                where: {
                    id_bed: {
                        [Op.in]: bedList
                    }
                }
            }]
        })
        return { status: true, result: findData }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getTotalServiceRevenue = async (fromDay, toDay) => {
    try {
        let bedList = [];
        const findBed = await bed.findAll({
            include:{
                model:invoice,
                where:{
                    invoice_payment_date: {
                        [Op.between]: [fromDay,toDay]
                    }
                }
            }
        })
        findBed.forEach(element => {
            bedList.push(element.id)
        });
        const services = await service.findAll({
            include: [{
                model: serviceDetail,
                where: {
                    id_bed: {
                        [Op.in]: bedList
                    }
                }
            }],
            nest: true,
            raw: true
        })
        let serviceList = [];
        for (let i = 0; i < services.length; i++) {
            const countService = await serviceDetail.sum('service_quantity', {
                where: {
                    id_service: services[i].id,
                    id_bed: {
                        [Op.in]: bedList
                    }
                }
            });
            const sumPrice = await serviceDetail.sum('total_price', {
                where: {
                    id_service: services[i].id,
                    id_bed: {
                        [Op.in]: bedList
                    }
                }
            });
            let flag = true;
            serviceList.forEach(value => {
                if (value.id === services[i].id)
                    flag = false
            })
            if (flag)
                serviceList.push({ ...services[i], sum: sumPrice, count: countService });
        }
        return { status: true, result: serviceList };
    } catch (error) {
        return { status: false, msg: "DB: "+error.message };
    }
}

const insertServiceDetail = async (sDetail) => {
    try {
        const [service, created] = await serviceDetail.findOrCreate({
            where: {
                id_bed: sDetail.id_bed,
                id_service: sDetail.id_service,
            },
            default: {
                id_bed: sDetail.id_bed,
                id_service: sDetail.id_service,
            }
        })
        if (created) {
            await serviceDetail.update({
                service_quantity: sDetail.quantity,
                total_price: sDetail.price,
            }, {
                where:
                    { id: service.id }
            })
        } else {
            await serviceDetail.increment({
                service_quantity: sDetail.quantity,
                total_price: sDetail.price,
            }, {
                where: {
                    id: service.id
                }
            });
        }
        const sdetail = await serviceDetail.findOne({
            where: {
                id: service.id
            }
        })
        return { status: true, result: sdetail }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
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
        return { status: false, msg: "DB: "+error.message }
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
        return { status: false, msg: "DB: "+error.message }
    }
}

module.exports = {
    getServiceDetailByIDBed, getServiceRevenue, getServiceDetailRevenue, getTotalServiceRevenue,
    insertServiceDetail, 
    deleteServiceDetail, 
    updateServiceDetail,
}