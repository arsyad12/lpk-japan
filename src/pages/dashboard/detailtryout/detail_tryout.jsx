import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Spinner,
  Select,
  Option,
  Checkbox,
  ListItem,
  ListItemPrefix,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";


import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { MdOutlineAccessAlarms } from "react-icons/md";
import { SettingUserData } from "@/data";
import axios from "axios";

import detailTO, * as detailToSlices from "../../../slices/detailTryout";
import { useSelector, useDispatch } from "react-redux";

export function DetailTryout() {
  //nah disini kita definiskan variabel state untuk ngambil object dari halaman slice/movie.js
  const state = useSelector((state) => state);
  //cek bentuk nilai object yang di kembalikan state
  //  console.log(state);

  //kalau state udah ada isinya
  //destrukturing state dari movie agar bisa dpake data nya
  const slug = useParams();


  const [dataDetailTO, setDataDetailTO] = React.useState(undefined)
  console.log("ini detail",dataDetailTO)

  const {
    detailTO: { resultDT },
  } = state;

  // console.log(resultDT)

  //filter agar mengambil data sesuai id ujian
  const filteredData = Object.keys(resultDT)
    .filter(key => key === slug.id)
    .reduce((obj, key) => {
      obj[key] = resultDT[key];
      return obj;
    }, {});

  // console.log(filteredData);



  // abis itu kita definisikan dispatch buat distribusi semua data ke komponen lain
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const [dataUniv, setDataUniv] = React.useState(null);

  // console.log(dataUniv)

  const [idUniv, setIdUniv] = React.useState(null);

  // console.log(idUniv)

  const [idMajor, setIdMajor] = React.useState(null);

  // console.log(idMajor)

  const [dataMajor, setDataMajor] = React.useState(null);

  // console.log(dataMajor)

  const [idUser, setIdUser] = React.useState(null);

  // console.log(idUser)

  const [dataUser, setDataUser] = React.useState(undefined)

  console.log(dataUser)

  const [userUniv, setUserUniv] = useState(null)
  const [userMajor, setUserMajor] = useState(null)

  //modal for open change univ & jurusan
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

  //modal for alert if university or major null

  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => setOpenAlert(!openAlert);

  const [loadingButton, setLoadingButton] = useState(false);

//check last is finished grade value/////////////////////////////////////////
  const lessonCategories = dataDetailTO?.detail_tryout?.lesson_category;
  const lastLessonCategory = lessonCategories?.[lessonCategories.length - 1];

  const exams = lastLessonCategory?.exam;
  const lastExam = exams?.[exams.length - 1];

  const isFinished = lastExam?.grade?.[0]?.is_finished;
/////////////////////////////////////////////////////////////////////////////

  const responseHandler = async () => {

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


      const response = await axios.get(`http://103.127.133.56/api/detail-tryout/${slug.id}`, config);

      setDataDetailTO(response.data)
      dispatch(detailToSlices.setResultDT({
        //jadi kita set state nya dengan ngirim nama movie dari data parameter slug
        idDetailTO: slug.id,
        //dan buat set state data nya pake data dari API 
        data: response.data
      }))

      const getUniv = await axios.get(`http://103.127.133.56/api/universities`)
      setDataUniv(getUniv.data.universities)

      const getDetailUser = await axios.get(`http://103.127.133.56/api/setting`, config);
      setUserUniv(getDetailUser.data.user.student.university?.name)
      setUserMajor(getDetailUser.data.user.student.major?.name)

        setLoading(false);
   

      // return response.data; 
    } catch (error) {

      console.error('Error fetching detail tryout:', error);

    }
  };

  const fetchDataUser = async () => {

    try {
      const data = await SettingUserData();
      setIdUser(data?.user?.id);
      setDataUser(data)
    } catch (error) {

      console.error('Error setting user data:', error);
    }
  };

  useEffect(() => {
    responseHandler();
    fetchDataUser();
  }, [openAlert]);


  const getDataMajorbyId = async (selectedId) => {
    const response = await axios.get(`http://103.127.133.56/api/universities/${selectedId}`)
    setDataMajor(response.data.universities.majors)

  }

  const handleSelectChangeUniv = (selectedOption) => {
    const selectedId = selectedOption;
    setIdUniv(selectedId)
    getDataMajorbyId(selectedId);
  };

  const handleSelectChangeMajor = (selectedOption) => {
    const selectedId = selectedOption;
    setIdMajor(selectedId)
  };


  const updateUnivMajor = async () => {

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found.');
        return null;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(`http://103.127.133.56/api/setting/university/${idUser}`, {
        "university_id": idUniv,
        "major_id": idMajor
      }, config)

      console.log(response)
    } catch (error) {
      console.error('Error submit exam:', error);
    }
  }

  const resetHandler = async () => {

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found.');
        return null;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(`http://103.127.133.56/api/exam-group-start/${slug.id}?repeat=1`, config)
      responseHandler() //ini woooyy
      // console.log(response)
    } catch (error) {
      console.error('reset exam failed:', error);
    }
  }


  const resetState = () => {
    responseHandler();
    setUserUniv(null)
    setUserMajor(null)
  };

  // console.log(dataDetailTO?.detail_tryout.lesson_category[dataDetailTO?.detail_tryout.lesson_category.length-1].exam[?lesson_categor?y[dataDetailTO?.detail_tryout.lesson_category.length-1].exam.length-1].grade[0].is_finished)
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div className="mb-12 flex justify-center h-96">
      <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
        <Spinner className="h-16 w-16 text-gray-900/50" />
      </div>
    </div>;
  }



  return (
    <>


      <Card className="mt-6 bg-orange-400 w-full">
          <Card className="mx-1 w-full">
          <CardBody>
            <Button className="bg-orange-400 flex items-center justify-start" onClick={(() => { navigate("/") })}> <ChevronLeftIcon strokeWidth={3} className="h-5 w-5" color="white" /> Kembali</Button>

            <Typography variant="h5" color="blue-gray" className="mb-2 mt-8 items-center justify-center text-center">
              Detail Tryout
            </Typography>

            <Typography className="items-center justify-center text-center">
              {dataDetailTO?.detail_tryout?.title}
            </Typography>

            {dataDetailTO?.detail_tryout?.access_type === "Free" ? (
              <Typography className="items-center justify-center text-center text-red-700 font-bold">
                <p>FREE TRYOUT</p>
              </Typography>
            ) : (
              <Typography className="items-center justify-center text-center text-red-700 font-bold">
                <p>PREMIUM TRYOUT</p>
              </Typography>
            )}
            <hr className=" h-1 my-6 bg-gray-500 border-0 rounded dark:bg-gray-700" />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1 items-center">
                  <MdOutlineAccessAlarms className="h-8 w-8" color="orange" />
                  <p>Total Waktu</p>
                </div>
                <div className="flex gap-1">
                  <p>{dataDetailTO?.detail_tryout?.total_duration}</p>
                  <p>Menit</p>
                </div>
              </div>

              <div className="md:flex items-center justify-center">
                <div color="orange" className="invisible md:visible">
                  <p className="text-xs md:text-5xl md:pt-6">|</p>
                  <hr className=" visible md:invisible h-1 bg-gray-500 border-0 rounded dark:bg-gray-700 mb-6" />
                </div>
              </div>

              <div className="flex items-center justify-between md:pt-2">
                <div className="flex gap-1 items-center">
                  <img src="/img/TL.svg" alt="" srcset="" />
                  <p>Total Soal</p>
                </div>
                <div className="flex gap-1">
                  <p>{dataDetailTO?.detail_tryout?.total_question}</p>
                  <p>Soal</p>
                </div>
              </div>

            </div>
          </CardBody>
        </Card>
      </Card>


      <Card className="mt-6 bg-orange-400 w-full">
        <Card className="mx-1 w-full">

          {dataDetailTO?.detail_tryout?.exam.map((category, categoryKey) => (
            <div key={categoryKey}>
              <ListItem>
                <label
                  htmlFor={`vertical-list-react-category-${categoryKey}`}
                  className="w-full cursor-pointer items-center px-6 py-2 mr-6"
                >
             
               
                      <div className="border-b-2 border-b-orange-500">
                        <p className="text-grey-400 text-base pb-2 font-bold text-orange-700">
                          {category.lesson.name}
                        </p>
                      </div>
               
                </label>
              </ListItem>

              {/* {category.exam.map((item, examKey) => (
                <ListItem className="p-0 mb-4" key={examKey}>
                  <label
                    htmlFor={`vertical-list-react-exam-${examKey}`}
                    className="w-full cursor-pointer items-center px-6 py-2 mr-6"
                  >
                    <div className="grid-cols-1 md:flex justify-between gap-4 mx-3">
                      <div className="grid grid-cols-12 md:flex mb-5 md:mb-0">
                        <ListItemPrefix className="mr-3 col-span-3">

                          {item.grade === null || item.grade[0].is_finished === 0 ? (
                            <Checkbox
                              color="orange"
                              disabled
                              id="vertical-list-react"
                              ripple={false}
                              className="hover:before:opacity-0"
                              containerProps={{
                                className: "p-0",
                              }}
                            />
                          ) : (
                            <Checkbox
                              defaultChecked
                              color="orange"
                              disabled
                              id="vertical-list-react"
                              ripple={false}
                              className="hover:before:opacity-0"
                              containerProps={{
                                className: "p-0",
                              }}
                            />
                          )}
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="text-xs md:text-sm pt-1 font-medium col-span-9 line-clamp-1">
                          {item.lesson.name}
                        </Typography>
                      </div>
                      <div className="flex gap-4 items-center justify-center mr-4 text-xs md:text-sm">
                        <img className="" src="/img/TL.svg" alt="" srcset="" />
                        <p className="">{item.total_question} Soal</p>
                        <p className="">|</p>
                        <p className="">{item.duration} Menit</p>
                      </div>
                    </div>
                    <hr className=" bg-orange-500 mt-2 dark:bg-orange-500" />
                  </label>
                </ListItem>
              ))} */}
            </div>
          ))}

        </Card>
      </Card>


      <Card className="mt-6 bg-orange-400 w-full">
        <Card className="mx-1 w-full">
          <div className="flex justify-center items-center m-10 gap-8">

            {dataDetailTO?.detail_tryout?.exam[0]?.grade === null || isFinished === 0 ? (
              <>

               

                <Button className="bg-orange-400 flex items-center justify-center w-80 md:w-64 h-10 text-xs" onClick={(() => {
                  
                      navigate(`/dashboard/exam/${slug.id}`)
                
                })}>{
                      dataDetailTO?.detail_tryout?.exam[0]?.grade === null ||
                      dataDetailTO?.detail_tryout?.lesson_category?.length === 0 ||
                      dataDetailTO?.detail_tryout?.exam[0]?.grade[0]?.is_finished === 0 ?
                      <>
                        <span>Mulai Ujian </span> {loadingButton ? (<Spinner className="mx-3 h-6 w-6" color="amber" />) : null}
                      </>
                      :
                      <>
                        <span>Lanjutkan Ujian </span> {loadingButton ? (<Spinner className="mx-3 h-6 w-6" color="amber" />) : null}
                      </>
                  }
                </Button>
              </>
            ) :
              <>
                <Button className="bg-orange-400 flex items-center justify-center w-80 md:w-64 h-10 text-xs" onClick={(() => {
                  navigate(`/dashboard/hasilTryout/${slug.id}`)
                })}>Lihat Hasil TO</Button>

                <Button className="bg-orange-400 flex items-center justify-center w-80 md:w-64 h-10 text-xs" onClick={(() => {
                  responseHandler()
                  resetHandler()
                  setLoadingButton(true)
                  setTimeout(() => {
                    navigate(`/dashboard/exam/${slug.id}`)
                  }, 1000);
                })}>Ulangi Ujian {loadingButton ? (<Spinner className="mx-3 h-6 w-6" color="amber" />) : null}</Button>
              </>
            }
          </div>
        </Card>
      </Card>
    </>
  );
}

export default DetailTryout;
