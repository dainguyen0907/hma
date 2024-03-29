import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import { FaCirclePlus } from "react-icons/fa6";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import ServiceModal from "../../components/modal/service_modal";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalService, setServiceSelection } from "../../redux_features/serviceFeature";

export default function ServiceSetting() {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    const serviceFeature = useSelector(state => state.service);

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã số',
            size: '10'
        },
        {
            accessorKey: 'service_name',
            header: 'Tên dịch vụ',
            size: '100'
        }, {
            accessorKey: 'service_price',
            header: 'Đơn giá (VNĐ)',
            size: '12'
        }
    ], [])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + "api/service/getAll", { withCredentials: true })
            .then(function (response) {
                setData(response.data.result);
                setIsLoading(false);
            }).catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.error_code);
                }
            })
    }, [serviceFeature.serviceUpdateSuccess])

    const onDelete = (ids) => {
        if (window.confirm("Bạn có muốn xoá dịch vụ này?")) {
            axios.post(process.env.REACT_APP_BACKEND + "api/service/deleteService", {
                id: ids
            }, { withCredentials: true })
                .then(function (response) {
                    toast.success(response.data.result);
                    setSuccess(success + 1);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }

    return (<div className="w-full h-full overflow-auto p-2">
        <div className="border-2 rounded-xl w-full h-full">
            <div className="border-b-2 px-3 py-1 grid grid-cols-2 h-[8%]">
                <div className="py-2">
                    <h1 className="font-bold text-blue-600">Danh sách dịch vụ</h1>
                </div>
                
            </div>
            <div className="w-full h-[92%]">
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    state={{ isLoading: isLoading }}
                    localization={MRT_Localization_VI}
                    muiCircularProgressProps={{
                        color: 'secondary',
                        thickness: 5,
                        size: 55
                    }}
                    muiSkeletonProps={{
                        animation: 'pulse',
                        height: 28
                    }}
                    enableRowActions
                    positionActionsColumn="last"
                    renderTopToolbarCustomActions={(table)=>(
                        <div className="mr-auto">
                            <IconContext.Provider value={{ size: '20px' }}>
                                <Button outline gradientMonochrome="success"
                                    onClick={() => {
                                        dispatch(setServiceSelection(null));
                                        dispatch(setOpenModalService(true));
                                    }}>
                                    <FaCirclePlus className="mr-2" /> Thêm dịch vụ
                                </Button>
                            </IconContext.Provider>
                        </div>
                    )}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                            <IconButton color="primary"
                                onClick={() => {
                                    dispatch(setServiceSelection(row.original));
                                    dispatch(setOpenModalService(true));
                                }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton color="error"
                                onClick={() => {
                                    onDelete(row.original.id)
                                }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                />
                <ServiceModal/>
            </div>
        </div>
    </div>)
}