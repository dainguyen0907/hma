import { validationResult } from "express-validator";
import customerService from "../service/customer_service";
import bedService from "../service/bed_service";
import base_controller from "../controller/base_controller"
import invoiceService from "../service/invoice_service";

const getAllCustomer = async (req, res) => {
    try {
        const rs = await customerService.getAllCustomer();
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}


const getCustomerByCourseAndCompany = async (req, res) => {
    try {
        const id_course = parseInt(req.query.course);
        const id_company = parseInt(req.query.company);
        let rs;
        if (id_company === -1 && id_course === -1) {
            rs = await customerService.getAllCustomerDetail();
        } else if (id_company === -1 && id_course !== -1) {
            rs = await customerService.getCustomerDetailByIDCourse(id_course)
        } else if (id_company !== -1 && id_course === -1) {
            rs = await customerService.getCustomerDetailByIDCompany(id_company)
        } else {
            rs = await customerService.getCustomerByIDCourseAndIDCompany(id_course, id_company);
        }
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getCustomerInUsedByCourseAndCompany = async (req, res) => {
    try {
        const id_course = parseInt(req.query.course);
        const id_company = parseInt(req.query.company);
        const startDate = req.query.startdate;
        const endDate = req.query.enddate;
        const dayFrom = new Date(startDate.split('/')[2] + '-' + startDate.split('/')[1] + '-' + startDate.split('/')[0]).toDateString();
        const dayTo = new Date(endDate.split('/')[2], endDate.split('/')[1], endDate.split('/')[0], 23, 59, 59).toString();
        let rs;
        if (id_company === -1 && id_course === -1) {
            rs = await customerService.getCustomerInUsed(dayFrom, dayTo);
        } else if (id_company === -1 && id_course !== -1) {
            rs = await customerService.getCustomerInUsedByIDCourse(id_course, dayFrom, dayTo)
        } else if (id_company !== -1 && id_course === -1) {
            rs = await customerService.getCustomerInUsedByIDCompany(id_company, dayFrom, dayTo)
        } else {
            rs = await customerService.getCustomerInUsedByIDCourseAndIDCompany(id_course, id_company, dayFrom, dayTo);
        }
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const getAvaiableCustomerByCourseAndCompany = async (req, res) => {
    try {
        const id_course = req.query.course;
        const id_company = req.query.company;
        const rs = await customerService.getAvaiableCustomerByIDCourseAndIDCompany(id_course, id_company);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" });
    }
}

const insertCustomer = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    try {
        const customer = {
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            identification: req.body.identification,
            company: req.body.company,
            course: req.body.course,
        }
        const rs = await customerService.insertCustomer(customer);
        if (rs.status) {
            const message = "đã khởi tạo khách hàng mới có mã " + rs.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const insertCustomerList = async (req, res) => {
    try {
        const customerList = req.body.customers;
        if (customerList.length > 0) {
            let error_list = [];
            for (let i = 0; i < customerList.length; i++) {
                const customer = {
                    name: customerList[i].customer_name,
                    gender: customerList[i].customer_gender,
                    email: "",
                    address: "",
                    phone: customerList[i].customer_phone,
                    identification: customerList[i].customer_identification,
                    company: customerList[i].id_company,
                    course: customerList[i].id_course,
                }
                if (customer.name.length <= 0) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì không có tên');
                    continue;
                }
                if (customer.company === -1) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì không có công ty');
                    continue;
                }
                if (customer.course === -1) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại vì không có khoá học');
                    continue;
                }
                const rs = await customerService.insertCustomer(customer);
                if (!rs.status) {
                    error_list.push('Khách hàng ' + customerList[i].customer_name + ' thêm thất bại');
                }
            }
            const message = "đã thêm một danh sách khách hàng";
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: error_list });

        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customer = {
            id: req.body.id,
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            identification: req.body.identification,
            company: req.body.company,
            course: req.body.course,
            status: req.body.status
        }
        const rs = await customerService.updateCustomer(customer);
        if (rs.status) {
            const message = "đã cập nhật thông tin khách hàng có mã " + customer.id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const id = req.body.id;
        const count_bed = await bedService.countCustomerBed(id);
        const count_invoice = await invoiceService.countCustomerInvoice(id);
        if (count_bed.status && count_invoice.status && count_bed.result === 0 && count_invoice.result === 0) {
            const rs = await customerService.deleteCustomer(id);
            if (rs.status) {
                const message = "đã xoá khách hàng có mã " + id;
                await base_controller.saveLog(req, res, message);
                return res.status(200).json({ result: rs.result });
            } else {
                return res.status(500).json({ error_code: rs.msg });
            }
        } else {
            return res.status(500).json({ error_code: "Không thể xoá khách hàng đã thao tác trong hệ thống." });
        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: Xảy ra lỗi khi xử lý dữ liệu" })
    }
}

module.exports = {
    getAllCustomer, insertCustomer, updateCustomer, deleteCustomer, getCustomerByCourseAndCompany, insertCustomerList, getAvaiableCustomerByCourseAndCompany,
    getCustomerInUsedByCourseAndCompany
}