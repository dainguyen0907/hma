import { validationResult } from "express-validator";
import room_service from "../service/room_service";
import floor_service from "../service/floor_service";
import area_service from "../service/area_service";
import bed_service from "../service/bed_service";
import base_controller from "../controller/base_controller"

const insertNewRoom = async (req, res) => {
    let name, floor_id, bed_quantity;
    try {
        name = req.body.name?.slice(0,50);
        floor_id = parseInt(req.body.floor_id);
        bed_quantity = parseInt(req.body.bed_quantity);
        const validate = validationResult(req);
        if (!validate.isEmpty()) {
            return res.status(400).json({ error_code: validate.errors[0].msg });
        }
        const floor = await floor_service.getFloorByID(floor_id);
        if (floor == null) {
            return res.status(400).json({ error_code: 'Không tồn tại tầng này' });
        }
        const newroom = {
            id_floor: floor_id,
            name: name,
            bed_quantity: bed_quantity,
            status: true
        }
        const room = await room_service.insertRoom(newroom);
        if (room.status) {
            await area_service.changeRoomInArea(floor.id_area, true, 1);
            const message = "đã khởi tạo phòng mới có mã " + room.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: room.result });
        } else {
            return res.status(500).json({ error_code: room.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const updateRoom = async (req, res) => {
    let name, status, bed_quantity, id, note;
    try {
        id = req.body.id;
        name = req.body.name == "" ? null : req.body.name?.slice(0,50);
        bed_quantity = parseInt(req.body.bed_quantity);
        status = req.body.status;
        note=req.body.note?.slice(0,50);
        const newroom = {
            id: id,
            name: name,
            bed_quantity: bed_quantity,
            status: status,
            note:note,
        }
        const room = await room_service.updateRoom(newroom);
        if (room.status) {
            const message = "đã cập nhật thông tin phòng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: room.result });
        } else {
            return res.status(500).json({ error_code: room.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const deleteRoom = async (req, res) => {
    try {
        const id = req.body.id;
        const room = await room_service.getRoomByID(id);
        if (room == null) {
            return res.status(400).json({ error_code: 'Không tìm thấy thông tin' });
        }
        const bedInRoom = await bed_service.countBedInRoom(id);
        if (bedInRoom.status) {
            if (bedInRoom.result > 0) {
                return res.status(400).json({ error_code: 'Không được xoá phòng đã đưa vào sử dụng' });
            }
        }
        const rs = await room_service.deleteRoom(id);
        if (rs.status) {
            await area_service.changeRoomInArea(room.Floor.dataValues.id_area, false, 1);
            const message = "đã xoá phòng có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getRoomByAreaID = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await room_service.getRoomByAreaID(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const getAvaiableRoomByAreaID = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await room_service.getAvaiableRoomByAreaID(id)
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const getRoomInUsed = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await room_service.getRoomInUsed(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}
const countAllRoom=async(req,res)=>{
    try {
        const id = req.query.id;
        const rs = await room_service.getAllRoom();
        let blankRoom = 0;
        let fullRoom = 0;
        let maintaince = 0;
        if (rs.status) {
            for (let i = 0; i < rs.result.length; i++) {
                if (rs.result[i].room_status) {
                    const count = await bed_service.countBedInUsedByRoomID(rs.result[i].id);
                    if (count.result < rs.result[i].room_bed_quantity) {
                        blankRoom += 1;
                    } else {
                        fullRoom += 1;
                    }
                } else {
                    maintaince += 1;
                }

            }
            return res.status(200).json({ result: { blankRoom: blankRoom, fullRoom: fullRoom, maintainceRoom: maintaince } });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const countRoomByAreaID = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await room_service.getRoomByAreaID(id);
        let blankRoom = 0;
        let fullRoom = 0;
        let maintaince = 0;
        if (rs.status) {
            for (let i = 0; i < rs.result.length; i++) {
                if (rs.result[i].room_status) {
                    const count = await bed_service.countBedInUsedByRoomID(rs.result[i].id);
                    if (count.result < rs.result[i].room_bed_quantity) {
                        blankRoom += 1;
                    } else {
                        fullRoom += 1;
                    }
                } else {
                    maintaince += 1;
                }

            }
            return res.status(200).json({ result: { blankRoom: blankRoom, fullRoom: fullRoom, maintainceRoom: maintaince } });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const getRoomByFloorID = async (req, res) => {
    try {
        const id = req.query.id;
        const rs = await room_service.getRoomByFloorID(id);
        if (rs.status) {
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}



module.exports = {
    insertNewRoom, 
    updateRoom, 
    deleteRoom, 
    getRoomByAreaID, getRoomByFloorID, countRoomByAreaID, getRoomInUsed, getAvaiableRoomByAreaID, countAllRoom
}