import { validationResult } from "express-validator";
import { verifyJWT } from "../middlewares/jwt";
import receptionService from "../service/privilege_service";
import bcrypt, { hashSync } from "bcrypt";


const getUserPrivilege = async (req, res) => {
    const token = req.cookies.loginCode;
    const decoded = await verifyJWT(token);
    if (decoded.status) {
        const privilege_detail = await receptionService.getPrivilegeByIDUser(decoded.decoded.reception_id);
        if (privilege_detail.status) {
            let privilege = [];
            privilege_detail.result.map((p) => {
                privilege.push(p.id_privilege);
            });
            return res.status(200).json({ status: true, privilege: privilege });
        } else {
            return res.status(500).json(privilege_detail.msg);
        }

    } else {
        return res.status(500).json({ error_code: "Lỗi xác minh access token" });
    }
}

const getAllReception = async (req, res) => {
    const allReception = await receptionService.getAllReception();
    if (allReception.status) {
        return res.status(200).json({ result: allReception.result });
    } else {
        return res.status(500).json({ error_code: allReception.msg })
    }
}

const deleteReception = async (req, res) => {
    const id_user = req.body.id_user;
    const rs = await receptionService.deleteReception(id_user);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const insertReception = async (req, res) => {
    let account, password, name, email, phone;
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg })
    }
    try {
        account = req.body.account;
        password = req.body.password;
        name = req.body.name;
        email = req.body.email;
        phone = req.body.phone;
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
    const encryptPass = bcrypt.hashSync(password, process.env.SALTROUND);
    const reception = {
        account: account,
        password: encryptPass,
        name: name,
        email: email,
        phone: phone,
    }
    const rs = await receptionService.insertReception(reception);
    if (rs.status) {
        return res.status(201).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const updateReception = async (req, res) => {
    let name, email, phone, status, id;
    try {
        id = req.body.id;
        name = req.body.name == "" ? null : req.body.name;
        email = req.body.email == "" ? null : req.body.email;
        phone = req.body.phone == "" ? null : req.body.phone;
        status = Boolean(req.body.status) ? false : Boolean(req.body.status);
    } catch (error) {
        return res.status(500).json({ error_code: error })
    }
    const reception = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        status: status
    }
    const rs = await receptionService.updateReceptionInfor(reception);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const updateReceptionPassword = async (req, res) => {
    const validate = validationResult(req);
    if (validate != null) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    const password = req.body.password;
    const id = req.body.id;
    const encryptPass = bcrypt.hashSync(password, process.env.SALTROUND);
    const reception = {
        id: id,
        password: encryptPass,
    }
    const rs = await reception.updateReceptionPassword(reception);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}

const changeUserPassword = async (req, res) => {
    const token = req.cookies.loginCode;
    const decoded = await verifyJWT(token);
    if (!decoded.status)
        return res.status(500).json({ error_code: "Lỗi xác minh access token" });
    const id=decoded.decoded.reception_id;
    const validate = validationResult(req);
    if (validate != null) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;
    const passwordChecking=await receptionService.checkPassword(id,oldpassword);
    if(!passwordChecking.status){
        return res.status(400).json({error_code:passwordChecking.msg});
    }
    const encryptPass = bcrypt.hashSync(newpassword, process.env.SALTROUND);
    const reception = {
        id: id,
        password: encryptPass,
    }
    const rs = await reception.updateReceptionPassword(reception);
    if (rs.status) {
        return res.status(200).json({ result: rs.result });
    } else {
        return res.status(500).json({ error_code: rs.msg });
    }
}


module.exports = {
    getUserPrivilege, getAllReception, deleteReception,
    insertReception, updateReception, updateReceptionPassword,
    changeUserPassword
};