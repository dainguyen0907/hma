import { createSlice } from "@reduxjs/toolkit";

export const customerFeature=createSlice({
    name:'customer',
    initialState:{
        openCustomerModal:false,
        customerUpdateSuccess:0,
        customerSelection:null
    },
    reducers:{
        setOpenCustomerModal:(state,action)=>{
            state.openCustomerModal=action.payload
        },
        setCustomerUpdateSuccess:(state)=>{
            state.customerUpdateSuccess+=1
        },
        setCustomerSelection:(state,action)=>{
            state.customerSelection=action.payload
        }
    }
});

export const { setCustomerSelection, setCustomerUpdateSuccess, setOpenCustomerModal}=customerFeature.actions;

export default customerFeature.reducer;