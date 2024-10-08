import db from "../models/index"

const Privilege = db.Privilege;
const PrivilegeDetail = db.Privilege_detail;

const checkPrivilegeByIDReceptionAndIDPrivilege = async (reception_id, privilege_id) => {
    const privilege_detail = await PrivilegeDetail.findOne({
        where: {
            id_user: reception_id,
            id_privilege: privilege_id
        }
    });
    if (privilege_detail === null) {
        return false;
    } else {
        return true;
    }
}

const getAllPrivilege = async () => {
    try {
        const privilege = await Privilege.findAll({
            raw: true,
            nest: true,
            order:[
                ['id','ASC']
            ],
        });
        return { status: true, result: privilege }
    } catch (error) {
        return { status: false, msg: "DB: "+error.message }
    }
}

const insertPrivilegeDetail = async (privilege_id, user_id) => {
    try{
        const exitPD = await PrivilegeDetail.findOne({
            where: {
                id_user: user_id,
                id_privilege: privilege_id
            }
        });
        if (exitPD != null) {
            return { status: false, msg: "DB: Phân quyền đã tồn tại" }
        } else {
            const PD = await PrivilegeDetail.create({
                id_user: user_id,
                id_privilege: privilege_id
            });
            return { status: true, result: PD }
        }
    }catch (error){
        return { status: false, msg: "DB: "+error.message }
    }
}

const deletePrivilegeDetail=async(privilege_id, user_id)=>{
    try{
        await PrivilegeDetail.destroy({
            where: {
                id_user: user_id,
                id_privilege: privilege_id
            }
        })
        return {status:true,result:"Xoá thành công"};
    }
    catch (error){
        return { status: false, msg: "DB: "+error.message }
    }
}

const deletePrivilegeDetailByUser=async(user_id)=>{
    try{
        await PrivilegeDetail.destroy({
            where: {
                id_user: user_id
            }
        })
        return {status:true,result:"Xoá thành công"};
    }
    catch (error){
        return { status: false, msg: "DB: "+error.message }
    }
}

const getPrivilegeByIDUser=async(id_user)=>{
    try{
        const privilege= await PrivilegeDetail.findAll({
        where: {id_user:id_user},
        raw:true,
        nest:true
    });
    return {status:true,result:privilege};
    }catch(error){
        return {status:false, msg: "DB: "+error.message}
    }
    
}

module.exports = {
    checkPrivilegeByIDReceptionAndIDPrivilege, 
    getAllPrivilege, getPrivilegeByIDUser,
    insertPrivilegeDetail,
    deletePrivilegeDetail,deletePrivilegeDetailByUser,
}
