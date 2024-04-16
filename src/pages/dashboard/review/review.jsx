import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  DialogFooter,
} from "@material-tailwind/react";

import parse from 'html-react-parser';
import striptags from "striptags";

import axios from "axios";

import ReactPlayer from 'react-player/lazy'

import { useSelector, useDispatch } from "react-redux";

import { IoMdPlay } from "react-icons/io";

export function Review() {

  //menangkap data yang dikirim dari komponen hasil TO
  const location = useLocation();
  const { gradeValue,examGroupId } = location.state;

  const slug = useParams();
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

  const [data, setData] = useState([])
  // console.log(data)
  const [counter, setCounter] = useState(0)

  const [currentPage, setCurrentPage] = useState(1);

  const [loadingButton, setLoadingButton] = useState(false);

  const getDataDiscussion = async () => {
    try {
      setLoading(true);
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

      const response = await axios.get(`https://panel.goprestasi.com/api/tryout-discussion/${slug.id}`, config);
      setData(response?.data?.answer_data);
      console.log(response?.data)
      setLoading(false);

    } catch (error) {
      console.error('Error fetching detail tryout:', error);
    }
  };


  useEffect(() => {
    getDataDiscussion();
  }, []);


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

        <div className="col-span-8 m-4">
          <Card className=" bg-orange-400 w-full">
            <Card className="mx-1 w-full">
              <CardBody>

                {data?.length === counter ? (
                  <div className="border-2 border-gray-400 rounded-lg">
                    <p className="p-8 text-justify">Sekian pembahasan dari kami mengenai pelajaran ini. Semoga pembahasan yang disampaikan bermanfaat bagi Anda</p>
                  </div>
                ) : (
                  <>
                    <h1 className="mb-2">Soal No {counter + 1}</h1>
                    <div className="border-2 border-gray-400 rounded-lg">
                      <p className="p-8 text-justify">
                        {data[counter]?.question ? (
                          parse(data[counter]?.question, {
                            selectors: [{ selector: 'img', format: 'image' }],
                          })
                        ) : (
                          'Pertanyaan tidak ditemukan.'
                        )}
                      </p>
                    </div>
                    <div className="mt-4">

                      <Button
                        fullWidth
                        variant={data[counter]?.answer !== 1 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color={data[counter]?.answer !== data[counter]?.question_answer ? "red" : "orange"}

                      >
                        A. {parse(striptags(data[counter]?.option_1,'<img>'),'<img>')} 
                      </Button>
                      <Button
                        fullWidth
                        variant={data[counter]?.answer !== 2 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color={data[counter]?.answer !== data[counter]?.question_answer ? "red" : "orange"}
                      >B.  {parse(striptags(data[counter]?.option_2,'<img>'),'<img>')} 
                      </Button>

                      <Button
                        fullWidth
                        variant={data[counter]?.answer !== 3 ? "outlined" : "gradient"}
                        className="text-left mt-2 "
                        color={data[counter]?.answer !== data[counter]?.question_answer ? "red" : "orange"}
                      >
                        C. {parse(striptags(data[counter]?.option_3,'<img>'),'<img>')} 

                      </Button>

                      <Button
                        fullWidth
                        variant={data[counter]?.answer !== 4 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color={data[counter]?.answer !== data[counter]?.question_answer ? "red" : "orange"}
                      >D.  {parse(striptags(data[counter]?.option_4,'<img>'),'<img>')} 
                      </Button>

                      <Button
                        fullWidth
                        variant={data[counter]?.answer !== 5 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color={data[counter]?.answer !== data[counter]?.question_answer ? "red" : "orange"}
                      >E.  {parse(striptags(data[counter]?.option_5,'<img>'),'<img>')} 
                      </Button>
                    </div>
                  </>
                )}

                <div className="flex justify-between mt-4">
                  <Button color="orange" variant="gradient" onClick={(() => {
                    if (counter > 0) {
                      setCounter(counter - 1)
                      setCurrentPage(currentPage - 1)
                    } else {
                      setCounter(0)
                      setCurrentPage(1)
                    }
                  })} >Prev</Button>

                  {counter !== data.length ? (
                    <Button color="orange" variant="gradient" className="text-xs" onClick={(() => {
                      setCounter(counter + 1)
                      setCurrentPage(currentPage + 1)
                      if (counter === data.length) {
                        setCounter(data.length)
                        setCurrentPage(data.length + 1)
                      }
                    })} >Next</Button>
                  ) : (<Button color="red" variant="gradient" className="flex items-center justify-center" onClick={(() => {
                    setLoadingButton(true);
                    setTimeout(() => {
                      navigate(`/dashboard/hasilTryout/${examGroupId}`)
                    }, 1000);

                  })}>Tutup Pembahasan {loadingButton ? (<Spinner className="mx-3 h-4 w-4" color="amber" />) : null}</Button>)}
                </div>
              </CardBody>
            </Card>
          </Card>
        </div>

        <div className="col-span-4 mt-4 order-first md:order-last">

          <Card className="mx-1 w-full ">
            <CardBody>
              <div className="grid items-center justify-center text-center">
                <div>
                  <Typography>Daftar Soal</Typography>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 items-center justify-center w-52">
                  {data?.map((item, key) => {
                    const incrementValueButton = ++key;
                    return (
                      <Button
                        variant="gradient"
                        size="sm"
                        className="w-11 h-11 items-center justify-center"
                        key={incrementValueButton}
                        color={`${key === currentPage
                          ? "yellow"
                          : (item.is_correct === 'N' ? "red" : "orange")}`}
                        onClick={(() => { setCurrentPage(incrementValueButton); setCounter(-1 + incrementValueButton) })}
                      >
                        {incrementValueButton}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="mx-1 w-full mt-4">
            <CardBody>
              <div className="grid items-center justify-center text-center">

                <div>

                  <div className="flex gap-3">
                    <Typography>Jawaban Kamu</Typography>
                    <Typography className="font-bold">
                      {data[counter]?.answer === 1 ? ": A"
                        : data[counter]?.answer === 2 ? ": B"
                          : data[counter]?.answer === 3 ? ": C"
                            : data[counter]?.answer === 4 ? ": D"
                              : data[counter]?.answer === 5 ? ": E"
                                : ": -"
                      }
                    </Typography>
                  </div>

                  <div className="flex gap-3">
                    <Typography>Jawaban Benar</Typography>
                    <Typography className="font-bold text-orange-500">
                      {data[counter]?.question_answer === 1 ? ": A"
                        : data[counter]?.question_answer === 2 ? ": B"
                          : data[counter]?.question_answer === 3 ? ": C"
                            : data[counter]?.question_answer === 4 ? ": D"
                              : data[counter]?.question_answer === 5 ? ": E"
                                : null
                      }

                    </Typography>
                  </div>

                  <div className="flex gap-2">
                    <Typography>Total Nilai Kamu</Typography>
                    <Typography className="font-bold ">: {gradeValue}</Typography>
                  </div>
                </div>
              </div>
              <div className=" mt-4 flex justify-center items-center">
                <Button color="red" onClick={handleOpen} variant="gradient" className="flex gap-2 items-center">
                  <p>Lihat Pembahasan</p><IoMdPlay className="w-5 h-5" />
                </Button>

                <Dialog open={open} handler={handleOpen} size="xxl" className="overflow-auto">
                  <DialogBody>

                    <div className="flex flex-col justify-center items-center">
                      <Typography className="font-bold text-xl mb-4">Pembahasan Video</Typography>
                      <ReactPlayer width="80vw" height="60vh"
                      url='https://www.youtube.com/watch?v=8JW6qzPCkE8&list=RDRiDCIqF0-6Y&index=9' />
                    </div>

                    <div className="m-10">
                      <Typography className="mb-2">
                        {data[counter]?.discussion ? (parse(data[counter]?.discussion)) : null}
                      </Typography>


                      <div className="flex gap-3">
                        <Typography>Jawaban Kamu</Typography>
                        <Typography className="font-bold">
                          {data[counter]?.answer === 1 ? ": A"
                            : data[counter]?.answer === 2 ? ": B"
                              : data[counter]?.answer === 3 ? ": C"
                                : data[counter]?.answer === 4 ? ": D"
                                  : data[counter]?.answer === 5 ? ": E"
                                    : null
                          }
                        </Typography>
                      </div>

                      <div className="flex gap-3">
                        <Typography>Jawaban Benar</Typography>
                        <Typography className="font-bold text-orange-500">
                          {data[counter]?.question_answer === 1 ? ": A"
                            : data[counter]?.question_answer === 2 ? ": B"
                              : data[counter]?.question_answer === 3 ? ": C"
                                : data[counter]?.question_answer === 4 ? ": D"
                                  : data[counter]?.question_answer === 5 ? ": E"
                                    : null
                          }

                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                      <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Tutup</span>
                      </Button>
                    </div>

                  </DialogBody>
                </Dialog>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </>

  )
}

export default Review;
