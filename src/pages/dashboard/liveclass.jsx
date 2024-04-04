import { useEffect, useState } from "react";
import {
  Typography,
  Alert,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { MdFiberManualRecord } from "react-icons/md";
import { FaRegClock, FaFilter } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axios from "axios";
import { format } from 'date-fns';
import moment from 'moment';
import Lottie from "react-lottie";
import animateEmpty from "@/lotties/empty"
import ReactPlayer from "react-player";



export function Liveclass() {

  //LOTTIE OPTION
  const emptyContent = {
    loop: true,
    autoplay: true,
    animationData: animateEmpty,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [dataLiveClass, setDataLiveClass] = useState(undefined)
  // console.log(dataLiveClass)

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);


  const [dataModal, setDataModal] = useState(undefined)
  // console.log(dataModal)

  const [openLiveClass, setOpenLiveClass] = useState(false);
  const handleOpenLiveClass = () => setOpenLiveClass(!openLiveClass);

  //filter
  const [filter, setFilter] = useState(undefined)


  const handleTabClick = (category) => {
    setFilter(category);

  }

  // console.log(dataLiveClass)

  const getDataLiveClass = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found.');
        return null;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(`https://panel.goprestasi.com/api/live-class`, config);
      setDataLiveClass(response.data)

    } catch (error) {
      console.error('Error fetching pdf tryout:', error);
    }
  };


  const openZoom = (linkZoom) => {
    const popupWidth = 600;
    const popupHeight = 600;

    // Menghitung posisi tengah layar
    const leftPosition = (window.innerWidth - popupWidth) / 2;
    const topPosition = (window.innerHeight - popupHeight) / 2;

    const popupOptions = `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`;

    // Membuka jendela popup
    window.open(linkZoom, "zoomPopup", popupOptions);
  }


  //styling untuk tanggal berisi data
  const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    border: 2px solid currentColor;
    color:teal
  }
  .my-selected:hover:not([disabled]) { 
    border-color: teal;
    color: teal;
  }
  .my-today { 
    font-weight: bold;
    font-size: 120%; 
    color: teal;
   
  }.my-selected {
    position: relative;
  }

  .my-has-data-recording:not([disabled]):after,
  .my-has-data-streaming:not([disabled]):after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }
  
  .my-has-data-recording:not([disabled]):after {
    background-color: teal;
  }
  
  .my-has-data-streaming:not([disabled]):after {
    background-color: red;
  }
  


  .my-has-both-data:not([disabled]):after,
  .my-has-both-data:not([disabled]):before {
    content: '';
    position: absolute;
    bottom: 2px;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin: 2px 5px 2px 3px;
   
  } 
  
  .my-has-both-data:not([disabled]):after {
    background-color: teal;
  }
  
  .my-has-both-data:not([disabled]):before {
    background-color: red;
  }
  
}  
`;

  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today);

  const hasDataRecording = (day) => {
    const formattedDay = moment(day).format();
    return dataLiveClass?.category?.some((category) =>
      category.live_class.filter((item) => item.category_live_class === "recording").some((item) => moment(item.date).format() === formattedDay))
  };

  const hasDataStreaming = (day) => {
    const formattedDay = moment(day).format();
    return dataLiveClass?.category?.some((category) =>
      category.live_class.filter((item) => item.category_live_class === "streaming").some((item) => moment(item.date).format() === formattedDay))
  };


  const hasBothData = (day) => {
    return (
      hasDataRecording(day) && hasDataStreaming(day)
    );
  };

  // Properti modifiers untuk DayPicker
  const modifiers = {
    hasDataRecording,
    hasDataStreaming,
    hasBothData
  };

  useEffect(() => {
    getDataLiveClass()
  }, [])

  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-12">
      <div className="col-span-4">
        <Card className="mb-3">

          <div className="mt-6 flex gap-2 items-center -mb-8 mx-4">
            <div className=" border-2 border-solid border-teal-500 h-10 w-0 rounded-lg" />
            <h1>Filter by Date</h1>
          </div>

          <CardBody className="flex justify-center items-center">
            <style>{css}</style>
            <DayPicker captionLayout="dropdown-buttons" fromYear={2023} toYear={2045} mode="single"
              showOutsideDays
              required
              selected={selectedDay}
              onSelect={setSelectedDay}
              styles={{
                caption: { color: 'teal' }
              }}
              modifiers={modifiers}
              modifiersClassNames={{
                selected: 'my-selected',
                today: 'my-today',
                hasDataRecording: 'my-has-data-recording',
                hasDataStreaming: 'my-has-data-streaming',
                hasBothData: 'my-has-both-data',
              }}

              footer={
                <>
                  <div className="flex gap-2 items-center justify-center">
                    <div className="flex gap-2 items-center pt-3">
                      <MdFiberManualRecord color="red" /><p>Streaming</p>
                    </div>
                    <div className="flex gap-2 items-center pt-3">
                      <MdFiberManualRecord color="teal" /><p>Recording</p>
                    </div>
                  </div>
                </>
              }
            />
          </CardBody>
        </Card>
      </div>


      <div className="col-span-8 mx-2">

        <Card className=" w-full border-2 border-teal-400">

          <div className="flex justify-between items-center">
            <div className="mt-6 flex gap-2 items-center mb-4 mx-4">
              <div className=" border-2 border-solid border-teal-500 h-10 w-0 rounded-lg" />
              <h1>Pilih Rekaman atau Streaming</h1>
            </div>
            <button onClick={handleOpen} className="border border-teal-500 m-8 p-1 bg-teal-500 rounded-md">
              <FaFilter color="white" className="w-5 h-5" />
            </button>
            <Dialog open={open}>
              <DialogHeader>Filter by Category</DialogHeader>
              <DialogBody>

                {dataLiveClass && (
                  <div class="grid gap-y-4 gap-x-6 grid-cols-3 justify-self-center">
                    <Button variant="gradient" size="sm" color="teal" onClick={() => handleTabClick(null)}>Reset</Button>
                    {dataLiveClass.category.map(item => (
                      <Button key={item.id} variant="gradient" onClick={() => handleTabClick(item.name)} size="sm" color="teal">{item.name}</Button>
                    ))}
                  </div>
                )}

              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleOpen}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>


          {/* MODAL FOR VIDEO LINK */}

          <Dialog open={openLiveClass} size="xxl" className="overflow-auto">
            <DialogBody>

              <div className="flex flex-col justify-center items-center">
                <Typography className="font-bold text-xl mb-4">Video Recording & Link Zoom</Typography>
                <ReactPlayer width="70vw" height="70vh" url={dataModal?.video_link ? dataModal.video_link : null} />
                <Button variant="gradient" color="teal" className="mt-2" onClick={(()=>{openZoom(dataModal?.video_link)})}>Lihat Zoom</Button>
              </div>


            </DialogBody>
            <DialogFooter>
                <Button variant="gradient" color="green" onClick={handleOpenLiveClass}>
                <span>Tutup</span>
              </Button>
            </DialogFooter>
          </Dialog>




          {dataLiveClass?.category?.some((category) => {

            let filteredData = dataLiveClass.category.flatMap((categorys) =>
              categorys.live_class.filter((item) =>
                moment(item.date).format() === moment(selectedDay).format() &&
                (item.category_live_class === 'recording' || item.category_live_class === 'streaming') ||
                (item.category_name === filter)
              )
            );
            return filteredData.length > 0;
          }) ? (
            dataLiveClass?.category?.map((categorys, categoryKey) => (
              <div key={categoryKey}>
                {categorys.live_class
                  .filter((item) => moment(item.date).format() === moment(selectedDay).format() && (item.category_live_class === 'recording' || item.category_live_class === 'streaming') ||
                    (item.category_name === filter))
                  .map((liveClass, liveClassKey) => (
                    <Card key={liveClassKey} className="bg-teal-400 mx-5 mb-3">
                      <Card className="mx-1 w-full border border-teal-400">
                        <CardBody key={liveClassKey} onClick={() => { setDataModal(liveClass); setOpenLiveClass(true); setOpenLiveClass(true) }}>
                          <div className="grid grid-cols-1 md:flex md:justify-between items-center">
                            <div>
                              <Typography color="gray" className="mb-2 font-bold">
                                {liveClass.title}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-1 order-first md:order-last mb-4 md:mb-0">
                              <MdFiberManualRecord color={liveClass.category_live_class === "recording" ? "teal" : "red"} />
                              <Typography color="gray" className={liveClass.category_live_class === "recording" ? "font-bold border-2 border-teal-400 rounded-md px-1 text-teal-400" : "font-bold border-2 border-red-400 rounded-md px-1 text-red-400"}>
                                {liveClass.category_live_class}
                              </Typography>
                            </div>
                          </div>
                          <Typography>
                            Instructor by:
                          </Typography>
                          <div className="grid grid-cols-1 md:grid-cols-12">
                            <div className="mt-3 col-span-5">
                              <Typography className="text-cyan-800 ">
                                {liveClass.teacher}
                              </Typography>
                            </div>
                            <div className="col-span-3 flex text-left justify-start  md:text-center md:justify-center items-center pt-3 gap-2 ">
                              <FaRegClock color="teal" className="w-5 h-5" />
                              <Typography className="text-sm">
                                {`${liveClass.start_time} - ${liveClass.end_time}`}
                              </Typography>
                            </div>
                            <div className="col-span-4  justify-start md:justify-end flex items-center pt-3 gap-2">
                              <FaCalendarDays color="teal" className="w-5 h-4" />
                              <Typography className="text-sm">
                                {moment(liveClass.date).format('LL')}
                              </Typography>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Card>
                  ))}
              </div>
            ))
          ) : (
            <div>
              {dataLiveClass?.category?.map((categorys, categoryKey) => (
                <div key={categoryKey}>
                  {categorys.live_class.map((liveClass, liveClassKey) => (
                    <Card key={liveClassKey} className="bg-teal-400 mx-5 mb-3">
                      <Card className="mx-1 w-full border border-teal-400" >
                        <CardBody key={liveClassKey} onClick={() => { setDataModal(liveClass); setOpenLiveClass(true) }}>
                          <div className="grid grid-cols-1 md:flex md:justify-between items-center">
                            <div>
                              <Typography color="gray" className="mb-2 font-bold">
                                {liveClass.title}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-1 order-first md:order-last mb-4 md:mb-0">
                              <MdFiberManualRecord color={liveClass.category_live_class === "recording" ? "teal" : "red"} />
                              <Typography color="gray" className={liveClass.category_live_class === "recording" ? "font-bold border-2 border-teal-400 rounded-md px-1 text-teal-400" : "font-bold border-2 border-red-400 rounded-md px-1 text-red-400"}>
                                {liveClass.category_live_class}
                              </Typography>
                            </div>
                          </div>
                          <Typography>
                            Instructor by:
                          </Typography>
                          <div className="grid grid-cols-1 md:grid-cols-12">
                            <div className="mt-3 col-span-5">
                              <Typography className="text-cyan-800 ">
                                {liveClass.teacher}
                              </Typography>
                            </div>
                            <div className="col-span-3 flex text-left justify-start  md:text-center md:justify-center items-center pt-3 gap-2 ">
                              <FaRegClock color="teal" className="w-5 h-5" />
                              <Typography className="text-sm">
                                {`${liveClass.start_time} - ${liveClass.end_time}`}
                              </Typography>
                            </div>
                            <div className="col-span-4  justify-start md:justify-end flex items-center pt-3 gap-2">
                              <FaCalendarDays color="teal" className="w-5 h-4" />
                              <Typography className="text-sm">
                                {moment(liveClass.date).format('LL')}
                              </Typography>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )
          }




        </Card>
      </div>


    </div>

  )
}

export default Liveclass;
