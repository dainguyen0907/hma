import { Backdrop, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FcAssistant, FcCurrencyExchange, FcDataSheet, FcDepartment, FcEngineering, FcMoneyTransfer, FcPortraitMode, FcViewDetails } from "react-icons/fc";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function SideBar() {
    const [sidebarExtend, setSidebarExtend] = useState(false);
    const [menuPosition, setMenuPosition] = useState(-1);
    const [menuRender, setMenuRender] = useState([]);
    const [menuStatus, setMenuStatus] = useState([false, false, false, false, false, false, false, false]);
    const wrapperRef = useRef(null);
    const reception_role = useSelector(state => state.reception.reception_role);
    const baseFeature = useSelector(state => state.base);

    useEffect(() => {
        let newRoleArray = [false, false, false, false, false, false, false, false];
        if (reception_role.length > 0) {
            reception_role.forEach((value) => (
                newRoleArray[value - 1] = true
            ))
        } else {
            newRoleArray.forEach((value, key) => (
                newRoleArray[key] = false
            ))
        }
        setMenuStatus(newRoleArray);

        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSidebarExtend(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [wrapperRef, reception_role]);

    useEffect(() => {
        switch (menuPosition) {
            default: {
                break;
            }
            case 1: {
                break;
            }
            case 2: {
                const arrayMenu = [
                    {
                        name: 'Quản lí loại giường',
                        link: '/motel/bed'
                    }, {
                        name: 'Quản lí đơn giá giường',
                        link: '/motel/price'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }
            case 3: {
                break;
            }
            case 4: {
                const arrayMenu = [
                    {
                        name: 'Quản lí công ty',
                        link: '/motel/company'
                    }, 
                    {
                        name: 'Quản lí khoá học',
                        link: '/motel/course'
                    }, 
                    {
                        name: 'Quản lí khách hàng',
                        link: '/motel/customer'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }
            case 5: {
                let arrayMenu = []
                // if (reception_role.findIndex(value => (parseInt(value) >= 6)) !== -1) {
                //     arrayMenu.push( {
                //         name: 'Thống kê doanh thu',
                //         link: '/motel/revenue'
                //     });
                // }
                arrayMenu.push(
                    {
                        name: 'Thống kê khách hàng',
                        link: '/motel/customerstatistics'
                    },
                );
                setMenuRender(arrayMenu);
                break;
            }
            case 6: {
                const arrayMenu = [
                    {
                        name: 'Lập hoá đơn',
                        link: '/motel/createinvoice'
                    },
                    {
                        name: 'Kiểm tra hoá đơn',
                        link: '/motel/invoice'
                    },
                    {
                        name: 'Thống kê doanh thu',
                        link: '/motel/revenue'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }
            case 7: {
                const arrayMenu = [
                    {
                        name: 'Quản trị tài khoản',
                        link: '/motel/admin/account'
                    },
                    {
                        name: 'Lịch sử chỉnh sửa',
                        link: '/motel/history'
                    }
                ];
                setMenuRender(arrayMenu);
                break;
            }

        }
    }, [menuPosition, reception_role])

    const onToggleClick = (currentPosition) => {
        if (!sidebarExtend) {
            setSidebarExtend(true);
        } else {
            if (menuPosition === currentPosition) {
                setSidebarExtend(false);
            }
        }
        setMenuPosition(currentPosition)
    }


    return (
        <>
            <div className={`h-screen flex flex-row fixed top-0 left-0 overflow-hidden z-50 transition duration-150 ${baseFeature.openSideBar ? '' : 'w-0'}`} ref={wrapperRef}>
                <div className="h-screen w-28 bg-gray-100 text-blue-500 font-bold p-2 border-r-2 z-50" id="side-bar">
                    <IconContext.Provider value={{ color: "white", size: "30px" }}>
                        {menuStatus[0] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer">
                                <a href="/motel/room"><center><FcDataSheet /></center>
                                    <small>Sơ đồ phòng</small>
                                </a>
                            </div> : ""
                        }
                        {menuStatus[1] ?
                            <div className="w-full h-fit p-2 text-center hover:cursor-pointer">
                                <a href="/motel/floor"><center><FcDepartment /></center>
                                    <small>Nhà nghỉ</small></a>
                            </div> : ""
                        }
                        {menuStatus[2] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => { onToggleClick(2); }}>
                                <center><FcMoneyTransfer /></center>
                                <small>Loại giường & đơn giá</small>
                            </div> : ""
                        }
                        {menuStatus[3] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => setSidebarExtend(false)}>
                                <a href="/motel/service"><center><FcAssistant /></center>
                                    <small>Dịch vụ</small>
                                </a>
                            </div> : ""
                        }
                        {menuStatus[4] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => onToggleClick(4)}>
                                <center><FcPortraitMode /></center>
                                <small>Khách hàng</small>
                            </div> : ""
                        }
                        {menuStatus[6] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => onToggleClick(5)}>
                                <center><FcViewDetails /></center>
                                <small>Thống kê</small>
                            </div> : ""
                        }
                        {menuStatus[5] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => toast.warning('Chức năng đang phát triển. Vui lòng quay lại sau')}>
                                <center><FcCurrencyExchange /></center>
                                <small>Kế toán</small>
                            </div> : ""
                        }
                        {menuStatus[7] ?
                            <div className="w-full h-fit p-2 text-center  hover:cursor-pointer" onClick={() => onToggleClick(7)}>
                                <center><FcEngineering /></center>
                                <small>Thiết lập</small>
                            </div> : ""
                        }

                    </IconContext.Provider>
                </div>
                <div id="side-bar-extend" className={`text-center h-screen overflow-hidden bg-gray-100 text-blue-500 top-0 z-0 transition duration-500 delay-500 ${sidebarExtend ? "w-52" : "w-0"}`}>
                    <List>
                        {menuRender.map((value, key) =>
                            <ListItemButton key={key}>
                                <a href={value.link} onClick={()=>setSidebarExtend(false)}>
                                    <ListItemText primary={value.name} />
                                </a>
                            </ListItemButton>
                        )}
                    </List>
                </div>
            </div>
            <div className={`w-screen h-screen bg-black z-10 bg-opacity-50 fixed top-0 left-28 ${sidebarExtend ? "" : "hidden"}`}></div>
            <Backdrop sx={{ color: '#fff', zIndex: '30' }} open={baseFeature.openLoadingScreen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

