import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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
    Collapse
} from "@material-tailwind/react";

import Swal from "sweetalert2";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import ProgressBar from '@/widgets/cards/progressbar';
import { dataLearning } from '@/data';


export function ShowLearning() {

    const location = useLocation();
    const { learningId } = location.state;
    // console.log(learningId)

    const navigate = useNavigate()

    const [showContent, setShowContent] = useState(false);

    const [progress, setProgress] = useState(undefined);
    console.log('ini progress', progress)

    const [detailLearning, setDetailLearning] = useState(undefined);


    const [openId, setOpenId] = useState(null);

    const toggleOpen = (id) => {
        setOpenId((prevId) => (prevId === id ? null : id));
    };


    const [pdf, setPdf] = useState(undefined)
    // console.log(pdf)
    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    const handleBodyClick = (e) => {
        // Hentikan propagasi event agar tidak mencapai parent yang menutup dialog
        e.stopPropagation();
    };

    const getDetailLearning = async () => {
        try {
            setLoading(true)
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

            const response = await axios.get(`https://panel.goprestasi.com/api/detail-learning/${learningId}`, config);
            setDetailLearning(response?.data?.detail_learning)
            setProgress(response?.data)

            setLoading(false);

        } catch (error) {
            console.error('Error fetching detail learning:', error);
        }
    };

    const [finished, setFinish] = useState([])
    // console.log(finished)
    const [resultQuiz, setResultQuiz] = useState(undefined)
    // console.log(resultQuiz)

    const getResultQuiz = async (gradeQuizId) => {
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

            const response = await axios.get(`https://panel.goprestasi.com/api/quiz-grade/${gradeQuizId}`, config);
            console.log(response)
            setResultQuiz(response)

        } catch (error) {
            console.error('Error fetching result quiz:', error);
        }
    };


    const navigateHandle = (quizId, learningId) => {
        navigate(`/dashboard/detailQuiz/${quizId}`, { state: { quizId, learningId } });
    };



    const getDataPdf = async (idMaterial) => {
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

            const response = await axios.get(`https://panel.goprestasi.com/api/learning-material/${idMaterial}`, config);
            setPdf(response.request.responseURL)

        } catch (error) {
            console.error('Error fetching pdf tryout:', error.message);
        }
    };


    useEffect(() => {
        getDetailLearning();
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
        <div>
            <div className='sm:mx-5 mx-3 sm:pt-3 pt-1'>
                <button className='bg-teal-500 text-white cursor-pointer text-sm sm:text-base flex justify-center items-center py-1 px-3 rounded-md gap-2' > <FaChevronLeft /> <Link to="/dashboard/learning">Kembali</Link></button>
            </div>
            <div className='sm:mx-5 mx-3 bg-white shadow-md flex-col sm:flex-row justify-between items-center rounded-2xl mt-3 border-l-8 border-teal-500 sm:p-3 p-2  relative'>
                <div className='flex justify-center items-center sm:py-5 py-2'>
                    <img src="/img/assets/bg.png" alt='bg' className='rounded-2xl w-full sm:w-auto' />
                </div>
                <div className=' w-full text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md'>
                    <p className='text-md sm:text-2xl flex justify-center items-center text-white font-bold'>Bank Soal</p>
                    <p className='text-md sm:text-2xl flex justify-center items-center text-[#FCC200] font-bold'>{detailLearning?.name_learning}</p>
                </div>
            </div>

            <div className='flex sm:flex-row flex-col sm:mx-5 mx-3 '>
                {/* <div className='flex-2 w-auto h-full sm:w-[500px]  bg-white shadow-md flex-col sm:flex-row justify-between items-center rounded-2xl mt-3 border-l-8 border-teal-500 p-3 relative'>
                    {detailLearning?.learning_chapter.map((learningChapter, key) => (
                        <>

                            <Button key={key} className='w-full mb-3' onClick={(() => {
                                if (learningChapter.quiz.grade_quiz === null) {
                                    toggleOpen(learningChapter.id);
                                } else {
                                    getResultQuiz(learningChapter.quiz.grade_quiz.id);
                                    toggleOpen(learningChapter.id);
                                }

                            })} color='teal'>Progres Rangkuman & Pembahasan {learningChapter?.quiz?.title}</Button>

                            <Collapse open={openId === learningChapter.id}>
                                <Card className="my-4 mx-auto w-full">
                                    <CardBody>
                                        Circular progressbar

                                        <div className='flex gap-4 items-center justify-center'>

                                            <div>
                                                <div className="flex justify-center items-center mb-2">
                                                    <CircularProgressbar className="w-24 h-24"
                                                        value={progress?.learning_progress ? progress?.learning_progress.length / learningChapter?.material?.length * 100 : 0}
                                                        text={`${(progress?.learning_progress ? progress?.learning_progress.length / learningChapter?.material?.length * 100 : 0).toFixed(0)}%`}
                                                        maxValue={learningChapter?.material?.length / (learningChapter?.material?.length || 1) * 100 || 0}
                                                    />
                                                </div>
                                                <div className="flex justify-center items-center mb-4">Rangkuman</div>
                                            </div>


                                            <div>
                                                <div className="flex justify-center items-center mb-2">
                                                    <CircularProgressbar className="w-24 h-24"
                                                        value={resultQuiz?.total_correct ? resultQuiz?.total_correct : 0}
                                                        text={resultQuiz?.grade ? `${resultQuiz?.grade}%` : `0%`}
                                                        maxValue={resultQuiz?.total_question} />
                                                </div>
                                                <div className="flex justify-center items-center mb-4">Quiz</div>
                                            </div>
                                        </div>
                                        <div className='p-3'>
                                            <div className='flex justify-between'>
                                                <p className='text-gray-400'>Total soal </p>
                                                <p className='text-black'>{learningChapter?.quiz?.total_question}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p className='text-gray-400'>Total Jawaban Benar</p>
                                                <p className='text-black'>{resultQuiz?.total_correct ?? "0"}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p className='text-gray-400'>Nilai Akhir Quiz</p>
                                                <p className='text-black'>{resultQuiz?.grade ?? "0"}</p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </>
                    ))}
                </div> */}



                <div className='flex-1'>
                    <div className=''>
                        {detailLearning?.learning_chapter.map((learningChapter, key) => (
                            <div key={key} className='border shadow-lg cursor-pointer pb-3 border-gray-300 bg-gray-100 tracking-wider rounded-t-lg sm:m-3 mt-3 sm:mt-3 mx-1 sm:mx-3  '>
                                <div className='flex shadow-lg justify-between h-[60px] bg-white tracking-wider rounded-t-lg' onClick={() => setShowContent((prev) => (prev === key ? null : key))}>
                                    <p className='flex items-center ml-6'>{learningChapter?.name_chapter} </p>
                                    <span className='flex items-center mr-6'><FaChevronRight color='teal' /></span>
                                </div>
                                {showContent === key && (
                                    <>
                                        {learningChapter?.material.map((materials, keyMaterials) => (
                                            <div key={keyMaterials} className='mx-7 bg-white shadow-lg flex-col sm:flex-row text-left p-2 rounded-2xl mt-3 border-l-8 border-teal-500 '

                                                onClick={(() => {
                                                    // Mendapatkan data PDF dan membuka dialog
                                                    getDataPdf(materials.id);
                                                    handleOpen();
                                                })}>

                                                <div className='flex justify-between items-center'>
                                                    <div>
                                                        <p className='text-gray-400'>Materi Rangkuman</p>
                                                        <p className='text-black'>{materials?.name_material}</p>
                                                    </div>
                                                </div>
                                                <Dialog open={open} size="xxl" className="overflow-auto">
                                                    <DialogBody onClick={handleBodyClick}>
                                                        {pdf && (

                                                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
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
                                                        )}
                                                    </DialogBody>
                                                    <DialogFooter>
                                                        <Button variant="gradient" color="green" onClick={(() => {
                                                            getDetailLearning()
                                                            handleOpen();
                                                        })}>
                                                            <span>Tutup</span>
                                                        </Button>
                                                    </DialogFooter>
                                                </Dialog>
                                            </div>

                                        ))}

                                        <div className='mx-7 bg-white shadow-lg flex-col sm:flex-row text-left p-2 rounded-2xl mt-3 border-l-8 border-teal-500 '>
                                            <div className='flex justify-between items-center' onClick={(() => { navigateHandle(learningChapter?.quiz?.id, detailLearning.id) })}>
                                                <div>
                                                    <p className='text-gray-400'>Materi Rangkuman</p>
                                                    <p className='text-black'>{learningChapter?.quiz?.title}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ShowLearning;
