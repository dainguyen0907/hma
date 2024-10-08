import { validationResult } from "express-validator";
import bed_service from "../service/bed_service";
import room_service from "../service/room_service";
import base_controller from "../controller/base_controller"
import service_detail_controller from "../service/service_detail_service";
import customer_service from "../service/customer_service";
import course_service from "../service/course_service";
import moment from "moment";

const countBedInUsedByRoomID = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.countBedInUsedByRoomID(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getBedInRoom = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInRoom(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getPreBookedBedInRoom = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getPreBookedBedInRoom(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getBedByID = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedByID(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getBedInInvoice = async (req, res) => {
    try {
        const id = req.query.id;
        const count = await bed_service.getBedInInvoice(id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getRevenueBed = async (req, res) => {
    try {
        const dayFrom = moment(req.query.from, "DD/MM/YYYY");
        const dayTo = moment(req.query.to, "DD/MM/YYYY").set('hour', 23).set('minute', 59).set('second', 59);
        const count = await bed_service.getRevenueBed(dayFrom, dayTo);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getRevenueBedInArea = async (req, res) => {
    try {
        const id = req.query.id;
        const dayFrom = moment(req.query.from, "DD/MM/YYYY");
        const dayTo = moment(req.query.to, "DD/MM/YYYY").set('hour', 23).set('minute', 59).set('second', 59);
        const count = await bed_service.getRevenueBedInArea(dayFrom, dayTo, id);
        if (count.status) {
            return res.status(200).json({ result: count.result });
        } else {
            return res.status(500).json({ error_code: count.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const insertBed = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let newBed;
    try {
        newBed = {
            id_room: req.body.id_room,
            id_bed_type: req.body.id_bed_type,
            id_customer: req.body.id_customer,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_deposit: req.body.bed_deposit,
            bed_lunch_break: req.body.bed_lunch_break,
        }
        const rs = await bed_service.insertBed(newBed)
        if (rs.status) {
            const message = "đã khởi tạo một giường mới";
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const updateBed = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let newBed;
    try {
        newBed = {
            id: req.body.id,
            id_bed_type: req.body.id_bed_type,
            id_price: req.body.id_price,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_deposit: req.body.bed_deposit === "" ? 0 : req.body.bed_deposit,
            bed_lunch_break: req.body.bed_lunch_break,
        }
        const rs = await bed_service.updateBed(newBed)
        if (rs.status) {
            const message = "đã thao tác trên giường có mã là " + req.body.id;
            await base_controller.saveLog(req, res, message);
            await checkAndUpdateRoomMark(newBed.id);
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const updateTimeInBed = async (req, res) => {
    try {
        const validate = validationResult(req);
        if (!validate.isEmpty()) {
            return res.status(400).json({ error_code: validate.errors[0].msg });
        }
        const newBed = {
            id: req.body.id,
            bed_checkin: req.body.bed_checkin,
            bed_checkout: req.body.bed_checkout,
            bed_lunch_break: req.body.bed_lunch_break,
        }
        const rs = await bed_service.updateTimeInBed(newBed)
        if (rs.status) {
            const message = "đã thao tác trên giường có mã là " + req.body.id;
            await base_controller.saveLog(req, res, message);
            await checkAndUpdateRoomMark(newBed.id);
            return res.status(200).json({ error_code: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const insertBeds = async (req, res) => {
    const arrayBed = req.body.array_bed;
    const id_room = req.body.id_room;
    try {
        const avaibleBed = await bed_service.countAvaiableBedInRoom(id_room);
        if (!avaibleBed.status) {
            return res.status(500).json({ error_code: avaibleBed.msg });
        }
        let countAvaiableBed = avaibleBed.result;
        let error_list = [];
        for (let i = 0; i < arrayBed.length; i++) {
            if (countAvaiableBed <= 0) {
                error_list.push('Khách hàng ' + arrayBed[i].customer_name + ' chưa thể checkin vì phòng đầy');
                continue;
            }
            if (!id_room) {
                error_list.push('Khách hàng ' + arrayBed[i].customer_name + ' chưa thể checkin vì chưa xác định phòng');
                continue;
            }
            if (!arrayBed[i].id) {
                error_list.push('Khách hàng ' + arrayBed[i].customer_name + ' chưa thể checkin vì Không tồn tại trên hệ thống');
                continue;
            }
            if (arrayBed[i].bed_lunch_break) {
                for (let j = 0; j < arrayBed[i].count_lunch_break; j++) {
                    let checkindate = new moment(arrayBed[i].bed_checkin);
                    checkindate.setDate(checkindate.getDate() + j);
                    let checkoutdate = new moment(arrayBed[i].bed_checkout);
                    checkoutdate.setDate(checkoutdate.getDate() + j);
                    let newBed = {
                        id_room: id_room,
                        id_bed_type: arrayBed[i].id_bed_type,
                        id_price: arrayBed[i].id_price,
                        id_customer: arrayBed[i].id,
                        bed_checkin: checkindate,
                        bed_checkout: checkoutdate,
                        bed_deposit: arrayBed[i].bed_deposit == "" ? 0 : arrayBed[i].bed_deposit,
                        bed_lunch_break: arrayBed[i].bed_lunch_break,
                    }
                    const rs = await bed_service.insertBed(newBed);
                    if (!rs.status) {
                        error_list.push('Khách hàng ' + arrayBed[i].customer_name + ' chưa thể checkin vì ' + rs.msg)
                        continue;
                    }
                }
                countAvaiableBed -= 1;
            } else {
                let newBed = {
                    id_room: id_room,
                    id_bed_type: arrayBed[i].id_bed_type,
                    id_price: arrayBed[i].id_price,
                    id_customer: arrayBed[i].id,
                    bed_checkin: arrayBed[i].bed_checkin,
                    bed_checkout: arrayBed[i].bed_checkout,
                    bed_deposit: arrayBed[i].bed_deposit == "" ? 0 : arrayBed[i].bed_deposit,
                    bed_lunch_break: arrayBed[i].bed_lunch_break,
                }
                const rs = await bed_service.insertBed(newBed);
                if (rs.status) {
                    countAvaiableBed -= 1;
                } else {
                    error_list.push('Khách hàng ' + arrayBed[i].customer_name + ' chưa thể checkin vì ' + rs.msg)
                    continue;
                }
            }

        };
        const message = "đã khởi tạo " + arrayBed.length + " giường mới trong phòng có mã " + id_room;
        await base_controller.saveLog(req, res, message);
        await checkAndUpdateRoomMark(id_room);
        return res.status(200).json({ result: error_list });
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const changeRoom = async (req, res) => {
    try {
        const id_bed = req.body.id_bed;
        const id_room = req.body.id_room;
        const old_room = req.body.id_old_room;
        const checkRoom = await room_service.checkRoomStatus(id_room);
        const avaibleBed = await bed_service.countAvaiableBedInRoom(id_room);
        if (!checkRoom) {
            return res.status(400).json({ error_code: "Không thể chuyển vào phòng đang sữa chữa." });
        }
        if (!avaibleBed.status) {
            return res.status(500).json({ error: avaibleBed.msg });
        }
        if (avaibleBed.result > 0) {
            const result = await bed_service.changeRoom({ id_bed, id_room });
            if (result.status) {
                const message = "đã đổi giường có mã " + id_bed + " từ phòng có mã " + old_room + " sang phòng có mã " + id_room;
                await base_controller.saveLog(req, res, message);
                await checkAndUpdateRoomMark(old_room);
                await checkAndUpdateRoomMark(id_room);
                return res.status(200).json({ result: result.result })
            } else {
                return res.status(500).json({ error_code: result.msg });
            }
        } else {
            return res.status(400).json({ error_code: 'Không thể chuyển vào phòng đã đầy' })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getUnpaidBedByIDCourseAndIDCompany = async (req, res) => {
    try {
        const id_course = req.query.course;
        const id_company = req.query.company;
        const searchResult = await bed_service.getUnpaidBedByIDCourseAndIDCompany(id_course, id_company);
        if (searchResult.status) {
            return res.status(200).json({ result: searchResult.result });
        } else {
            return res.status(500).json({ error_code: searchResult.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const deleteBed = async (req, res) => {
    try {
        const id = req.body.id;
        const findService = await service_detail_controller.getServiceDetailByIDBed(id);
        const bedInfor= await bed_service.getBedByID(id);
        if (findService.status && findService.result.length === 0) {
            const deleteBed = await bed_service.deleteBed(id);
            if (deleteBed.status) {
                const message = "đã xoá giường có mã " + id;
                await base_controller.saveLog(req, res, message);
                await checkAndUpdateRoomMark(bedInfor.result.id_room);
                return res.status(200).json({ result: deleteBed.result });
            } else {
                return res.status(500).json({ error_code: deleteBed.msg })
            }
        } else {
            return res.status(500).json({ error_code: "Không thể xoá giường đang sử dụng dịch vụ." })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const checkoutBedByCompanyAndCourse = async (req, res) => {
    try {
        const id_course = req.body.id_course;
        const idCompanyList = req.body.idCompanyList;
        const searchCustomerResult = await customer_service.getCustomerByCourseAndCompanyList(id_course, idCompanyList);
        let idCustomerList = [];
        if (searchCustomerResult.status) {
            for (let i = 0; i < searchCustomerResult.result.length; i++)
                idCustomerList.push(searchCustomerResult.result[i].id)
        } else {
            return res.status(500).json({ error_code: searchCustomerResult.msg })
        }
        const updateBedResult = await bed_service.checkoutForCustomerList(idCustomerList);
        if (updateBedResult.status) {
            await course_service.checkAndUpdateCourseStatus(id_course);
            return res.status(200).json({ result: 'Checkout thành công' });
        }
        else {
            return res.status(500).json({ error_code: updateBedResult.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const checkoutForCustomerList = async (req, res) => {
    try {
        const id = req.body.id;
        if (id && id.length <= 0) {
            return res.status(400).json({ error_code: 'Kiểm tra thông tin id khách hàng' })
        }
        const updateBedResult = await bed_service.checkoutForCustomerList(id);
        if (updateBedResult.status) {
            return res.status(200).json({ result: 'Checkout thành công' });
        }
        else {
            return res.status(500).json({ error_code: updateBedResult.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const checkoutForCustomer = async (req, res) => {
    try {
        const id = req.body.id;
        const updateBedResult = await bed_service.checkoutForCustomer(id);
        if (updateBedResult.status) {
            return res.status(200).json({ result: 'Checkout thành công' });
        }
        else {
            return res.status(500).json({ error_code: updateBedResult.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const quickCheckoutForArea = async (req, res) => {
    try {
        const id = req.body.id;
        let idRoomList=[];
        const roomResult=await room_service.getRoomByAreaID(id);
        if(roomResult.status){
            roomResult.result.forEach((value,index)=>{
                idRoomList.push(value.id);
            })
        }
        const updateBedResult = await bed_service.quickCheckoutForArea(id);
        if (updateBedResult.status) {
            for(let i=0;i<idRoomList.length;i++){
                await checkAndUpdateRoomMark(idRoomList[i]);
            }
            const message=" đã checkout khu vực có id="+id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: 'Checkout thành công' });
        }
        else {
            return res.status(500).json({ error_code: updateBedResult.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const checkoutSingleBed = async (req, res) => {
    try {
        const id = req.body.id;
        const bedInfor=await bed_service.getBedByID(id);
        const updateBedResult = await bed_service.checkoutSingleBed(id);
        if (updateBedResult.status) {
            await checkAndUpdateRoomMark(bedInfor.result.id_room);
            return res.status(200).json({ result: 'Checkout thành công' });
        }
        else {
            return res.status(500).json({ error_code: updateBedResult.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const getUnpaidBedByCourseAndCompany = async (req, res) => {
    try {
        const id_course = req.query.course ? parseInt(req.query.course) : -1;
        const id_company = req.query.company ? parseInt(req.query.company) : -1;
        let searchResult;
        if (id_course === -1 && id_company === -1) {
            searchResult = await bed_service.getAllUnpaidBed();
        } else if (id_course === -1 && id_company !== -1) {
            searchResult = await bed_service.getUnpaidBedByCompany(id_company);
        } else if (id_course !== -1 && id_company === -1) {
            searchResult = await bed_service.getUnpaidBedByCourse(id_course)
        } else {
            searchResult = await bed_service.getUnpaidBedByCompanyAndCourse(id_company, id_course);
        }
        if (searchResult.status) {
            return res.status(200).json({ result: searchResult.result });
        } else {
            return res.status(500).json({ error_code: searchResult.msg })
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const getCheckoutedBed = async (req, res) => {
    try {
        const id_course = parseInt(req.query.course);
        const id_company = parseInt(req.query.company);
        const dayFrom = moment(req.query.startdate, "DD/MM/YYYY");
        const dayTo = moment(req.query.enddate, "DD/MM/YYYY").set('hour', 23).set('minute', 59).set('second', 59);
        let searchResult;
        if (id_company === -1 && id_course === -1) {
            searchResult = await bed_service.getAllCheckoutedBed(dayFrom, dayTo);
        } else if (id_company === -1 && id_course !== -1) {
            searchResult = await bed_service.getCheckoutedBedByCourse(id_course, dayFrom, dayTo);
        } else if (id_company !== -1 && id_course === -1) {
            searchResult = await bed_service.getCheckoutedBedByCompany(id_company, dayFrom, dayTo);
        } else {
            searchResult = await bed_service.getCheckoutedBedByCourseAndCompany(id_course, id_company, dayFrom, dayTo)
        }
        if (searchResult.status) {
            return res.status(200).json({ result: searchResult.result });
        } else {
            return res.status(500).json({ error_code: searchResult.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const checkAndUpdateRoomMark = async (id_room) => {
    try {
        const countLunchBreakBed = await bed_service.countCurrentLunchBreakBed(id_room);
        const countNightBed = await bed_service.countCurrentNightBed(id_room);
        let updateRoomResult;
        if (!countLunchBreakBed.status)
            return { status: false, msg: 'Đếm số phòng nghỉ trưa ' + countLunchBreakBed.msg }
        else if (!countNightBed.status)
            return { status: false, msg: 'Đếm số phòng nghỉ đêm ' + countNightBed.msg }
        else if (countLunchBreakBed.result === 0 && countNightBed.result === 0) {
            updateRoomResult = await room_service.updateRoomMark({ id: id_room, room_mark: null })
        }
        else {
            if (countLunchBreakBed.result >= countNightBed.result) {
                updateRoomResult = await room_service.updateRoomMark({ id: id_room, room_mark: 'Nghỉ trưa' })
            } else {
                updateRoomResult = await room_service.updateRoomMark({ id: id_room, room_mark: 'Nghỉ đêm' })
            }
        }
        if (updateRoomResult.status)
            return { status: true, result: 'Cập nhật nhãn phòng thành công' }
        else
            return { status: false, msg:"Lỗi cập nhật nhãn phòng "+ updateRoomResult.msg}
    } catch (error) {
        return { status: false, error_code: "Ctrl: "+error.message }
    }
}

module.exports = {
    countBedInUsedByRoomID,
    insertBed, insertBeds,
    updateBed, changeRoom, checkoutBedByCompanyAndCourse, checkoutForCustomerList, updateTimeInBed, checkoutForCustomer, checkoutSingleBed, quickCheckoutForArea,
    deleteBed,
    getBedByID, getBedInInvoice, getRevenueBed, getRevenueBedInArea, getUnpaidBedByIDCourseAndIDCompany, getUnpaidBedByCourseAndCompany, getBedInRoom, getCheckoutedBed, getPreBookedBedInRoom
}
