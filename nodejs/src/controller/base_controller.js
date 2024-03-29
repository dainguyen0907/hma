import { saveHistory } from "../service/base_service";
const getUserId = (req, res) => {
    const token = req.cookies.loginCode;
    if (!token) {
        return res.status(401).json({ error_code: "Không tìm thấy access token" });
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const reception_id = tokenData.reception_id;
    return reception_id;
}

const saveLog = async (req, res, message) => {
    try {
        const id = getUserId(req, res);
        const msg = "Người dùng có id " + id + " " + message;
        await saveHistory(msg);
        return true;
    } catch (error) {
        return false;
    }
}



module.exports={saveLog}