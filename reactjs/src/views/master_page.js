import React, { useEffect } from "react";
import SideBar from "../components/core_components/sideBar";
import Header from "../components/core_components/header";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setReceptionRole } from "../redux_features/receptionFeature";
import { toast } from "react-toastify";

export default function MasterPage({ children, cookie, removeCookie }) {
    const dispatch = useDispatch();
    useEffect(() => {
        if (cookie.loginCode) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/privilege/getUserPrivilege', { withCredentials: true })
                .then(function (res) {
                    if (res.status) {
                        dispatch(setReceptionRole(res.data.privilege));
                    }
                })
                .catch(function (err) {
                    toast.error(err.response.data.error_code);
                })
        }
    }, [cookie.loginCode,dispatch])
    return (
        <div className="flex">
            <SideBar />
            <div className="w-full h-screen block">
                <div className="w-full lg:h-[7%] ">
                    <Header removeCookie={removeCookie} cookie={cookie} />
                </div>
                <div className="w-full lg:h-[93%] ">
                    {children ? children : ""}
                </div>
            </div>
        </div>
    )
}