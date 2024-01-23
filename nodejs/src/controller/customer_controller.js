import { validationResult } from "express-validator";
import customerService from "../service/customer_service";

const getAllCustomer = async (req, res) => {
    try {
        const rs = await customerService.getAllCustomer();
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error });
    }
}

const insertCustomer = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let name, gender, email, address, phone, identification, dob, student_code, classroom, pob;
    try {
        name = req.body.name,
            gender = Boolean(req.body.gender),
            email = req.body.email,
            address = req.body.address,
            phone = req.body.phone,
            identification = req.body.identification,
            dob = new Date(req.body.dob),
            student_code = req.body.student_code,
            classroom = req.body.classroom,
            pob = req.body.pob
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
    const customer = {
        name: name,
        gender: gender,
        email: email,
        address: address,
        phone: phone,
        identification: identification,
        dob: dob,
        student_code: student_code,
        classroom: classroom,
        pob: pob
    }
    const rs = await customerService.insertCustomer(customer);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const updateCustomer = async (req, res) => {
    let name, gender, email, address, phone, identification, dob, student_code, classroom, pob, status, id;
    try {
        id = req.body.id,
            name = req.body.name == "" ? null : req.body.name,
            gender = Boolean(req.body.name),
            email = req.body.email == "" ? null : req.body.email,
            address = req.body.address == "" ? null : req.body.address,
            phone = req.body.phone == "" ? null : req.body.phone,
            identification = req.body.identification == "" ? null : req.body.identification,
            dob = new Date(req.body.dob),
            student_code = req.body.student_code == "" ? null : req.body.student_code,
            classroom = req.body.classroom == "" ? null : req.body.classroom,
            pob = req.body.pob == "" ? null : req.body.pob,
            status = Boolean(req.body.status);
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
    const customer = {
        id: id,
        name: name,
        gender: gender,
        email: email,
        address: address,
        phone: phone,
        identification: identification,
        dob: dob,
        student_code: student_code,
        classroom: classroom,
        pob: pob,
        status: status,
    }
    const rs = await customerService.updateCustomer(customer);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const deleteCustomer = async (req,res) => {
    try {
        const id = req.body.id;
        const rs = await customerService.deleteCustomer(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
}

module.exports = {
    getAllCustomer, insertCustomer, updateCustomer, deleteCustomer
}