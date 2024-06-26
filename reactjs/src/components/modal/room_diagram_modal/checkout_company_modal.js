import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalCheckOutCompany } from "../../../redux_features/floorFeature";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";

export default function CheckoutCompanyModal() {

    const floorFeature = useSelector(state => state.floor);
    const dispatch = useDispatch();

    const [courseList, setCourseList] = useState([]);
    const [idCourse, setIDCourse] = useState(-1);

    const [countUpdateSuccess,setCountUpdateSuccess]=useState(0);

    const [rowSelection,setRowSelection]=useState([]);
    const [dataTable, setDataTable] = useState([]);

    const [isProcessing,setIsProcessing]=useState(false);
    const columns = useMemo(() => [
        {
            accessorKey: 'company_name',
            header: 'Tên công ty',
        }, {
            header: 'Số lượng khách',
            Cell: ({ table, row }) => (
                <Box>
                    {row.original.Customers ? row.original.Customers.length : '0'}
                </Box>
            )
        }
    ], [])

    useEffect(() => {
        if (floorFeature.openModalCheckOutCompany) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/course/getEnableCourse', { withCredentials: true })
                .then(function (response) {
                    setCourseList(response.data.result);
                }).catch(function (error) {
                    if(error.code=== 'ECONNABORTED'){
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    }else if(error.response){
                        toast.error('Khoá học: '+error.response.data.error_code);
                    }else{
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                })
        }
    }, [floorFeature.openModalCheckOutCompany, countUpdateSuccess])

    const onHandleSearch = (e) => {
        if (idCourse !== -1) {
            axios.get(process.env.REACT_APP_BACKEND + 'api/company/getCompanyByCourse?course='+idCourse, { withCredentials: true })
                .then(function (response) {
                    setDataTable(response.data.result);
                    console.log(response.data.result)
                }).catch(function (error) {
                    if(error.code=== 'ECONNABORTED'){
                        toast.error('Request TimeOut! Vui lòng làm mới trình duyệt và kiểm tra lại thông tin.');
                    }else if(error.response){
                        toast.error('Công ty: '+error.response.data.error_code);
                    }else{
                        toast.error('Client: Xảy ra lỗi khi xử lý thông tin!');
                    }
                })
        } else
            toast.error('Vui lòng chọn khoá học!');
    }

    const onHandleConfirm = (e) => {
        e.preventDefault();

        if(isProcessing)
            return;

        setIsProcessing(true);

        if (idCourse !== -1) {
            let idCompanyList=[];
            Object.keys(rowSelection).forEach(value=>{
                idCompanyList.push(dataTable[value].id);
            })
            axios.post(process.env.REACT_APP_BACKEND+'api/bed/checkAndUpdateCourseStatus',{
                id_course:idCourse,
                idCompanyList:idCompanyList
            },{withCredentials:true})
            .then(function(response){
                toast.success(response.data.result);
                setCountUpdateSuccess(countUpdateSuccess+1);
                setIDCourse(-1);
                setDataTable([]);
            }).catch(function(error){
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
        } else {
            toast.error('Chưa chọn khoá học!');
            setIsProcessing(false);
        }
    }

    return (
        <Modal show={floorFeature.openModalCheckOutCompany} className="relative">
            <Modal.Body>
                <div className="absolute top-3 right-4">
                    <IconButton onClick={() => dispatch(setOpenModalCheckOutCompany(false))}>
                        <Close />
                    </IconButton>
                </div>
                <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                    Trả phòng theo đơn vị
                </div>
                <form onSubmit={onHandleConfirm}>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <TextField variant="outlined" label="Khoá học" size="small" select value={idCourse} sx={{ width: '40%' }}
                                onChange={(e) => setIDCourse(e.target.value)}>
                                <MenuItem value={-1} disabled>--Không--</MenuItem>
                                {courseList.map((value, index) => <MenuItem value={value.id} key={index}>{value.course_name}</MenuItem>)}
                            </TextField>
                            <Button color="primary" variant="contained" disabled={idCourse === -1} onClick={onHandleSearch}>
                                <Search />
                            </Button>
                        </div>
                        <div className="w-full h-40 overflow-auto">
                            <MaterialReactTable
                                data={dataTable}
                                columns={columns}
                                localization={MRT_Localization_VI}
                                enableTopToolbar={false}
                                enableBottomToolbar={false}
                                enableRowSelection
                                onRowSelectionChange={setRowSelection}
                                state={{rowSelection}}
                            />
                        </div>
                        <Button type="submit" color="primary" variant="contained" disabled={idCourse===-1}>Trả phòng</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}