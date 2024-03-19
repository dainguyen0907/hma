import { Button, FloatingLabel, Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenCreateModal, setUpdateSuccess } from "../../redux_features/accountFeature";
import { toast } from "react-toastify";
import axios from "axios";

export default function AccountCreateModal() {
    const dispatch = useDispatch();
    const accountFeature = useSelector(state => state.account);

    const [idReception, setIdReception] = useState(-1);
    const [receptionAccount, setReceptionAccount] = useState("");
    const [receptionPassword, setReceptionPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [receptionName, setReceptionName] = useState(-1);
    const [receptionEmail, setReceptionEmail] = useState("");
    const [receptionPhone, setReceptionPhone] = useState("");
    const [receptionStatus, setReceptionStatus] = useState(true);

    useEffect(() => {
        if (accountFeature.receptionSelection) {
            setIdReception(accountFeature.receptionSelection.id);
            setReceptionAccount(accountFeature.receptionSelection.reception_account);
            setReceptionName(accountFeature.receptionSelection.reception_name);
            setReceptionEmail(accountFeature.receptionSelection.reception_email);
            setReceptionPhone(accountFeature.receptionSelection.reception_phone);
            setReceptionStatus(accountFeature.receptionSelection.reception_status);
        } else {
            resetReception();
        }
    }, [accountFeature.receptionSelection])

    useEffect(() => {
        if (accountFeature.openCreateModal && accountFeature.modalAction === 'create') {
            resetReception();
        }
    }, [accountFeature.openCreateModal, accountFeature.modalAction])

    const resetReception = () => {
        setIdReception(-1);
        setReceptionAccount("");
        setReceptionPassword("");
        setConfirmPassword("");
        setReceptionName("");
        setReceptionEmail("");
        setReceptionPhone("");
        setReceptionStatus(true);
    }

    const onHandleConfirm = () => {
        if (accountFeature.modalAction === "create") {
            if (receptionPassword !== confirmPassword) {
                toast.error("Xác nhận mật khẩu chưa trùng khớp.");
            } else {
                axios.post(process.env.REACT_APP_BACKEND + 'api/reception/insertReception', {
                    account: receptionAccount,
                    password: receptionPassword,
                    name: receptionName,
                    email: receptionEmail,
                    phone: receptionPhone,
                }, { withCredentials: true })
                    .then(function (response) {
                        dispatch(setUpdateSuccess());
                        dispatch(setOpenCreateModal(false));
                        toast.success('Tạo tài khoản thành công!');
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error(error.response.data.error_code);
                        }
                    })
            }
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'api/reception/updateReception', {
                id: idReception,
                name: receptionName,
                email: receptionEmail,
                phone: receptionPhone,
                status: receptionStatus
            }, { withCredentials: true })
                .then(function (response) {
                    dispatch(setUpdateSuccess());
                    dispatch(setOpenCreateModal(false));
                    toast.success(response.data.result);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    

    return (
        <Modal show={accountFeature.openCreateModal} onClose={() => dispatch(setOpenCreateModal(false))}>
            <Modal.Header>{accountFeature.modalAction === 'create' ? 'Thêm tài khoản mới' : 'Cập nhật thông tin'}</Modal.Header>
            <Modal.Body>
                <fieldset style={{ border: "1px dashed #E5E7EB", marginBottom: '5px', padding: '0 5px' }}>
                    <legend className="font-bold text-blue-700">Thông tin tài khoản</legend>
                    <FloatingLabel label="Tài khoản" type="text" variant="outlined" value={receptionAccount} onChange={(e) => setReceptionAccount(e.target.value)} readOnly={accountFeature.modalAction !== 'create'} />
                    {accountFeature.modalAction === 'create' ?
                        <div>
                            <FloatingLabel label="Mật khẩu" variant="outlined" type="password" value={receptionPassword} onChange={(e) => setReceptionPassword(e.target.value)} />
                            <FloatingLabel label="Xác nhận mật khẩu" variant="outlined" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div> : ""}
                </fieldset>
                <fieldset style={{ border: "1px dashed #E5E7EB", padding: '0 5px' }}>
                    <legend className="font-bold text-blue-700">Thông tin người dùng</legend>
                    <FloatingLabel label="Tên người dùng" type="text" variant="outlined" value={receptionName} onChange={(e) => setReceptionName(e.target.value)} />
                    <FloatingLabel label="Email" type="email" variant="outlined" value={receptionEmail} onChange={(e) => setReceptionEmail(e.target.value)} />
                    <FloatingLabel label="Số điện thoại" type="number" variant="outlined" value={receptionPhone} onChange={(e) => setReceptionPhone(e.target.value)} />
                    {accountFeature.modalAction === 'update' ?
                        <div className="grid grid-cols-3">
                            <span className="font-bold">Trạng thái:</span>
                            <div className="flex items-center gap-2">
                                <Radio id="accountActive" checked={receptionStatus} onChange={() => setReceptionStatus(true)} />
                                <Label htmlFor="accountActive">Hoạt động</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="accountInactive" checked={!receptionStatus} onChange={() => setReceptionStatus(false)} />
                                <Label htmlFor="accountInactive">Khoá</Label>
                            </div>
                        </div> : ""}
                </fieldset>
            </Modal.Body>
            <Modal.Footer>
                <Button color="blue" onClick={() => onHandleConfirm()}>{accountFeature.modalAction === 'create' ? 'Tạo mới' : 'Cập nhật'}</Button>
                {accountFeature.modalAction === 'create' ?
                    <Button color="teal" onClick={() => resetReception()}>Tạo lại</Button> : ""}
                <Button color="gray" onClick={() => dispatch(setOpenCreateModal(false))}>Huỷ</Button>
            </Modal.Footer>
        </Modal>
    )
}