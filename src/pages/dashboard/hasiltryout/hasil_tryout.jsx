import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  Input,
  Typography,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";


import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { SettingUserData } from "@/data";
import { FaCrown } from "react-icons/fa";
import { SiAdobeacrobatreader } from "react-icons/si";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

//pdf

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { zoomPlugin} from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

export function HasilTryout() {

  const slug = useParams();

  //nah disini kita definiskan variabel state untuk ngambil object dari halaman slice/movie.js
  const state = useSelector((state) => state);
  //cek bentuk nilai object yang di kembalikan state
  //  console.log(state);

  //kalau state udah ada isinya
  //destrukturing state dari movie agar bisa dpake data nya
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

  // console.log(filteredData)

  const navigate = useNavigate()


  const [dataHasilTO, setDataHasilTO] = React.useState(undefined)
  const [dataLeaderBoard, setDataLeaderBoard] = React.useState(undefined)
  const [totalGrade, setTotalGrade] = React.useState(undefined)
  const [passGrade, setPassGrade] = React.useState(undefined)
  const [currentPage, setCurrentPage] = React.useState(0)
  // console.log(dataHasilTO)
  // console.log(dataLeaderBoard)
  const [pdf, setPdf] = React.useState(undefined)
  // console.log(pdf)
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const getNext = () => {
    setCurrentPage(currentPage + 1)
  }
  const getPrev = () => {
    setCurrentPage(currentPage - 1)
  }

  const getResultTO = async () => {
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

      const leaderBoard = await axios.get(`https://panel.goprestasi.com/api/tryout-leaderboard/${filteredData[slug.id].detail_tryout.id}?page=${currentPage}`, config);
      const hasilTo = await axios.get(`https://panel.goprestasi.com/api/tryout/${filteredData[slug.id].exam_group_user_id}/result/${slug.id}`, config);
      // console.log(leaderBoard)
      console.log(hasilTo)
      setCurrentPage(leaderBoard.data.pagination.current_page)
      setPassGrade(hasilTo?.data?.passing_grade[0]?.grade)
      setTotalGrade(hasilTo?.data?.summary?.total_grade)
      setDataLeaderBoard(leaderBoard.data)
      setDataHasilTO(hasilTo.data)
      setLoading(false)

    } catch (error) {
      console.error('Error get Hasil TO:', error);
    }
  }


  const handleClickDiscussion = (itemId, gradeValue, examGroupId) => {
    navigate(`/dashboard/review/${itemId}`, { state: { gradeValue,examGroupId } });
  }

  const getDataPdf = async (gradeId) => {
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

      const getPdf = await axios.get(`https://panel.goprestasi.com/api/tryout-pdf/${gradeId}`, config);
      setPdf(`${getPdf.request.responseURL}`)
      // const urlParams = new URLSearchParams(window.location.search);
      // setPdf(urlParams.get(`${getPdf.request.responseURL}`) || 'PDF_Succinctly.pdf');
      // window.location.replace(`${getPdf.request.responseURL}`)

    } catch (error) {
      console.error('Error fetching pdf tryout:', error);
    }
  };


  useEffect(() => {
    getResultTO()

  }, [currentPage]);

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


      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-4 mt-4">

          <Card className="w-full">
            <CardBody className=" flex-col items-center justify-center">

              <div className="mb-3 flex gap-2 items-center">
                <div className=" border-2 border-solid border-teal-500 h-10 w-0 rounded-lg" />
                <h1>Hasil Tryout</h1>
              </div>

              <div className="bg-cyan-700  w-full mb-2 rounded">
                <div className="grid grid-cols-12 h-full ">

                  <div className="col-span-6 text-white m-3 text-xs">
                    <p>{dataHasilTO?.summary?.exam_group?.title}</p>
                    <div className="grid grid-cols-2 mt-2">
                      <div>
                        <p>Benar</p>
                      </div>
                      <div>
                        <p>:  {dataHasilTO?.summary?.total_correct}/{dataHasilTO?.summary?.exam_group?.total_question}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 mt-2">
                      <div>
                        <p>Peringkat</p>
                      </div>
                      <div>
                        <p>:  {dataHasilTO?.summary?.ranking}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6  flex items-center justify-center ">
                    <Card className="bg-cyan-400 mt-3 mb-3">
                      <CardBody className="text-center text-white" >
                        <h1 className="text-3xl">{dataHasilTO?.summary?.total_grade}</h1>
                        <p className="text-xs">Nilai Rata Rata</p>
                      </CardBody>
                    </Card>
                  </div>

                </div>
              </div>

              <div className="mt-6 mb-3 flex gap-2 items-center">
                <div className=" border-2 border-solid border-teal-500 h-10 w-0 rounded-lg" />
                <h1>Detail Hasil Tryout</h1>
              </div>

              <div className="detailresultTO">
                {dataHasilTO?.summary?.exam_group?.lesson_category.map((category, categoryKey) => (
                  <div key={categoryKey}>
                    <div className="mt-6">
                      <Button className="w-full bg-cyan-700">
                        {category.name.filter}
                      </Button>
                    </div>
                    {category.grade.map((item) => (
                      <>
                        <div className="mt-4">
                          <p className="text-sm">{item.lesson.name}</p>
                        </div>

                        <div className="grid grid-cols-12">
                          <div className="col-span-6 mt-2">
                            {dataHasilTO?.passing_grade?.map((passGrade, passGradeKey) => (
                              <p key={passGradeKey} className="text-sm text-red-500 mt-2 mb-2">Ambang Batas : {passGrade.grade} </p>
                            ))}

                            <button className="border border-cyan-700 p-1 bg-cyan-700 text-white rounded-md text-xs flex gap-1 items-center justify-center w-full h-8 mb-1"
                              onClick={() => handleClickDiscussion(item.id, item.grade, dataHasilTO?.summary?.exam_group_id)}
                            ><AiOutlinePlaySquare /><p>Lihat Pembahasan</p></button>

                            <button className="border border-cyan-700 p-1 bg-cyan-700 text-white rounded-md text-xs flex gap-1 items-center justify-center  w-full h-8"
                              onClick={(() => {
                                getDataPdf(item.id); handleOpen()

                              })}
                            // getDataPdf(item.id)
                            ><SiAdobeacrobatreader /><p>Lihat Dokumen PDF</p></button>

                            <Dialog open={open} size="xxl" className="overflow-auto">

                              <DialogBody>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                  <div className="flex items-center border-b-2 border-solid bg-teal-400 justify-center gap-4">
                                    <ZoomOutButton />
                                    <ZoomPopover />
                                    <ZoomInButton />
                                  </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Viewer fileUrl={pdf ? pdf : "Unable to load"} plugins={[zoomPluginInstance]} />
                                  </div>
                                </Worker>
                              </DialogBody>
                              <DialogFooter>
                                <Button variant="gradient" color="green" onClick={handleOpen}>
                                  <span>Tutup</span>
                                </Button>
                              </DialogFooter>
                            </Dialog>

                          </div>
                          <div className="col-span-6  flex items-center justify-center h-full mt-2 mx-1 ">

                            <Card className={item?.description === "TIDAK LULUS" ? "bg-orange-400" : "bg-lightemerald"}>
                              <CardBody className="text-center text-gray-900 w-full" >
                                <div className="flex gap-1 text-center justify-center">
                                  <h1 className="text-sm font-bold">{item?.grade}</h1>
                                  <p className="text-sm">({item?.grade * 100 / 1000}%)</p>
                                </div>
                                <p className="text-xs">{item?.description}</p>
                                <p className="text-xs">Ambang Batas</p>
                              </CardBody>
                            </Card>
                          </div>
                        </div>
                        <hr className="mt-4 border-1 border-teal-400" />
                      </>
                    ))}
                  </div>
                ))}

                <div className="bg-amber-500 mt-2 flex flex-col items-center justify-center rounded-md">

                  <Card className={totalGrade < passGrade ?? undefined ? "bg-red-400 w-1/2 m-4" : "bg-cyan-700 w-1/2 m-4"}>
                    <CardBody className="flex flex-col items-center text-center text-white w-full justify-center" >

                      <div className="flex gap-1">
                        <h1 className="text-lg font-bold">{dataHasilTO?.summary?.total_grade}</h1>
                        <p className="text-lg">({dataHasilTO?.summary?.total_grade * 100 / 1000})%</p>
                      </div>
                      <div className="">
                        <p className="text-xs">{totalGrade < passGrade ? "TIDAK LULUS" : "LULUS"}</p>
                        <p className="text-xs">Ambang Batas</p>
                      </div>

                    </CardBody>
                  </Card>
                  <div>

                    <div>{totalGrade < passGrade ? (

                      <div className="m-3 text-gray-900">
                        <p className="mb-4 text-sm">Maaf Anda dinyatakan <span className="bg-red-600 text-md p-1 text-white">TIDAK LULUS</span> karena beberapa pelajaran masih dibawah ambang batas, pelajari lagi list pelajaran dibawah ini ya</p>
                        {dataHasilTO?.summary?.exam_group?.lesson_category.map((category, categoryKey) => (
                          <div key={categoryKey}>
                            {category?.grade?.filter((item) => item?.description.includes("TIDAK LULUS")).map((item, key) => (
                              <li className="text-sm" key={key}>{item.lesson.name}</li>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                      :
                      <p className="m-4 text-gray-900"> Selamat, Anda dinyatakan <span className="bg-cyan-700 text-white  text-lg p-1">LULUS</span>, Tryout</p>}
                    </div>

                  </div>

                </div>

              </div >

            </CardBody>
          </Card>

        </div>

        <div className="col-span-8 mt-4 mx-2">

          <Card className="w-full">
            <div className="flex gap-2 items-center mx-5 mt-5">
              <div className=" border-2 border-solid border-teal-500 h-10 w-0 rounded-lg" />
              <h1>Leaderboard</h1>
            </div>
            <CardBody className="overflow-x-scroll px-0 mx-4 mr-4">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>

                    <th className="border-y border-teal-600 bg-teal-600 p-4 text-center">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal leading-none"
                      >

                      </Typography>
                    </th>

                    <th className="border-y border-teal-600 bg-teal-600 p-2 text-center w-5">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal leading-none"
                      >
                        Rank
                      </Typography>
                    </th>

                    <th className="border-y border-teal-600 bg-teal-600 p-4">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal leading-none"
                      >
                        Nama
                      </Typography>
                    </th>

                    <th className="border-y border-teal-600 bg-teal-600 p-2 ">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal leading-none"
                      >
                        Sekolah
                      </Typography>
                    </th>


                    <th className="border-y border-teal-600 bg-teal-600 p-2 text-center">
                      <Typography
                        variant="small"
                        color="white"
                        className="font-normal leading-none"
                      >
                        Nilai
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody className="mt-4">
                  {dataLeaderBoard?.leaderboard?.map((item, key) => (
                    <tr className={item.user.name === dataLeaderBoard.user_details.user_name ? "bg-teal-300 " : null}>

                      <td className="w-5">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className=" flex justify-end"
                        >
                          {item.ranking === 1 ? (<FaCrown color="orange" />)
                            : item.ranking === 2 ? (<FaCrown color="orange" />)
                              : item.ranking === 3 ? (<FaCrown color="orange" />)
                                : null}
                        </Typography>

                      </td>

                      <td key={key} className="flex items-center gap-1 justify-center" >

                        <Typography

                          variant="small"
                          color="blue-gray"
                          className="font-normal text-center p-2"
                        >
                          {item.ranking}
                        </Typography>

                      </td>



                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mx-2 p-2"
                        >
                          {item.user.name}
                        </Typography>

                      </td>

                      <td >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.user.student.origin_of_school}
                        </Typography>
                      </td>

                      <td >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-center"
                        >
                          {item.total_grade}
                        </Typography>
                      </td>

                    </tr>
                  ))}
                  {dataLeaderBoard?.user_details?.ranking > 10 ? (
                    <tr className="bg-teal-400">

                      <td className="w-5">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className=" flex justify-end"
                        >

                        </Typography>

                      </td>

                      <td className="flex items-center gap-1 justify-center" >

                        <Typography

                          variant="small"
                          color="blue-gray"
                          className="font-normal text-center p-2"
                        >
                          {dataLeaderBoard.user_details.ranking}
                        </Typography>

                      </td>

                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal mx-2 p-2"
                        >
                          {dataLeaderBoard.user_details.user_name}
                        </Typography>

                      </td>

                      <td >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {dataLeaderBoard.leaderboard[0].user.student.origin_of_school}
                        </Typography>
                      </td>

                      <td >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-center"
                        >
                          {dataLeaderBoard.user_details.total_grade}
                        </Typography>
                      </td>

                    </tr>
                  ) : null}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-2">
              <Typography variant="small" color="blue-gray" className="font-normal">

                <p>{dataLeaderBoard?.pagination?.current_page} / {dataLeaderBoard?.pagination?.total_pages}</p>

              </Typography>
              <div className="flex gap-2">
                <Button variant="outlined" size="sm" disabled={currentPage === 1}
                  onClick={(() => {
                    getPrev()

                  })}>
                  Previous
                </Button>
                <Button variant="outlined" size="sm" disabled={currentPage === dataLeaderBoard?.pagination?.total_pages}
                  onClick={(() => {
                    getNext()

                  })}>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

        </div>

      </div >



    </>
  );
}

export default HasilTryout;
