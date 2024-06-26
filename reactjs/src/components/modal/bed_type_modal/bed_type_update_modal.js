import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {  Button, IconButton, MenuItem,  TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeUpdateSuccess, setOpenBedTypeUpdateModal } from "../../../redux_features/bedTypeFeature";
import { Close } from "@mui/icons-material";

export default function UpdateBedTypeModal() {
    const [prices, setPrices] = useState([]);
    const [idSelectedPrice, setIdSelectedPrice] = useState(0);
    const [priceHour, setPriceHour] = useState(0);
    const [priceDate, setPriceDate] = useState(0);
    const [priceWeek, setPriceWeek] = useState(0);
    const [priceMonth, setPriceMonth] = useState(0);

    const [bedTypeName, setBedTypeName] = useState("");

    const [isProcessing,setIsProcessing]=useState(false);

    const bedTypeFeature = useSelector(state => state.bedType);
    const dispatch = useDispatch();

    useEffect(() => {
        if (bedTypeFeature.bedTypeSelection) {
            setBedTypeName(bedTypeFeature.bedTypeSelection.bed_type_name)
            axios.get(process.env.REACT_APP_BACKEND + "api/price/getPriceByIDBedType?id=" + bedTypeFeature.bedTypeSelection.id, { withCredentials: true })
                .then(function (response) {
                    setPrices(response.data.result);
                    setIdSelectedPrice(bedTypeFeature.bedTypeSelection.bed_type_default_price);
                }).catch(function (error) {
                    if(error.code=== 'ECONNABORTED'){
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    }else if(error.response){
                        toast.error("Thông tin đơn giá:"+error.response.data.error_code);
                    }else{
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                })
        }

    }, [bedTypeFeature.bedTypeSelection]);

    useEffect(() => {
        if (bedTypeFeature.bedTypeSelection) {
            for (let i = 0; i < prices.length; i++) {
                if (idSelectedPrice === prices[i].id) {
                    setPriceDate(prices[i].price_day);
                    setPriceWeek(prices[i].price_week);
                    setPriceMonth(prices[i].price_month);
                    setPriceHour(prices[i].price_hour);
                    break;
                }
            }
        }

    }, [bedTypeFeature.bedTypeSelection, idSelectedPrice, prices]);

    const onConfirm = (e) => {
        e.preventDefault();

        if(isProcessing)
            return;

        setIsProcessing(true);

        if (bedTypeFeature.bedTypeSelection) {
            axios.post(process.env.REACT_APP_BACKEND + "api/bedtype/updateBedType", {
                name: bedTypeName,
                id: bedTypeFeature.bedTypeSelection.id,
                default_price: idSelectedPrice,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setBedTypeUpdateSuccess());
                    dispatch(setOpenBedTypeUpdateModal(false))

                }).catch(function (error) {
                    if(error.code=== 'ECONNABORTED'){
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    }else if(error.response){
                        toast.error(error.response.data.error_code);
                    }else{
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                }).finally(function(){
                    setIsProcessing(false);
                })
        }

    }

    return (
        <Modal show={bedTypeFeature.openBedTypeUpdateModal} onClose={() => dispatch(setOpenBedTypeUpdateModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenBedTypeUpdateModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Cập nhật loại giường
                </div>
                <form onSubmit={onConfirm}>
                    <div className="flex flex-col gap-2">
                        <TextField variant="outlined" fullWidth required size="small" label="Tên loại giường" type="text" value={bedTypeName} onChange={(e) => setBedTypeName(e.target.value)} />
                        <TextField variant="outlined" fullWidth required size="small" label="Đơn giá mặc định" select value={idSelectedPrice} onChange={(e) => setIdSelectedPrice(e.target.value)}>
                            {prices.map((value, key) => <MenuItem value={value.id} key={key}>
                                {value.price_name}
                            </MenuItem>)}
                        </TextField>
                        <TextField size="small" variant="outlined" label="Giá nghỉ trưa" type="number" value={priceHour} onChange={(e) => setPriceHour(e.target.value)} readOnly={true} />
                        <TextField size="small" variant="outlined" label="Giá theo ngày" type="number" value={priceDate} onChange={(e) => setPriceDate(e.target.value)} readOnly={true} />
                        <TextField size="small" variant="outlined" label="Giá theo tuần" type="number" value={priceWeek} onChange={(e) => setPriceWeek(e.target.value)} readOnly={true} />
                        <TextField size="small" variant="outlined" label="Giá theo tháng" type="number" value={priceMonth} onChange={(e) => setPriceMonth(e.target.value)} readOnly={true} />
                        <Button type="submit" color="primary" variant="contained">Cập nhật</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}