import { createSlice } from "@reduxjs/toolkit";

export const floorFeatures =createSlice({
    name:'floor',
    initialState:{
        openModalChangeName:false,
        openModalInsertRoom:false,
        openModalSelectArea:false,
        openModalUpdateRoom:false,
        openModalCheckIn:false,
        openModalCheckOut:false,
        openModalCheckOutCompany:false,
        openModalChangeRoom:false,
        openModalSinglePayment:false,
        openModalMultiCheckOut:false,
        positionScrollbar:0,
        roomPriceTable:[],
        servicePriceTable:[],
        floorMenuAnchor:null,
        roomMenuAnchor:null,
        floorUpdateSuccess:0,
        roomUpdateSuccess:0,
        checkoutModalStatus:true,
        areaID:-1,
        areaName:'Chọn khu vực',
        priceID:-1,
        floorID:-1,
        floorName:"",
        roomID:-1,
        bedID:[],
        roomName:"",
        bedInRoomStatus:-1,
        roomBedQuantity:0,
        roomStatus:false,
        roomNote:"",
        invoice_discount:0,
        paymentMethod:{},
        paymentInfor:null,
        checkinErrorList:[],
        openModalCheckinStatus:false,
    },
    reducers:{
        setOpenModalCheckinStatus:(state,action)=>{
            state.openModalCheckinStatus=action.payload
        },
        setCheckinErrorList:(state,action)=>{
            state.checkinErrorList=action.payload
        },
        setOpenModalChangeName:(state,action)=>{
            state.openModalChangeName=action.payload
        },
        setOpenModalInsertRoom:(state,action)=>{
            state.openModalInsertRoom=action.payload
        },
        setOpenModalSelectArea:(state,action)=>{
            state.openModalSelectArea=action.payload
        },
        setOpenModalUpdateRoom:(state,action)=>{
            state.openModalUpdateRoom=action.payload
        },
        setOpenModalCheckIn:(state,action)=>{
            state.openModalCheckIn=action.payload
        },
        setOpenModalCheckOut:(state,action)=>{
            state.openModalCheckOut=action.payload
        },
        setOpenModalCheckOutCompany:(state,action)=>{
            state.openModalCheckOutCompany=action.payload
        },
        setOpenModalMultiCheckOut:(state,action)=>{
            state.openModalMultiCheckOut=action.payload
        },
        setPositionScrollbar:(state,action)=>{
            state.positionScrollbar=action.payload
        },
        setOpenModalChangeRoom:(state,action)=>{
            state.openModalChangeRoom=action.payload
        },
        setOpenModalSinglePayment:(state,action)=>{
            state.openModalSinglePayment=action.payload
        },
        setInvoiceDiscount:(state,action)=>{
            state.invoice_discount=action.payload
        },
        setFloorMenuAnchor:(state,action)=>{
            if(state.floorMenuAnchor===null&&action.payload!==null){
                state.floorMenuAnchor={
                mouseX:action.payload.X + 2,
                mouseY:action.payload.Y - 6,
                }
            }else{
                state.floorMenuAnchor=null
            }
        },
        setRoomMenuAnchor:(state,action)=>{
            if(state.roomMenuAnchor===null&&action.payload!==null){
                state.roomMenuAnchor={
                mouseX:action.payload.X + 2,
                mouseY:action.payload.Y - 6,
                }
            }else{
                state.roomMenuAnchor=null
            }
        },
        setRoomPriceTable:(state,action)=>{
            state.roomPriceTable=action.payload
        },
        setServicePriceTable:(state,action)=>{
            state.servicePriceTable=action.payload
        },
        setAreaID:(state,action)=>{
            state.areaID=action.payload
        },
        setAreaName:(state,action)=>{
            state.areaName=action.payload
        },
        setFloorID:(state,action)=>{
            state.floorID=action.payload
        },
        setBedID:(state,action)=>{
            state.bedID=action.payload
        },
        setPriceID:(state,action)=>{
            state.priceID=action.payload
        },
        setFloorName:(state,action)=>{
            state.floorName=action.payload
        },
        setRoomID:(state,action)=>{
            state.roomID=action.payload
        },
        setRoomName:(state,action)=>{
            state.roomName=action.payload
        },
        setRoomBedQuantity:(state,action)=>{
            state.roomBedQuantity=action.payload
        },
        setFloorUpdateSuccess:(state)=>{
            state.floorUpdateSuccess+=1
        },
        setRoomUpdateSuccess:(state)=>{
            state.roomUpdateSuccess+=1
        },
        setRoomStatus:(state,action)=>{
            state.roomStatus=action.payload;
        },
        setRoomNote:(state,action)=>{
            state.roomNote=action.payload;
        },
        setBedInRoomStatus:(state,action)=>{
            state.bedInRoomStatus=action.payload
        },
        setPaymentMethod:(state,action)=>{
            state.paymentMethod=action.payload
        },
        setPaymentInfor:(state,action)=>{
            state.paymentInfor=action.payload
        }, 
        setCheckoutModalStatus:(state,action)=>{
            state.checkoutModalStatus=action.payload
        }
    }
})

export const {
    setOpenModalChangeName,setFloorMenuAnchor,setOpenModalInsertRoom,
    setFloorID, setFloorName,setRoomBedQuantity,setRoomID,setRoomName,
    setOpenModalSelectArea, setAreaID, setRoomMenuAnchor, setOpenModalUpdateRoom,
    setFloorUpdateSuccess,setRoomUpdateSuccess, setAreaName, setRoomStatus, 
    setBedInRoomStatus, setOpenModalCheckIn, setOpenModalCheckOut, setOpenModalChangeRoom,
    setBedID, setOpenModalSinglePayment, setRoomPriceTable, setServicePriceTable,
    setPaymentMethod, setOpenModalMultiCheckOut,setPaymentInfor, setPriceID, setInvoiceDiscount,
    setRoomNote, setOpenModalCheckOutCompany, setOpenModalCheckinStatus, setCheckinErrorList,
    setPositionScrollbar, setCheckoutModalStatus
}=floorFeatures.actions;

export default floorFeatures.reducer;