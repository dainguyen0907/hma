import { Close } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";
import { Button, FloatingLabel, Label, Modal, Radio } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourseUpdateSuccess, setOpenCourseModal } from "../../redux_features/courseFeature";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

const DateTime = styled(DateTimePicker)(({ theme }) => ({
    'input:focus': {
        '--tw-ring-shadow': 'none'
    },
    'input': {
        'paddingTop': '8.5px',
        'paddingBottom': '8.5px'
    }
}))

export default function CourseModal() {

    const dispatch = useDispatch();
    const courseFeature = useSelector(state => state.course);

    const [courseName, setCourseName] = useState('');
    const [courseStartDate, setCourseStartDate] = useState(null);
    const [courseEndDate, setCourseEndDate] = useState(null);
    const [courseStatus, setCourseStatus] = useState(true);

    useEffect(() => {
        if (courseFeature.openCourseModal) {
            if (courseFeature.courseSelection) {
                const course = courseFeature.courseSelection;
                setCourseName(course.course_name);
                setCourseStartDate(dayjs(course.course_start_date));
                setCourseEndDate(dayjs(course.course_end_date));
                setCourseStatus(course.course_status);
            } else {
                setCourseName('');
                setCourseStartDate(null);
                setCourseEndDate(null);
                setCourseStatus(true);
            }
        }
    }, [courseFeature.openCourseModal, courseFeature.courseSelection])

    const onHandleSubmit = (e) => {
        e.preventDefault();
        if (courseFeature.courseSelection) {
            axios.post(process.env.REACT_APP_BACKEND + 'api/course/updateCourse', {
                id: courseFeature.courseSelection.id,
                name: courseName,
                start_date: courseStartDate,
                end_date: courseEndDate,
                status: courseStatus,
            }, { withCredentials: true })
                .then(function (reponse) {
                    toast.success('Cập nhật Khoá học thành công');
                    dispatch(setOpenCourseModal(false));
                    dispatch(setCourseUpdateSuccess());
                }).catch(function (error) {
                    if (error.response) {
                        toast.error(error.reponse.data.error_code);
                    }
                })
        } else {
            if (!courseStartDate) {
                toast.error('Chưa chọn ngày bắt đầu khoá học')
            } else if (!courseEndDate) {
                toast.error('Chưa chọn ngày kết thúc khoá học')
            } else {
                axios.post(process.env.REACT_APP_BACKEND + 'api/course/insertCourse', {
                    name: courseName,
                    start_date: courseStartDate,
                    end_date: courseEndDate,
                    status: courseStatus,
                }, { withCredentials: true })
                    .then(function (reponse) {
                        toast.success('Khởi tạo Khoá học thành công');
                        dispatch(setOpenCourseModal(false));
                        dispatch(setCourseUpdateSuccess());
                    }).catch(function (error) {
                        if (error.response) {
                            toast.error(error.reponse.data.error_code);
                        }
                    })
            }
        }
    }

    return (
        <Modal show={courseFeature.openCourseModal}>
            <Modal.Body className="relative">
                <form onSubmit={onHandleSubmit}>
                    <div className="absolute top-3 right-4">
                        <IconButton onClick={() => dispatch(setOpenCourseModal(false))}>
                            <Close />
                        </IconButton>
                    </div>
                    <div className="uppercase text-blue-700 font-bold pb-2 text-center">
                        {courseFeature.courseSelection ? "Cập nhật khoá học" : "Thêm khoá học mới"}
                    </div>
                    <div>
                        <FloatingLabel label="Tên khoá học" variant="outlined" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} autoComplete="off" required />
                        <div className="flex flex-row items-center gap-3">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <span>Từ: </span>
                                <DateTime label="Ngày bắt đầu" format="DD/MM/YYYY hh:mm A" value={courseStartDate}
                                    onChange={(value) => setCourseStartDate(value)} />
                                <span>tới</span>
                                <DateTime label="Ngày kết thúc" format="DD/MM/YYYY hh:mm A" value={courseEndDate}
                                    onChange={(value) => setCourseEndDate(value)} />
                            </LocalizationProvider>
                        </div>
                        <div className="flex flex-row mt-2 gap-5">
                            <span>Trạng thái:</span>
                            <div className="flex items-center gap-2">
                                <Radio id="status_true" name="status" checked={courseStatus} onClick={()=>setCourseStatus(true)} />
                                <Label htmlFor="status_true">Đang hoạt động</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="status_false" name="status" checked={!courseStatus} onClick={()=>setCourseStatus(false)} />
                                <Label htmlFor="status_false">Kết thúc</Label>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 flex flex-row-reverse gap-2">
                        <Button color="blue" type="submit">{courseFeature.courseSelection ? "Cập nhật" : "Thêm"}</Button>
                        <Button color="gray" onClick={() => dispatch(setOpenCourseModal(false))}>Huỷ</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}