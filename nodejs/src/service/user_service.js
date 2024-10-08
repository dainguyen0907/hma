import { Op } from "sequelize";
import db from "../models/index";
import bcrypt from "bcrypt";

const User = db.Reception;
const PrivilegeDetail = db.Privilege_detail;

User.hasMany(PrivilegeDetail, { foreignKey: 'id_user' })


const checkLogin = async (account, password) => {
    const user = await User.findOne({
        where: {
            reception_account: account
        },
        raw: true,
        nest: true,
    });
    if (user != null) {
        if (user.reception_status != true) {
            return { status: false, msg: "DB: Tài khoản đã bị khoá đăng nhập" };
        }
        const match = await bcrypt.compare(password, user.reception_password);
        if (match) {
            return { status: true, user: user };
        }
        else {
            return { status: false, msg: "DB: Mật khẩu không chính xác" };
        }
    }
    else {
        return { status: false, msg: "DB: Tên đăng nhập không tồn tại" };
    }
}

const getAllReception = async () => {
    try {
        const allReception = await User.findAll({
            include: [PrivilegeDetail],
            order: [
                ['id', 'ASC']
            ],
            where:{
                id:{
                    [Op.ne]:1
                }
            }
        }
        );
        return { status: true, result: allReception }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const getReceptionByID = async (id_reception) => {
    try {
        const Reception = await User.findOne({
            where: {
                id: id_reception
            }
        }
        );
        return { status: true, result: Reception }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const deleteReception = async (id_user) => {
    try {
        await User.destroy({
            where: {
                id: id_user
            }
        })
        return { status: true, result: "Xoá thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const insertReception = async (reception) => {
    try {
        const newReception = await User.create({
            reception_account: reception.account,
            reception_password: reception.password,
            reception_name: reception.name,
            reception_email: reception.email,
            reception_phone: reception.phone,
            reception_status: true
        });
        return { status: true, result: newReception }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const updateReceptionInfor = async (reception) => {
    try {
        await User.update({
            reception_name: reception.name,
            reception_email: reception.email,
            reception_phone: reception.phone,
            reception_status: reception.status,
        }, {
            where: {
                id: reception.id
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const updateReceptionPassword = async (reception) => {
    try {
        await User.update({
            reception_password: reception.password,
        }, {
            where: {
                id: reception.id
            }
        })
        return { status: true, result: "Cập nhật thành công" }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const checkPassword = async (id, password) => {
    const user = await User.findOne({
        where: {
            id: id
        }
    });
    if (user == null)
        return { status: false, msg: 'Không xác định được người dùng' }
    const match = await bcrypt.compare(password, user.reception_password);
    if (match) {
        return { status: true, result: 'Xác minh thành công' }
    } else {
        return { status: false, msg: 'DB: Mật khẩu chưa chính xác' }
    }
}

module.exports = {
    checkLogin, getAllReception, deleteReception, insertReception,
    updateReceptionInfor, updateReceptionPassword, checkPassword, getReceptionByID
}