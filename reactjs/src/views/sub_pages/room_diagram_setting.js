
import FloorComponent from "../../components/customize_components/floor_component";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ChangeFloorNameModal from "../../components/modal/floor_change_name_modal";
import InsertRoomModal from "../../components/modal/floor_insert_room_modal";
import SelectAreaModal from "../../components/modal/floor_select_area_modal";
import { setOpenModalMultiCheckOut, setOpenModalSelectArea } from "../../redux_features/floorFeature";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import UpdateRoomModal from "../../components/modal/floor_update_room_modal";
import CheckInModal from "../../components/modal/checkin_modal";
import CheckoutModal from "../../components/modal/checkout_modal";
import ChangeRoomModal from "../../components/modal/change_room_modal";
import SinglePayment from "../../components/modal/single_payment_modal";
import MultiCheckoutModal from "../../components/modal/multi_checkout_modal";
import { setOpenLoadingScreen } from "../../redux_features/baseFeature";



export default function RoomDiagramSetting() {
    const dispatch = useDispatch();
    const floorFeature = useSelector(state => state.floor);
    const [floor, setFloor] = useState([]);
    const [blankRoom, setBlankRoom] = useState(0);
    const [usedRoom, setUsedRoom] = useState(0);
    const [manitainceRoom, setMaintainceRoom] = useState(0);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'api/floor/getFloorByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setFloor(response.data.result);
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Dữ liệu bảng: "+error.response.data.error_code);
                }
            })
    }, [floorFeature.areaID, floorFeature.floorUpdateSuccess])

    useEffect(() => {
        dispatch(setOpenLoadingScreen(true));
        axios.get(process.env.REACT_APP_BACKEND + 'api/room/countRoomByIDArea?id=' + floorFeature.areaID, { withCredentials: true })
            .then(function (response) {
                setBlankRoom(response.data.result.blankRoom);
                setUsedRoom(response.data.result.fullRoom);
                setMaintainceRoom(response.data.result.maintainceRoom);
                dispatch(setOpenLoadingScreen(false));
            }).catch(function (error) {
                if (error.response) {
                    toast.error("Đếm số lượng phòng: "+error.response.data.error_code);
                }
                dispatch(setOpenLoadingScreen(false));
            })
    }, [floorFeature.roomUpdateSuccess, floorFeature.areaID, dispatch])

    return (
        <div className="w-full h-full overflow-auto p-2">
            <div className="border-2 rounded-xl w-full h-full">
                <div className="px-3 py-1 grid grid-cols-3 lg:h-[5%] h-fit">
                    <div>
                        <Button outline size="xs" gradientDuoTone="purpleToBlue" disabled={floorFeature.areaID === -1}
                            onClick={() => dispatch(setOpenModalMultiCheckOut(true))} className="lg:uppercase">
                            Tính hoá đơn gộp
                        </Button>
                    </div>
                    <div className=" justify-center flex">
                        <Button outline gradientDuoTone="cyanToBlue" size="xs" className="lg:uppercase"
                            onClick={(e) => dispatch(setOpenModalSelectArea(true))}>
                            {floorFeature.areaName}
                        </Button>
                    </div>
                </div>
                <div className=" border-b-2 lg:h-[5%] h-fit text-sm text-center font-bold gap-4 flex flex-row p-2">
                    <div className="flex flex-row">
                        <div className="w-6 h-fit px-1 bg-green-300 "><span className="font-normal">{blankRoom}</span></div>
                        <div className="">
                            Phòng còn giường,&nbsp;
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-6 h-fit px-1 bg-red-300"><span className="font-normal">{usedRoom}</span></div>
                        <div className="">
                            Phòng đầy,&nbsp;
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-6 h-fit px-1 bg-gray-300"><span className="font-normal">{manitainceRoom}</span></div>
                        <div className="">
                            Phòng đang sửa
                        </div>
                    </div>


                </div>
                <div className="w-full lg:h-[90%] h-[85%] block overflow-y-scroll">
                    <div className="w-full h-1/4 ">
                        {floor.map((value, key) => <FloorComponent key={key} floorID={value.id} floorName={value.floor_name} />)}
                    </div>
                    <ChangeFloorNameModal />
                    <InsertRoomModal />
                    <SelectAreaModal />
                    <UpdateRoomModal />
                    <CheckInModal />
                    <CheckoutModal />
                    <ChangeRoomModal />
                    <SinglePayment />
                    <MultiCheckoutModal />
                </div>
            </div>
        </div>
    );
}