import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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


export function DetailQuiz() {

  const navigate = useNavigate()

  const slug = useParams()

  const [detailQuiz, setDetailQuiz] = useState(undefined)
  const [quizGradeId, setQuizGradeId] = useState(undefined)

  console.log(detailQuiz)

  const location = useLocation();
  const { quizId, learningId } = location.state


  const [loadingButton, setLoadingButton] = useState(false);

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


      const response = await axios.get(`https://panel.goprestasi.com/api/detail-quiz/${slug.id}`, config);

      setDetailQuiz(response?.data)
      setQuizGradeId(response?.data?.detail_quiz?.grade_quiz?.id)
      setLoading(false);


      // return response.data; 
    } catch (error) {

      console.error('Error fetching detail tryout:', error);

    }
  };



  useEffect(() => {
    responseHandler();;
  }, []);


  const resetHandler = async () => {

    try {
      setLoadingButton(true)
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

      const response = await axios.get(`https://panel.goprestasi.com/api/quiz-start/${slug.id}?repeat=1`, config)
      responseHandler()
      setLoadingButton(false)
    } catch (error) {
      console.error('reset exam failed:', error);
    }
  }


  const navigateHandle = (quizId, learningId) => {
    navigate(`/dashboard/quiz/${quizId}`, { state: { quizId, learningId } });
  }

  // const navigateResetHandle = (quizId, learningId) => {
  //   navigate(`/dashboard/detailQuiz/${quizId}`, { state: { quizId, learningId } });
  // }

  const navigateBackLearning = (learningId) => {
    navigate(`/dashboard/learning/${learningId}`, { state: { learningId } });
  }

  const navigateReview = (quizGradeId,learningId) => {
    navigate(`/dashboard/reviewQuiz/${quizGradeId}`, { state: { quizGradeId,learningId } });
  }

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
            <Button className="bg-orange-400 flex items-center justify-start" onClick={(() => { navigateBackLearning(learningId) })}> <ChevronLeftIcon strokeWidth={3} className="h-5 w-5" color="white" /> Kembali</Button>

            <Typography variant="h5" color="blue-gray" className="mb-2 mt-8 items-center justify-center text-center">
              Detail Tryout
            </Typography>

            <Typography className="items-center justify-center text-center">
              {detailQuiz?.detail_quiz?.title}
            </Typography>

            {detailQuiz?.detail_quiz?.access_type === "Free" ? (
              <Typography className="items-center justify-center text-center text-red-700 font-bold">
                <p>FREE QUIZ</p>
              </Typography>
            ) : (
              <Typography className="items-center justify-center text-center text-red-700 font-bold">
                <p>PREMIUM QUIZ</p>
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
                  <p>-</p>
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
                  <p>{detailQuiz?.detail_quiz?.total_question}</p>
                  <p>Soal</p>
                </div>
              </div>

            </div>
          </CardBody>
        </Card>
      </Card>


      <Card className="mt-6 bg-orange-400 w-full">
        <Card className="mx-1 w-full">

          <div>
            <ListItem className="p-0 mb-4 mt-6" >
              <label
                className="w-full cursor-pointer items-center px-6 py-2 mr-6"
              >
                <div className="grid-cols-1 md:flex justify-between gap-4 mx-3">
                  <div className="grid grid-cols-12 md:flex mb-5 md:mb-0">
                    <ListItemPrefix className="mr-3 col-span-3">

                      {detailQuiz?.detail_quiz?.grade_quiz === null || detailQuiz?.detail_quiz?.grade_quiz?.is_finished === 0 ? (
                        <Checkbox
                          color="orange"
                          disabled
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
                          ripple={false}
                          className="hover:before:opacity-0"
                          containerProps={{
                            className: "p-0",
                          }}
                        />
                      )}
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="text-xs md:text-sm pt-1 font-medium col-span-9 line-clamp-1">
                      {detailQuiz?.detail_quiz?.name_chapter}
                    </Typography>
                  </div>
                  <div className="flex gap-4 items-center justify-center mr-4 text-xs md:text-sm">
                    <img className="" src="/img/TL.svg" alt="" srcset="" />
                    <p className="">{detailQuiz?.detail_quiz?.total_question} Soal</p>
                    <p className="">|</p>
                    <p className="">- Menit</p>
                  </div>
                </div>
                <hr className=" bg-orange-500 mt-2 dark:bg-orange-500" />
              </label>
            </ListItem>
          </div>


        </Card>
      </Card>

      <Card className="mt-6 bg-orange-400 w-full">
        <Card className="mx-1 w-full">
          <div className="flex justify-center items-center m-10 gap-8">

            {detailQuiz?.detail_quiz?.grade_quiz === null || detailQuiz?.detail_quiz?.grade_quiz?.is_finished === 0 ? (
              <>
                <Button className="bg-orange-400 flex items-center justify-center w-80 md:w-64 h-10 text-xs" onClick={(() => {
                  setLoadingButton(true)
                  setTimeout(() => {
                    navigateHandle(quizId, learningId)
                  }, 1000);
                })}>
                  {
                    detailQuiz?.detail_quiz?.grade_quiz === null || detailQuiz?.detail_quiz?.grade_quiz?.is_finished === 0 ?
                      <>
                        <span>Mulai Ujian </span> {loadingButton ? (<Spinner className="mx-3 h-6 w-6" color="amber" />) : null}
                      </>
                      : null
                  }
                </Button>
              </>
            ) :
              <>
                <Button className="bg-orange-400 flex items-center justify-center w-80 md:w-64 h-10 text-xs" onClick={(() => {
                  navigateReview(quizGradeId, learningId)
                })}>Pembahasan Quiz</Button>

                <Button className="bg-orange-400 flex items-center justify-center w-80 md:w-64 h-10 text-xs" onClick={(() => {
                  responseHandler()
                  resetHandler()
                  setTimeout(() => {
                    navigateHandle(quizId, learningId)
                  }, 1000);
                })}>Ulangi Quiz {loadingButton ? (<Spinner className="mx-3 h-6 w-6" color="amber" />) : null}</Button>
              </>
            }
          </div>
        </Card>
      </Card>
    </>
  );
}

export default DetailQuiz;
