import  Express from "express";

import {login} from "../controller/login_controller";
import reception_controller from "../controller/reception_controller";
import privilege_controller from "../controller/privilege_controller";
import area from "../controller/area_controller";
import service_controller from "../controller/service_controller";
import bedType_controller from "../controller/bed_type_controller";
import price_controller from "../controller/price_controller";
import room_controller from "../controller/room_controller";
import floor_controller from "../controller/floor_controller";
import service_detail_controller from "../controller/service_detail_controller";
import payment_method_controller from "../controller/payment_method_controller";
import invoice_controller from "../controller/invoice_controller";
import customer_controller from "../controller/customer_controller";
import bed_controller from "../controller/bed_controller";
import history_controller from "../controller/history_controller";
import company_controller from "../controller/company_controller";
import course_controller from "../controller/course_controller"

import {checkCookieExp} from "../middlewares/checkCookie";
import checkPrivilege from "../middlewares/checkPrivilege";

import validator from "../middlewares/checkValidtator";

const routes=Express.Router();

const initAPIRouter=(app)=>{
    routes.post('/api/login',login);
    routes.get('/api/privilege/getUserPrivilege',[checkCookieExp],reception_controller.getUserPrivilege);
    routes.get('/api/privilege/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getAllPrivilege);

    routes.post('/api/area/insertArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea, validator.validateArea()],area.insertNewArea);
    routes.post('/api/area/updateArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea, validator.validateUpdateArea()],area.updateArea);
    routes.post('/api/area/deleteArea',[checkCookieExp,checkPrivilege.checkPrivilegeForArea],area.deleteArea);
    routes.get('/api/area/getAll',[checkCookieExp],area.getAllArea);

    routes.post('/api/floor/updateFloor',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateFloor()],floor_controller.updateFloor);
    routes.post('/api/floor/deleteFloor',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],floor_controller.deleteFloor);
    routes.get('/api/floor/getFloorByIDArea',[checkCookieExp],floor_controller.getAllFloorByIdArea);

    routes.post('/api/room/insertRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateRoom()],room_controller.insertNewRoom);
    routes.post('/api/room/updateRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateRoom()],room_controller.updateRoom);
    routes.post('/api/room/deleteRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],room_controller.deleteRoom);
    routes.get('/api/room/getAvaiableRoomByIDArea',[checkCookieExp],room_controller.getAvaiableRoomByAreaID);
    routes.get('/api/room/getRoomInUsed',[checkCookieExp],room_controller.getRoomInUsed);
    routes.get('/api/room/countAllRoom',[checkCookieExp],room_controller.countAllRoom);
    routes.get('/api/room/countRoomByIDArea',[checkCookieExp],room_controller.countRoomByAreaID);
    routes.get('/api/room/getRoomByIDFloor',[checkCookieExp],room_controller.getRoomByFloorID);

    routes.post('/api/bedtype/insertBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validateInitBedType()],bedType_controller.insertBedType);
    routes.post('/api/bedtype/updateBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validateUpdateBedType()],bedType_controller.updateBedType);
    routes.post('/api/bedtype/deleteBedType',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],bedType_controller.deleteBedType);
    routes.get('/api/bedtype/getAll',[checkCookieExp],bedType_controller.getAllBedType);

    routes.post('/api/price/insertPrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validatePrice()],price_controller.insertPrice);
    routes.post('/api/price/updatePrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed,validator.validatePrice()],price_controller.updatePrice);
    routes.post('/api/price/deletePrice',[checkCookieExp,checkPrivilege.checkPrivilegeForBed],price_controller.deletePrice);
    routes.get('/api/price/getPriceByIDBedType',[checkCookieExp],price_controller.getPriceByBedType);
    routes.get('/api/price/getPriceByID',[checkCookieExp],price_controller.getPriceByID);

    routes.post('/api/service/insertService',[checkCookieExp,checkPrivilege.checkPrivilegeForService, validator.validateService()],service_controller.insertService);
    routes.post('/api/service/updateService',[checkCookieExp,checkPrivilege.checkPrivilegeForService, validator.validateService()],service_controller.updateService);
    routes.post('/api/service/deleteService',[checkCookieExp,checkPrivilege.checkPrivilegeForService],service_controller.deleteService);
    routes.get('/api/service/getAll',[checkCookieExp],service_controller.getAllService);
   
    routes.post('/api/servicedetail/insertServiceDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.insertServiceDetail);
    routes.post('/api/servicedetail/updateServiceDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.updateServiceDetail);
    routes.post('/api/servicedetail/deleteServiceDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.deleteServiceDetail);
    routes.get('/api/servicedetail/getServiceDetailByIDBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.getServiceDetailByIDBed);

    routes.post('/api/paymentmethod/insertPaymentMethod',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.insertPaymentMethod);
    routes.post('/api/paymentmethod/updatePaymentMethod',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.updatePaymentMethod);
    routes.post('/api/paymentmethod/deletePaymentMethod',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],payment_method_controller.deletePaymentMethod);
    routes.get('/api/paymentmethod/getAll',[checkCookieExp],payment_method_controller.getAllPaymentMethod);

    routes.post('/api/customer/insertCustomer',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer,validator.validateCustomer()],customer_controller.insertCustomer);
    routes.post('/api/customer/insertCustomerList',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer,validator.validateCustomer()],customer_controller.insertCustomerList);
    routes.post('/api/customer/updateCustomer',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer,validator.validateCustomer()],customer_controller.updateCustomer);
    routes.post('/api/customer/updateCustomerList',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer,validator.validateCustomer()],customer_controller.updateCustomerList);
    routes.post('/api/customer/deleteCustomer',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.deleteCustomer);
    routes.post('/api/customer/deleteCustomerList',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.deleteCustomerList);
    routes.get('/api/customer/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.getAllCustomer);
    routes.get('/api/customer/getCustomerByCourseAndCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.getCustomerByCourseAndCompany);
    routes.get('/api/customer/getCustomerInUsedByCourseAndCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.getCustomerInUsedByCourseAndCompany);
    routes.get('/api/customer/getRoomlessCustomerByCourseAndCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],customer_controller.getRoomlessCustomerByCourseAndCompany);
    routes.get('/api/customer/getAvaiableCustomerByCourseAndCompany',[checkCookieExp],customer_controller.getAvaiableCustomerByCourseAndCompany);
    routes.get('/api/customer/getCustomerListByCourseAndCompany',[checkCookieExp],customer_controller.getCustomerListByCourseAndCompany);

    routes.post('/api/invoice/insertInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForInvoice],invoice_controller.insertInvoice);
    routes.post('/api/invoice/updateInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForInvoice],invoice_controller.updateInvoice);
    routes.post('/api/invoice/deleteInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],invoice_controller.deleteInvoice);
    routes.get('/api/invoice/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForInvoice],invoice_controller.getAllInvoice);
    

    routes.post('/api/reception/insertReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validateNewReception()],reception_controller.insertReception);
    routes.post('/api/reception/updateReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting, validator.validateUpdateReception()],reception_controller.updateReception);
    routes.post('/api/reception/deleteReception',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.deleteReception);
    routes.post('/api/reception/resetPassword',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting,validator.validatePassword()],reception_controller.updateReceptionPassword);
    routes.post('/api/reception/changePassword',[checkCookieExp,validator.validateUserPassword()],reception_controller.changeUserPassword);
    routes.get('/api/reception/getAll',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],reception_controller.getAllReception);
    routes.get('/api/reception/getReceptionByID',[checkCookieExp],reception_controller.getReceptionByID);

    routes.post('/api/privilegedetail/insertPrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.insertPrivilegeDetail);
    routes.post('/api/privilegedetail/updatePrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.updatePrivilegeDetail);
    routes.post('/api/privilegedetail/deletePrivilegeDetail',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.deletePrivilegeDetail);
    routes.get('/api/privilegedetail/getPrivilegeByIDUser',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],privilege_controller.getPrivilegeByIDUser);

    routes.get('/api/bed/countBedInUsedByRoomID',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.countBedInUsedByRoomID);
    routes.get('/api/bed/getBedInRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getBedInRoom);
    routes.get('/api/bed/getPreBookedBedInRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getPreBookedBedInRoom);
    routes.get('/api/bed/getBedInInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getBedInInvoice);
    routes.get('/api/bed/getUnpaidBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getUnpaidBedByIDCourseAndIDCompany);
    routes.get('/api/bed/getBedByID',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getBedByID);
    routes.get('/api/bed/getCheckoutedBed',[checkCookieExp,checkPrivilege.checkStatisticPrivileges],bed_controller.getCheckoutedBed);
    routes.get('/api/bed/getUnpaidBedByCourseAndCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForInvoice],bed_controller.getUnpaidBedByCourseAndCompany);
    routes.post('/api/bed/insertBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom,validator.validateBed],bed_controller.insertBed);
    routes.post('/api/bed/updateBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.updateBed);
    routes.post('/api/bed/update/timeInBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.updateTimeInBed);
    routes.post('/api/bed/changeRoom',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.changeRoom);
    routes.post('/api/bed/insertBeds',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.insertBeds);
    routes.post('/api/bed/deleteBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.deleteBed);
    routes.post('/api/bed/quickCheckoutForArea',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.quickCheckoutForArea);
    routes.post('/api/bed/checkoutSingleBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.checkoutSingleBed);

    routes.get('/api/bed/getRevenueBed',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getRevenueBed);
    routes.get('/api/bed/getRevenueBedInArea',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],bed_controller.getRevenueBedInArea);
    routes.get('/api/invoice/getRevenueInvoice',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.getRevenueInvoice);
    routes.get('/api/invoice/getRevenueInvoiceHaveService',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.getRevenueInvoiceHaveService);
    routes.get('/api/invoice/getRevenueInvoiceInArea',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.getRevenueInvoiceInArea);
    routes.get('/api/invoice/getRevenueInvoiceByCourse',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.getRevenueInvoiceByCourse);
    routes.get('/api/invoice/getRevenueInvoiceByCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],invoice_controller.getRevenueInvoiceByCompany);
    
    routes.get('/api/servicedetail/getServiceRevenue',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.getServiceRevenue);
    routes.get('/api/servicedetail/getTotalServiceRevenue',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.getTotalServiceRevenue);
    routes.get('/api/servicedetail/getServiceDetailRevenue',[checkCookieExp,checkPrivilege.checkPrivilegeForRoom],service_detail_controller.getServiceDetailRevenue);

    routes.get('/api/company/getAll',[checkCookieExp],company_controller.getAllCompany);
    routes.get('/api/company/getCompanyByCourse',[checkCookieExp],company_controller.getCompanyByCourse);
    routes.post('/api/company/insertCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],company_controller.insertCompany);
    routes.post('/api/company/updateCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],company_controller.updateCompany);
    routes.post('/api/company/deleteCompany',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],company_controller.deleteCompany);

    routes.get('/api/course/getAll',[checkCookieExp],course_controller.getAllCourse);
    routes.get('/api/course/getEnableCourse',[checkCookieExp],course_controller.getEnableCourse);
    routes.get('/api/course/getDisableCourse',[checkCookieExp],course_controller.getDisableCourse);
    routes.get('/api/course/get/coursesStartedDuringThePeriod',[checkCookieExp],course_controller.getCoursesStartedDuringThePeriod);
    routes.post('/api/course/insertcourse',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],course_controller.insertCourse);
    routes.post('/api/course/updatecourse',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],course_controller.updateCourse);
    routes.post('/api/course/update/courseListStatus',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],course_controller.updateStatusForCourseList);
    routes.post('/api/course/deletecourse',[checkCookieExp,checkPrivilege.checkPrivilegeForCustomer],course_controller.deleteCourse);

    routes.get('/api/history',[checkCookieExp,checkPrivilege.checkPrivilegeForSetting],history_controller.getAllHistory)
    return app.use('/',routes);
}

export default initAPIRouter;