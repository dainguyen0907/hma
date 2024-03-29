import {body} from "express-validator";

let validateNewReception=()=>{
    return [
        body('account','Tên đăng nhập không được bỏ trống').not().isEmpty(),
        body('account','Tên đăng nhập từ 8 đến 50 ký tự').isLength({min:8,max:50}),
        body('password','Mật khẩu không được bỏ trống').not().isEmpty(),
        body('password','Mật khẩu phải từ 8 ký tự').isLength({min:8}),
        body('name','tên người dùng không bỏ trống').not().isEmpty(),
        body('email','Định dạng email chưa chính xác').custom((value)=>{
            if(value&&value!==""){
                return value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            }else{
                return true;
            }
        })
    ]
}

let validateUpdateReception=()=>{
    return [
        body('id','Không tìm được id người dùng').not().isEmpty(),
        body('name','Tên người dùng không bỏ trống').not().isEmpty(),
        body('email','Định dạng email chưa chính xác').custom((value)=>{
            if(value&&value!==""){
                return value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            }else{
                return true;
            }
        })
    ]
}

let validatePassword=()=>{
    return [
        body('password','Mật khẩu không được bỏ trống').not().isEmpty(),
        body('password','Mật khẩu phải từ 8 ký tự').isLength({min:8}),
        body('repassword','Xác nhận mật khẩu chưa chính xác').custom((value,{req})=>{
            return value===req.body.password;   
        })
    ]
}

let validateUserPassword=()=>{
    return [
        body('oldpassword','Mật khẩu cũ không được bỏ trống').not().isEmpty(),
        body('newpassword','Mật khẩu mới không được bỏ trống').not().isEmpty(),
        body('newpassword','Mật khẩu mới phải từ 8 ký tự').isLength({min:8}),
        body('repassword','Xác nhận mật khẩu chưa chính xác').custom((value,{req})=>{
            return value===req.body.newpassword;   
        })
    ]
}

let validateArea=()=>{
    return[
        body('area_name','Tên khu vực không được bỏ trống').not().isEmpty(),
        body('area_floor','Số tầng phải là ký tự số').custom((value)=>{
            return !isNaN(parseInt(value))
        }),
        body('area_room','Số phòng phải là ký tự số').custom((value)=>{
            return !isNaN(parseInt(value))
        }),
        body('area_room','Số phòng phải chia hết cho số tầng').custom((value,{req})=>{
            return parseInt(value)%parseInt(req.body.area_floor)===0 
        })
    ]
}

let validateUpdateArea=()=>{
    return[
        body('area_name','Tên khu vực không được bỏ trống').not().isEmpty(),
    ]
}

let validateService=()=>{
    return [
        body('name','Tên dịch vụ không được bỏ trống').not().isEmpty(),
        body('name','Tên dịch vụ phải từ 8 đến 30 ký tự').isLength({max:30,min:8}),
        body('price','Đơn giá phải là ký tự số').custom((value)=>{
            return !isNaN(parseInt(value));
        })
    ]
}

let validateCustomer=()=>{
    return [
        body('name',"Tên khách hàng không được bỏ trống").not().isEmpty(),
        body('identification',"Số CMND/CCCD không được để trống").not().isEmpty(),
        body('phone','Số điện thoại không được bỏ trống').not().isEmpty()
    ];
}

let validateInitBedType=()=>{
    return[
        body('name','Tên giường không được bỏ trống').not().isEmpty(),
        body('price_hour','Đơn giá theo giờ phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
        body('price_day','Đơn giá theo ngày phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
        body('price_week','Đơn giá theo tuần phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
        body('price_month','Đơn giá theo tháng phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
    ];
}

let validateUpdateBedType=()=>{
    return[
        body('name','Tên giường không được bỏ trống').not().isEmpty(),
        body('default_price','Chưa chọn đơn giá mặc định').not().isEmpty()
    ];
}

let validatePrice=()=>{
    return[
        body('name','Tên đơn giá không được bỏ trống').not().isEmpty(),
        body('hour','Đơn giá theo giờ phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
        body('day','Đơn giá theo ngày phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
        body('week','Đơn giá theo tuần phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
        body('month','Đơn giá theo tháng phải là số').custom((value)=>{
            return !isNaN(parseInt(value));
        }),
    ];
}

let validateFloor=()=>{
    return [
        body('name','Tên tầng không được để trống').not().isEmpty()
    ];
}

let validateRoom=()=>{
    return [
        body('name','Tên tầng không được để trống').not().isEmpty()
    ];
}

let validateBed=()=>{
    return [
        body('id_room','Mã phòng không hợp lệ').not().isEmpty(),
        body('id_bed_type','Mã loại giường không hợp lệ').not().isEmpty(),
        body('id_customer','Mã khách hàng không phù hợp').not().isEmpty(),
        body('bed_checkin','Ngày checkin không để trống').not().isEmpty(),
        body('bed_checkout','Ngày checkout không để trống').not().isEmpty(),
    ];
}

module.exports={
    validateNewReception,validatePassword,validateUserPassword, validateArea, validateService, validateCustomer, validateInitBedType,
    validatePrice, validateUpdateBedType, validateFloor, validateRoom,validateUpdateArea, validateBed, validateUpdateReception
}