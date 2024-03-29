import { createSlice } from "@reduxjs/toolkit";

export const accountFeature=createSlice({
    name:'account',
    initialState:{
        receptionSelection:null,
        updateSuccess:0,
        openCreateModal:false,
        modalAction:'create',
        openResetModal:false,
        openPrivilegeModal:false,
    },
    reducers:{
        setReceptionSelection:(state,action)=>{
            state.receptionSelection=action.payload
        },
        setUpdateSuccess:(state)=>{
            state.updateSuccess+=1
        },
        setOpenCreateModal:(state,action)=>{
            state.openCreateModal=action.payload
        },
        setModalAction:(state,action)=>{
            state.modalAction=action.payload
        },
        setOpenResetModal:(state,action)=>{
            state.openResetModal=action.payload
        },
        setOpenPrivilegeModal:(state,action)=>{
            state.openPrivilegeModal=action.payload
        },
    }
});

export const { 
    setUpdateSuccess, setReceptionSelection, setOpenCreateModal, setModalAction,
    setOpenResetModal, setOpenPrivilegeModal
}=accountFeature.actions;

export default accountFeature.reducer;