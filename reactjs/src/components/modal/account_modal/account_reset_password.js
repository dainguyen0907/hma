import { Button, FloatingLabel, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenResetModal } from "../../../redux_features/accountFeature";
import axios from "axios";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AccountResetPassword() {

    const accountFeature = useSelector(state => state.account);
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setPassword("");
        setConfirmPassword("");
    }, [accountFeature.openResetModal])

    const onHandleConfirm = () => {

        if (isProcessing)
            return;

        setIsProcessing(true);

        if (password !== confirmPassword) {
            toast.error('Xác nhận mật khẩu chưa chính xác');
            setIsProcessing(false);
        } else if (accountFeature.receptionSelection) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/reception/resetPassword', {
                id: accountFeature.receptionSelection.id,
                password: password,
                repassword: confirmPassword,
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    dispatch(setOpenResetModal(false));
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
        <Modal show={accountFeature.openResetModal} onClose={() => dispatch(setOpenResetModal(false))} className="relative">
            <Modal.Body>
                <div className="absolute top-1 right-3">
                    <IconButton onClick={() => dispatch(setOpenResetModal(false))}>
                        <Close />
                    </IconButton>
                </div>
                <fieldset style={{ border: '2px dashed  #E5E7EB', padding: '0 5px' }}>
                    <legend className="font-bold text-blue-700">Cập nhật mật khẩu</legend>
                    <FloatingLabel label="Tài khoản" variant="outlined" value={accountFeature.receptionSelection ? accountFeature.receptionSelection.reception_account : ""} type="text" readOnly />
                    <FloatingLabel label="Mật khẩu mới" variant="outlined" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                    <FloatingLabel label="Xác nhận mật khẩu" variant="outlined" value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </fieldset>
                <div className="pt-1 flex flex-row-reverse gap-2">
                    <Button color="blue" onClick={() => onHandleConfirm()}>Cập nhật</Button>
                    <Button color="gray" onClick={() => dispatch(setOpenResetModal(false))}>Huỷ</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}