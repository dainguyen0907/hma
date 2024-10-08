import { validationResult } from "express-validator";
import bedType_service from "../service/bedType_service";
import bed_service from "../service/bed_service";
import price_service from "../service/price_service";
import base_controller from "../controller/base_controller"

const getAllBedType = async (req, res) => {
    try {
        const bedtype = await bedType_service.getAllBedType();
        if (bedtype) {
            return res.status(200).json({ result: bedtype.result });
        } else {
            return res.status(500).json({ error_code: bedtype.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const insertBedType = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let name, price_day, price_hour, price_month, price_week;
    try {
        name = req.body.name.slice(0,50);
        price_day = isNaN(parseInt(req.body.price_day)) ? 0 : parseInt(req.body.price_day);
        price_week = 0;
        price_hour = isNaN(parseInt(req.body.price_hour)) ? 0 : parseInt(req.body.price_hour);
        price_month = 0;
        const rs = await bedType_service.insertBedType(name);
        if (rs.status) {
            const price = {
                id_bed_type: rs.result.id,
                name: "Giá mặc định " + rs.result.bed_type_name,
                price_hour: price_hour,
                price_day: price_day,
                price_week: price_week,
                price_month: price_month
            }
            const np = await price_service.insertPrice(price);
            if (np.status) {
                const updateBedType = await bedType_service.updateBedType({ name: rs.result.bed_type_name, default: np.result.id, id: rs.result.id });
                if (!updateBedType.status) {
                    return res.status(500).json({ error_code: updateBedType.msg });
                }
            }
            const message = "đã khởi tạo loại giường mới có mã " + rs.result.id;
            await base_controller.saveLog(req, res, message);
            return res.status(201).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

const deleteBedType = async (req, res) => {
    try {
        const id = req.body.id;
        const bed = await bed_service.getBedByIDBedType(id);
        if (bed.status) {
            if(bed.result.length===0)
            {
                return res.status(400).json({error_code:'Không thể xoá loại giường đã sử dụng'})
            }
            const rs = await bedType_service.deleteBedType(id);
            if (rs.status) {
                await price_service.deletePriceByIdBedType(id);
                const message = "đã xoá loại giường có mã " + id;
                await base_controller.saveLog(req, res, message);
                return res.status(200).json({ result: rs.result });
            } else {
                return res.status(500).json({ error_code: rs.msg });
            }
        } else {
            return res.status(500).json({ error_code: bed.msg })
        }

    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message })
    }
}

const updateBedType = async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
        return res.status(400).json({ error_code: validate.errors[0].msg });
    }
    let name, id, default_price;
    try {
        name = req.body.name.slice(0,50);
        default_price = req.body.default_price;
        id = req.body.id;
        const bedtype = { id: id, name: name, default: default_price };
        const rs = await bedType_service.updateBedType(bedtype);
        if (rs.status) {
            const message = "đã cập nhật thông tin loại giường có mã " + id;
            await base_controller.saveLog(req, res, message);
            return res.status(200).json({ result: rs.result });
        } else {
            return res.status(500).json({ error_code: rs.msg });
        }
    } catch (error) {
        return res.status(500).json({ error_code: "Ctrl: "+error.message });
    }
}

module.exports = { 
    getAllBedType, 
    insertBedType, 
    updateBedType, 
    deleteBedType 
}