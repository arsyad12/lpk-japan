import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Spinner,

} from "@material-tailwind/react";

import axios from "axios";

import Countdown from 'react-countdown';

import { CircularProgressbar } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

import parse from 'html-react-parser';
import striptags from "striptags";

export function Quiz() {

  const location = useLocation();
  const { quizId,learningId } = location.state;


  const navigate = useNavigate()

  const [data, setData] = useState(0)

  console.log(data)

  const [counter, setCounter] = React.useState(0)

  const [currentPage, setCurrentPage] = React.useState(1);

  const [answeredQuestions, setAnsweredQuestions] = useState(Array(data.questionLists?.length).fill(false));

  const [myAnswers, setMyAnswers] = useState([]);

  // console.log(myAnswers)

  const [totalQuestions, setTotalQuestion] = useState(null)

  const [loadingButton, setLoadingButton] = useState(false);

  // Fungsi untuk menambah atau mengganti jawaban ke dalam array myAnswers

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


  const getQuizHandler = async () => {
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

      const response = await axios.get(`https://panel.goprestasi.com/api/quiz-start/${quizId}`, config);
      // console.log(response.data);
      setData(response.data)
      setTotalQuestion(response.data?.questionLists?.length)
      setLoading(false);

    } catch (error) {
      console.error('Error fetching detail tryout:', error);
    }
  };



  useEffect(() => {
    getQuizHandler();
  }, []);


  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div className="mb-12 flex justify-center h-96">
      <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
        <Spinner className="h-16 w-16 text-gray-900/50" />
      </div>
    </div>;
  }

  const submitQuiz = async () => {
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

      const response = await axios.post(`https://panel.goprestasi.com/api/quiz-end/${quizId}`, {
        "myAnswers": myAnswers
      }, config);


      console.log(response)
    } catch (error) {
      console.error('Error submit exam:', error);
    }
  }


  const navigateWhenDone = (quizId,learningId) => {
    navigate(`/dashboard/detailQuiz/${quizId}`,{ state: {quizId,learningId} })
  }


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12">

        <div className="col-span-8 m-4">
          <Card className=" bg-orange-400 w-full">
            <Card className="mx-1 w-full">
              <CardBody>

                {data?.questionLists?.length === counter ? (
                  <div className="border-2 border-gray-400 rounded-lg">
                    <p className="p-8 text-justify">Quiz selesai, Jika  kamu sudah yakin dengan jawaban nya, silahkan akhiri quiz</p>
                  </div>
                ) : (
                  <>
                    <h1 className="mb-2">Soal No {counter + 1}</h1>
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
                        style={{textTransform:'unset'}}
                        onClick={() => addAnswerAndSetActive(1)}
                      >
                        A. {parse(striptags(data?.questionLists[counter]?.option_1, '<img>'), '<img>')}
                      </Button>
                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 2 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        style={{textTransform:'unset'}}
                        onClick={() => addAnswerAndSetActive(2)}
                      >B. {parse(striptags(data?.questionLists[counter]?.option_2, '<img>'), '<img>')}
                      </Button>

                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 3 ? "outlined" : "gradient"}
                        className="text-left mt-2 "
                        color="orange"
                        style={{textTransform:'unset'}}
                        onClick={() => addAnswerAndSetActive(3)}
                      >
                        C. {parse(striptags(data?.questionLists[counter]?.option_3, '<img>'), '<img>')}

                      </Button>

                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 4 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        style={{textTransform:'unset'}}
                        onClick={() => addAnswerAndSetActive(4)}
                      >D. {parse(striptags(data?.questionLists[counter]?.option_4, '<img>'), '<img>')}
                      </Button>

                      <Button
                        fullWidth
                        variant={selectedOptions[counter] !== 5 ? "outlined" : "gradient"}
                        className="text-left mt-2"
                        color="orange"
                        style={{textTransform:'unset'}}
                        onClick={() => addAnswerAndSetActive(5)}
                      >E. {parse(striptags(data?.questionLists[counter]?.option_5, '<img>'), '<img>')}
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

                  {counter !== data?.questionLists?.length ? (
                    <Button color="orange" variant="gradient" onClick={(() => {
                      setCounter(counter + 1)
                      setCurrentPage(currentPage + 1)
                      if (counter === data?.questionLists?.length) {
                        setCounter(data?.questionLists?.length)
                        setCurrentPage(data?.questionLists?.length + 1)
                      }
                    })} >Next</Button>
                  ) : (<Button color="red" variant="gradient" className="flex items-center justify-center" onClick={(() => {
                    setLoadingButton(true);
                    submitQuiz();
                    setTimeout(() => {
                      navigateWhenDone(quizId,learningId);
                    }, 1000);

                  })}>Akhiri Quiz {loadingButton ? (<Spinner className="mx-3 h-4 w-4" color="amber" />) : null}</Button>)}
                </div>
              </CardBody>
            </Card>
          </Card>
        </div>

        <div className="col-span-4  order-first md:order-last">


          <Card className="mx-1 w-full mt-4">
            <CardBody>
              
                <>
                  <div  className="flex justify-center items-center mb-4">{data.quiz.title}</div>
                  <div className="flex justify-center items-center">
                    <CircularProgressbar className="w-24 h-24"
                      value={progressPercentage}
                      text={`${progressPercentage.toFixed(2)}%`}
                      maxValue={100} />
                  </div>
                </>
            
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

export default Quiz;
