import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Spinner,
  Textarea,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader

} from "@material-tailwind/react";
import { MdReportProblem } from "react-icons/md";

import axios from "axios";

import Countdown from 'react-countdown';

import { CircularProgressbar } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

import parse from 'html-react-parser';
import striptags from "striptags";

import { useSelector, useDispatch } from "react-redux";

import Swal from "sweetalert2";

import detailTO, * as detailToSlices from "@/slices/detailTryout";

export function Exam() {

  //get data detail tryout
  const state = useSelector((state) => state);
  const {
    detailTO: { resultDT },
  } = state;

  //  console.log(resultDT)

  const navigate = useNavigate()

  const dispatch = useDispatch();

  let slug = useParams(); //request parameter

  const [data, setData] = React.useState(0)

  // console.log(data)

  const [listexamId, setListExamId] = React.useState(undefined)

  // console.log(listexamId)

  const [examId, setExamId] = React.useState(undefined)

  // console.log(examId)

  const [counter, setCounter] = React.useState(0)

  const [duration, setDuration] = React.useState(0)

  const [currentPage, setCurrentPage] = React.useState(1);

  const [answeredQuestions, setAnsweredQuestions] = useState(Array(data.questionLists?.length).fill(false));

  const [myAnswers, setMyAnswers] = useState([]);

  // console.log(myAnswers)

  const [totalQuestions, setTotalQuestion] = useState(null)

  const [loadingButton, setLoadingButton] = useState(false);

  // Fungsi untuk menambah atau mengganti jawaban ke dalam array myAnswers

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  //deskripsi report soal

  const [description, setDescription] = useState('')

  const addAnswer = (question_id, answer) => {
    const existingAnswerIndex = myAnswers.findIndex(answer => answer.question_id === question_id);

    if (existingAnswerIndex !== -1) {
      // Ganti nilai answer jika jawaban sudah ada
      const updatedAnswers = [...myAnswers];
      updatedAnswers[existingAnswerIndex].answer = answer;
      setMyAnswers(updatedAnswers);
    } else {
      // Tambahkan jawaban baru ke dalam array myAnswers
      setMyAnswers(prevAnswers => [
        ...prevAnswers,
        { question_id: question_id, answer: answer }
      ]);
    }
    const updatedAnsweredQuestions = [...answeredQuestions];
    updatedAnsweredQuestions[counter] = true;
    setAnsweredQuestions(updatedAnsweredQuestions);
  };


  //state yang menyediakan data jawaban yang sudah dipilih
  const [selectedOptions, setSelectedOptions] = useState({});

  //variable yang digunakan untuk menambah progres bar setiap memilih jawaban
  const totalAnsweredQuestions = Object.keys(selectedOptions).length;
  const progressPercentage = totalAnsweredQuestions / totalQuestions * 100;

  //function untuk menambahkan atau update jawaban kedalam state selected option 
  const addAnswerAndSetActive = (optionNumber) => {
    addAnswer(data.questionLists[counter].question_id, optionNumber);
    setSelectedOptions({
      ...selectedOptions,
      [counter]: optionNumber,
    });
  };


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

      const response = await axios.get(`http://103.127.133.56/api/exam-group-start/${slug.id}`, config);
      // console.log(response.data);
      setData(response.data)
      setExamId(response.data.exam?.id)
      setDuration(Date.now() + response.data.duration * 1000)
      setTotalQuestion(response.data?.questionLists?.length)
      setLoading(false);

    } catch (error) {
      console.error('Error fetching detail tryout:', error);
    }
  };


  const updateDetailTO = async () => {
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
      const response = await axios.get(`https://panel.goprestasi.com/api/detail-tryout/${slug.id}`, config);
    } catch (error) {
      console.error('Error update detail tryout:', error);
    }
  };

  //get name lesson
  const getNameLessonById = () => {
    const lessonCategories = resultDT[slug.id].detail_tryout.lesson_category || [];
    let combinedExamArray = [];
    lessonCategories.forEach((lessonCategory) => {
      const exams = lessonCategory.exam || [];
      combinedExamArray = [...combinedExamArray, ...exams];
    });
    setListExamId(combinedExamArray);
  }


  React.useEffect(() => {
    getNameLessonById()
    responseHandler();
  }, []);


  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div className="mb-12 flex justify-center h-96">
      <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
        <Spinner className="h-16 w-16 text-gray-900/50" />
      </div>
    </div>;
  }

  const sumbitExam = async () => {
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

      const response = await axios.post(`https://panel.goprestasi.com/api/exam/${examId}/end`, {
        "myAnswers": myAnswers
      }, config);

      const updateDTO = await axios.get(`https://panel.goprestasi.com/api/detail-tryout/${slug.id}`, config);
      dispatch(detailToSlices.setResultDT({
        //jadi kita set state nya dengan ngirim nama movie dari data parameter slug
        idDetailTO: slug.id,
        //dan buat set state data nya pake data dari API 
        data: updateDTO.data
      }))

      // console.log(response)
    } catch (error) {
      console.error('Error submit exam:', error);
    }
  }




  const reportQuestion = async (questionId) => {
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

      const response = await axios.post(`https://panel.goprestasi.com/api/report/${questionId}/question`, {
        "description": description
      }, config);

      console.log(response.data)

      // console.log(response)
    } catch (error) {
      console.error('Error submit exam:', error);
    }
  }


  const swalSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Berhasil Mengirim Laporan",
    });
  }

  //countdown
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      sumbitExam()
      navigate(`/dashboard/detailtryout/${slug.id}`)
      // return <Completionist />;
    } else {
      // Render a countdown
      return <>
        <div className="flex justify-center items-center">
          <ButtonGroup className="w-1/2 flex justify-center items-center" size="sm" variant="gradient" color="orange">
            <Button className="bg-orange-500">{hours} Jam</Button>
            <Button className="bg-orange-500">{minutes} Menit</Button>
            <Button className="bg-orange-500">{seconds} Detik</Button>
          </ButtonGroup>
        </div>
      </>
    }
  };

  const navigateWhenDone = () => {
    navigate(`/dashboard/detailtryout/${slug.id}`)
  }






  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12">

        <Dialog open={open}>
          <DialogHeader>Lapor Soal</DialogHeader>
          <DialogBody>

            <Textarea onChange={((item)=>{setDescription(item.target.value)})} label="jelaskan kendala dari soal terkait"></Textarea>

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
            <Button variant="gradient" color="green" onClick={(() => { reportQuestion(data.questionLists[counter].question_id); handleOpen(); swalSuccess })}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <div className="col-span-8 m-4">
          <Card className=" bg-orange-400 w-full">
            <Card className="mx-1 w-full">
              <CardBody>

                {data.questionLists?.length === counter ? (
                  <div className="border-2 border-gray-400 rounded-lg">
                    <p className="p-8 text-justify">Ujian Selesai, Kamu Masih Punya Waktu, Pastikan Sudah Menjawab Semua Soal Dengan Baik, Jika Kamu Sudah Yakin Silahkan Tekan Akhiri Ujian</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h1>Soal No {counter + 1}</h1>
                      <button onClick={handleOpen}>
                        <MdReportProblem color="orange" className="w-7 h-7"/>
                      </button>
                    </div>

                    <div className="border-2 border-gray-400 rounded-lg">
                      <p className="p-8 text-justify">
                        {data?.questionLists && data?.questionLists[counter]?.question ? (
                          parse(data.questionLists[counter].question, {
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
                        variant={selectedOptions[counter] !== 1 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        onClick={() => addAnswerAndSetActive(1)}
                        style={{ textTransform: 'unset' }}
                      >
                        A. {parse(striptags(data.questionLists[counter]?.option_1, '<img>'), '<img>')}
                      </Button>
                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 2 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        onClick={() => addAnswerAndSetActive(2)}
                        style={{ textTransform: 'unset' }}
                      >B. {parse(striptags(data.questionLists[counter]?.option_2, '<img>'), '<img>')}
                      </Button>

                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 3 ? "outlined" : "gradient"}
                        className="text-left mt-2 "
                        color="orange"
                        onClick={() => addAnswerAndSetActive(3)}
                        style={{ textTransform: 'unset' }}
                      >
                        C. {parse(striptags(data.questionLists[counter]?.option_3, '<img>'), '<img>')}

                      </Button>

                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 4 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        onClick={() => addAnswerAndSetActive(4)}
                        style={{ textTransform: 'unset' }}
                      >D. {parse(striptags(data.questionLists[counter]?.option_4, '<img>'), '<img>')}
                      </Button>

                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 5 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        onClick={() => addAnswerAndSetActive(5)}
                        style={{ textTransform: 'unset' }}
                      >E. {parse(striptags(data.questionLists[counter]?.option_5, '<img>'), '<img>')}
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

                  {counter !== data.questionLists.length ? (
                    <Button color="orange" variant="gradient" onClick={(() => {
                      setCounter(counter + 1)
                      setCurrentPage(currentPage + 1)
                      if (counter === data.questionLists.length) {
                        setCounter(data.questionLists.length)
                        setCurrentPage(data.questionLists.length + 1)
                      }
                    })} >Next</Button>
                  ) : (<Button color="red" variant="gradient" className="flex items-center justify-center" onClick={(() => {
                    setLoadingButton(true);
                    sumbitExam();
                    updateDetailTO()
                    setTimeout(() => {
                      navigateWhenDone();
                    }, 1000);

                  })}>Akhiri Ujian {loadingButton ? (<Spinner className="mx-3 h-4 w-4" color="amber" />) : null}</Button>)}
                </div>
              </CardBody>
            </Card>
          </Card>
        </div>

        <div className="col-span-4 mt-4 order-first md:order-last">
          <Card className="mx-1 w-full">
            <CardBody>
              <div className="grid items-center justify-center text-center">
                <Typography>Sisa Waktu</Typography>
                <Countdown date={duration}
                  renderer={renderer}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="mx-1 w-full mt-4">
            <CardBody>
              {listexamId.filter((item) => item.id.includes(examId)).map((item, key) => (
                <>
                  <div key={key} className="flex justify-center items-center mb-4">{item.lesson.name}</div>
                  <div className="flex justify-center items-center">
                    <CircularProgressbar className="w-24 h-24"
                      value={progressPercentage}
                      text={`${progressPercentage.toFixed(2)}%`}
                      maxValue={100} />
                  </div>
                </>
              ))}
            </CardBody>
          </Card>

          <Card className="mx-1 w-full mt-4">
            <CardBody>
              <div className="grid items-center justify-center text-center">
                <div>
                  <Typography>Daftar Soal</Typography>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 items-center justify-center w-52">
                  {data.questionLists?.map((item, key) => {
                    const incrementValueButton = ++key;
                    return (
                      <Button
                        variant="gradient"
                        size="sm"
                        className="w-11 h-11 items-center justify-center"
                        key={incrementValueButton}
                        color={`${key === currentPage
                          ? "orange"
                          : (answeredQuestions[-1 + key] ? "yellow" : "blue-gray")}`}
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

        </div>
      </div>
    </>
  );
}

export default Exam;
