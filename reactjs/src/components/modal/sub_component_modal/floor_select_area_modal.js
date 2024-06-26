import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalSelectArea } from "../../../redux_features/floorFeature";
import {setAreaID, setAreaName} from "../../../redux_features/floorFeature";
import { toast } from "react-toastify";
import axios from "axios";

export default function SelectAreaModal(){
    const dispatch=useDispatch();
    const floorFeature=useSelector(state=>state.floor);
    const [area,setArea]=useState([]);
    

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND+'api/area/getAll',{ withCredentials: true })
        .then(function(response){
            setArea(response.data.result);
        }).catch(function(error){
            if(error.code=== 'ECONNABORTED'){
                toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
            }else if(error.response){
                toast.error('Khu vực: '+error.response.data.error_code);
            }else{
                toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
            }
        })
    },[]);

    const onSelect=(e)=>{
        dispatch(setAreaID(e.target.value.id));
        dispatch(setAreaName(e.target.value.area_name));
        dispatch(setOpenModalSelectArea(false));
    }

    return(
        <Modal show={floorFeature.openModalSelectArea} dismissible onClose={(e)=>dispatch(setOpenModalSelectArea(false))}>
            <Modal.Body>
                <FormControl fullWidth>
                    <InputLabel id="area-label">Chọn khu vực</InputLabel>
                    <Select labelId="area-label"
                    label="Chọn khu vực"
                    onChange={onSelect}
                    defaultValue={-1}
                    >
                        <MenuItem disabled value="-1">Chọn khu vực</MenuItem>
                        {area.map((value,key)=><MenuItem value={value} key={key}>{value.area_name}</MenuItem>)}  
                    </Select>
                </FormControl>
            </Modal.Body>
        </Modal>
    )
}