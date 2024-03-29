import { Download, Print, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setInvoiceSelection, setOpenModalInvoiceHistory, setOpenModalPrintInvoice } from "../../redux_features/invoiceFeature";
import { MRT_Localization_VI } from "../../material_react_table/locales/vi";
import { download, generateCsv, mkConfig } from "export-to-csv";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: 'HMA Log'
})


export default function ServiceRevenueTab() {

    const revenueFeature = useSelector(state => state.revenue);
    const [data, setData] = useState([]);
    const [totalPayment, setTotalPayment] = useState(0);
    const [countValue, setCountValue] = useState(0);
    const [bestSellerService, setBestSellerService] = useState(null);
    const [bestValueService, setBestValueService] = useState(null);
    const [bestPrice, setBestPrice] = useState(0);
    const [bestValue, setBestValue] = useState(0);
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
            accessorKey: 'id',
            header: 'Mã hoá đơn',
            size: '1'
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
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(row.original.invoice_total_payment)}
                </Box>
            ),
        },
        {
            header: 'Ngày thanh toán',
            Cell: ({ renderedCellValue, row }) => (
                <Box className={row.original.invoice_payment_date ? "flex items-center gap-4" : "text-red-700 font-bold"}>
                    {row.original.invoice_payment_date ? new Date(row.original.invoice_payment_date).toLocaleString() : "Chưa thanh toán"}
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
        if (revenueFeature.currentIndex === 2) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/invoice/getRevenueInvoiceHaveService?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setData(response.data.result);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Invoice:" + error.response.data.error_code);
            })
            axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceRevenue?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setCountValue(response.data.result.countValue);
                setTotalPayment(response.data.result.sumPayment);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Service details:" + error.response.data.error_code);
            })
            axios.get(process.env.REACT_APP_BACKEND + 'api/servicedetail/getServiceDetailRevenue?from=' + revenueFeature.fromDay + '&to=' + revenueFeature.toDay, {
                withCredentials: true
            }).then(function (response) {
                setBestSellerService(response.data.result.bestSellerService);
                setBestValueService(response.data.result.bestValueService);
            }).catch(function (error) {
                if (error.response)
                    toast.error("Service details:" + error.response.data.error_code);
            })
        } else {
            setData([]);
            setCountValue(0);
            setTotalPayment(0);
            setBestSellerService(null);
            setBestValueService(null);
        }
    }, [revenueFeature.fromDay, revenueFeature.toDay, revenueFeature.currentIndex])

    useEffect(() => {
        if (bestSellerService && bestSellerService.Service_details) {
            let price = 0;
            bestSellerService.Service_details.forEach(element => {
                price += parseInt(element.total_price);
            });
            setBestPrice(price);
        } else {
            setBestPrice(0);
        }
    }, [bestSellerService])

    useEffect(() => {
        if (bestValueService && bestValueService.Service_details) {
            let value = 0;
            bestValueService.Service_details.forEach(element => {
                value += parseInt(element.service_quantity);
            });
            setBestValue(value);
        } else {
            setBestValue(0);
        }
    }, [bestValueService])

    return (
        <div >
            <div className="font-bold text-blue-700 text-center">
                THỐNG KÊ TỔNG HỢP DOANH THU DỊCH VỤ<br />
                <small>Từ {revenueFeature.fromDay} đến {revenueFeature.toDay}</small>
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
            <hr />
            <p className="font-semibold text-blue-700">Dữ liệu doanh thu</p>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng doanh thu dịch vụ:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {totalPayment>0?Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(totalPayment):""}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Tổng số lượng dịch vụ được sử dụng:
                </div>
                <div className="col-span-3 text-start font-semibold">
                    {countValue}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Dịch vụ doanh thu cao:
                </div>
                <div className="text-start font-semibold">
                    {bestSellerService ? bestSellerService.service_name : ""}
                </div>
                <div className="text-center" hidden={bestPrice === 0}>
                    với tổng doanh thu là:
                </div>
                <div className="text-start font-semibold" hidden={bestPrice === 0}>
                    {Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(bestPrice)}
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="text-start">
                    Dịch vụ được sử dụng nhiều:
                </div>
                <div className=" text-start font-semibold">
                    {bestValueService ? bestValueService.service_name : ""}
                </div>
                <div className="text-center" hidden={bestValue === 0}>
                    với tổng số lượng là:
                </div>
                <div className="text-start font-semibold" hidden={bestValue === 0}>
                    {bestValue} phần
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