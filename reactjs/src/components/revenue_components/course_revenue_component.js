import { Download, Print, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setInvoiceSelection, setOpenModalInvoiceHistory, setOpenModalPrintInvoice } from "../../redux_features/invoiceFeature";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import { download, generateCsv, mkConfig } from "export-to-csv";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'HMA Log'
})


export default function CourseRevenueTab() {

    const revenueFeature = useSelector(state => state.revenue);

    const [data, setData] = useState([]);
    const [courseList, setcourseList] = useState([]);
    const [courseID, setcourseID] = useState(-1);
    const [totalPayment, setTotalPayment] = useState(0);
    const [countInvoice, setCountInvoice] = useState(0);

    const dispatch = useDispatch();

    const onHandleExportCSV = () => {
        if (data.length > 0) {
            const csv = generateCsv(csvConfig)(data);
            download(csvConfig)(csv);
        } else {
            toast.error("Không có dữ liệu để xuất!");
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'invoice_code',
            header: 'Mã hoá đơn',
            size: '10'
        },
        {
            accessorKey: 'Customer.customer_name',
            header: 'Khách hàng',
            size: '10'
        },
        {
            header: 'Tổng tiền',
            Cell: ({ renderedCellValue, row }) => (
                <Box className="flex items-center gap-4">
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(parseInt(row.original.invoice_total_payment) - parseInt(row.original.invoice_discount))}
                </Box>
            ),
        },
        {
            header: 'Ngày thanh toán',
            Cell: ({ renderedCellValue, row }) => (
                <Box className={row.original.invoice_payment_date ? "flex items-center gap-4" : "text-red-700 font-bold"}>
                    {row.original.invoice_payment_date ? new Date(row.original.invoice_payment_date).toLocaleString('vi-VI') : "Chưa thanh toán"}
                </Box>
            ),
        },
        {
            accessorKey: 'Payment_method.payment_method_name',
            header: 'PT thanh toán',
            size: '10'
        },
    ], [])

    useEffect(() => {
        if (revenueFeature.currentIndex === 3) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/course/getAll', { withCredentials: true })
                .then(function (response) {
                    setcourseList(response.data.result);
                    setcourseID(response.data.result[0].id);
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.response.data.error_code);
                    }
                })
        }
    }, [revenueFeature.currentIndex])

    useEffect(() => {
        if (revenueFeature.currentIndex === 3 && courseID !== -1) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/invoice/getRevenueInvoiceByCourse?id=' + courseID, { withCredentials: true })
                .then(function (response) {
                    setCountInvoice(response.data.result.countInvoice);
                    setTotalPayment(response.data.result.sumPayment);
                    setData(response.data.result.data);
                }).catch(function (error) {
                    if (error.response)
                        toast.error("Dữ liệu bảng:" + error.response.data.error_code);
                })
        }
    }, [revenueFeature.fromDay, revenueFeature.toDay, revenueFeature.currentIndex, courseID])

    return (
        <div >
            <div className="font-bold text-blue-700 text-center">
                THỐNG KÊ DOANH THU THEO KHOÁ HỌC<br />
            </div>
            <p className="font-semibold text-blue-700">Thông tin đơn vị</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Đơn vị:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    Trường Cao đẳng Điện lực Thành phố Hồ Chí Minh.
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Địa chỉ:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    554 đường Hà Huy Giáp, phường Thạnh Lộc, Quận 12, Thành phố Hồ Chí Minh.
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Khoá học:
                </div>
                <div className="pb-1">
                    <TextField value={courseID} onChange={(e) => setcourseID(e.target.value)} variant="outlined" label="Khoá học" size="small" sx={{ width: '350px' }} select>
                        {
                            courseList.map((value, key) =>
                                <MenuItem value={value.id} key={key}>{value.id}.{value.course_name} </MenuItem>)
                        }
                    </TextField>
                </div>
            </div>
            <hr />
            <p className="font-semibold text-blue-700">Dữ liệu doanh thu</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng doanh thu:
                </div>
                <div className="col-span-3 text-start font-semibold" hidden={totalPayment === 0}>
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPayment)}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng số hoá đơn:
                </div>
                <div className="col-span-3 text-start font-semibold" hidden={countInvoice === 0}>
                    {countInvoice}
                </div>
            </div>

            <hr />
            <p className="text-blue-700 font-semibold">
                Chi tiết hoá đơn
            </p>
            <MaterialReactTable
                data={data}
                columns={columns}
                enableBottomToolbar={false}
                renderTopToolbarCustomActions={(table) => (
                    <Button startIcon={<Download />} onClick={onHandleExportCSV} color="success">
                        Xuất file CSV
                    </Button>
                )}
                localization={MRT_Localization_VI}
                positionActionsColumn="last"
                enableRowActions={true}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                        <IconButton color="primary"
                            title="Xem lịch sử"
                            onClick={() => {
                                dispatch(setInvoiceSelection(row.original));
                                dispatch(setOpenModalInvoiceHistory(true));
                            }}
                        >
                            <RemoveRedEye />
                        </IconButton>
                        <IconButton color="secondary"
                            title="In lại hoá đơn"
                            onClick={() => {
                                dispatch(setInvoiceSelection(row.original));
                                dispatch(setOpenModalPrintInvoice(true));
                            }}>
                            <Print />
                        </IconButton>

                    </Box>
                )}
            />
        </div>
    )
}