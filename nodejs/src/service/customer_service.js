import { raw } from "body-parser";
import db from "../models/index";
import { where } from "sequelize";

const Customer = db.Customer;

const getAllCustomer = async () => {
    try {
        const customer = await Customer.findAll({
            raw: true,
            nest: true,
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: customer }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerByIDCompany=async(id_company)=>{
    try {
        const customers= await Customer.findAll({
            raw:true,
            nest:true,
            where:{
                id_company:id_company
            }
        })
        return { status:true, result:customers}
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const getCustomerByIDCourse=async(id_course)=>{
    try {
        const customers= await Customer.findAll({
            raw:true,
            nest:true,
            where:{
                id_course:id_course
            }
        })
        return { status:true, result:customers}
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi truy vấn dữ liệu Khách hàng" }
    }
}

const insertCustomer = async (customer) => {
    try {
        const rs = await Customer.create({
            customer_name: customer.name,
            customer_gender: customer.gender,
            customer_email: customer.email,
            customer_address: customer.address,
            customer_phone: customer.phone,
            customer_identification: customer.identification,
            customer_status: true
        });
        return { status: true, result: rs }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi khởi tạo dữ liệu" }
    }
}

const updateCustomer=async(customer)=>{
    try {
        await Customer.update({
            customer_name: customer.name,
            customer_gender: customer.gender,
            customer_email: customer.email,
            customer_address: customer.address,
            customer_phone: customer.phone,
            customer_identification: customer.identification,
            customer_status: customer.status
        },{
            where:{id:customer.id}
        });
        return { status: true, result: "Cập nhật Khách hàng thành công" }
    } catch (error) {
        return { status: false, msg: "DB: Lỗi khi cập nhật dữ liệu" }
    }
}

const deleteCustomer=async(id)=>{
    try {
        await Customer.destroy({
            where:{id:id}
        });
        return {status:true,result:"Xoá thành công"}
    } catch (error) {
        return {status:false,msg: "DB: Lỗi khi xoá dữ liệu"}
    }
}

module.exports = {
    insertCustomer, updateCustomer, deleteCustomer, getAllCustomer, getCustomerByIDCompany,getCustomerByIDCourse
}