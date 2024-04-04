import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Alert,
    Input,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Spinner,
    Switch,
    Tooltip,
    Button,
} from "@material-tailwind/react";
import {
    BookOpenIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import Lottie from "react-lottie";
import subsAnimated from "@/lotties/subs"
import { Link, useNavigate } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { dataLearning, SettingUserData } from "@/data";

const Kelas = [
    { value: '10', },
    { value: '11', },
    { value: '12', },
    { value: 'UTBK', },
];

const Jurusan = [
    { value: 'IPA', },
    { value: 'IPS', },
];

const Semester = [
    { value: 'Ganjil', },
    { value: 'Genap', },
];

export function Learning() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [dataLearn, setData] = useState(null);
    const [dataUser, setDataUser] = useState(undefined)

    console.log(dataLearn)
    console.log(dataUser)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataLearn = await dataLearning();
                const user = await SettingUserData()
                // console.log(dataLearn.category);

                setData(dataLearn.category);
                setDataUser(user.user)
                setLoading(false);
            } catch (error) {
                console.error('Error setting user data:', error);
            }
        };

        fetchData();
    }, []);


    const [activeTab, setActiveTab] = useState(null);
    const [activeTabJurusan, setActiveJurusan] = useState(null);
    const [activeTabSemester, setActiveSemester] = useState(null);

    const [filter, setFilter] = useState({
        class: '',
        major: '',
        semester: ''
    });

    const handleTabClick = (filterType, filterValue) => {
        // Update the filter state based on the clicked tab
        // console.log(filterType);
        setFilter({
            ...filter,
            [filterType]: filterValue
        });

        if (filterType === 'class') {
            setActiveTab(filterValue);
        } else if (filterType === 'major') {
            setActiveJurusan(filterValue);
        } else {
            setActiveSemester(filterValue);
        }
    };

    const [openAlerts, setOpenAlerts] = useState({});
    const toggleAlert = (id) => {
        setOpenAlerts((prevOpenAlerts) => ({
            ...prevOpenAlerts,
            [id]: !prevOpenAlerts[id],
        }));
        setActiveTab(null);
        setFilter((prevFilter) => ({
            ...prevFilter,
            class: '' // Atur filter class menjadi kosong
        }));
    };

    const [openJurusanAlerts, setJurusanOpenAlerts] = useState({});
    const toggleJurusanAlert = (id) => {
        setJurusanOpenAlerts((prevOpenAlerts) => ({
            ...prevOpenAlerts,
            [id]: !prevOpenAlerts[id],
        }));
        setActiveJurusan(null);
        setFilter((prevFilter) => ({
            ...prevFilter,
            major: '' // Atur filter class menjadi kosong
        }));
    };

    const [openSemesterAlerts, setSemesterOpenAlerts] = useState({});
    const toggleSemesterAlert = (id) => {
        setSemesterOpenAlerts((prevOpenAlerts) => ({
            ...prevOpenAlerts,
            [id]: !prevOpenAlerts[id],
        }));
        setActiveSemester(null);
        setFilter((prevFilter) => ({
            ...prevFilter,
            semester: '' // Atur filter class menjadi kosong
        }));
    };


    const navigateHandle = (learningId) => {
        navigate(`/dashboard/learning/${learningId}`, { state: { learningId } })
    }



    const subsAnimate = {
        loop: true,
        autoplay: true,
        animationData: subsAnimated,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    const MySwal = withReactContent(Swal);
    const swalGoPremium = () => {
        MySwal.fire({
          title: "Langganan My Learning Yuk",
          html: <Lottie options={subsAnimate} height={150} width={250}/>,
          footer: 'Belajar dari 12.000+ soal latihan dan rangkuman biar siap jadi juara!',
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Kembali",
          showConfirmButton: true,
          confirmButtonColor: "#03989E",
          confirmButtonText: "Pembelian",
          reverseButtons:true
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard/pembelian')
          }
        });
      }


    if (loading) {
        return <div className="mb-12 flex justify-center h-96">
            <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
                <Spinner className="h-16 w-16 text-gray-900/50" />
            </div>
        </div>;
    }

    return (
        <>
            <div className='border-l-4 border-teal-500 rounded-1 mt-4'>
                <Typography variant="h6" color="blue-gray" className="ml-2">
                    Daftar Bank Soal dan Rangkuman
                </Typography>
            </div>
            <div className="relative mt-4 h-28 w-full overflow-hidden rounded-xl bg-teal-600 bg-cover bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/25" />
            </div>
            <Card className="mx-3 -mt-24 mb-4 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-4">
                    <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                        <div className="w-64">
                            <div className="flex items-center gap-2">
                                <Typography variant="h6" color="blue-gray" >
                                    Kelas
                                </Typography>
                                <Tabs>
                                    <TabsHeader className="gap-2">
                                        {Kelas.map((tab, index) => (
                                            <Tab key={tab.value} value={tab.value} onClick={() => handleTabClick('class', tab.value)}>
                                                {tab.value}
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                        </div>
                        <div className="w-40">
                            <div className="flex items-center gap-2">
                                <Typography variant="h6" color="blue-gray" >
                                    Jurusan
                                </Typography>
                                <Tabs value="app">
                                    <TabsHeader>
                                        {Jurusan.map((tab, index) => (
                                            <Tab key={tab.value} value={tab.value} onClick={() => handleTabClick('major', tab.value)}>
                                                {tab.value}
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                        </div>
                        <div className="w-52">
                            <div className="flex items-center gap-2">
                                <Typography variant="h6" color="blue-gray" >
                                    Semester
                                </Typography>
                                <Tabs value="app">
                                    <TabsHeader>
                                        {Semester.map((tab, index) => (
                                            <Tab key={tab.value} value={tab.value} onClick={() => handleTabClick('semester', tab.value)}>
                                                {tab.value}
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <div className="gird-cols-1 mb-4 grid gap-12 px-4 h-24 justify-items-center content-center bg-[url('/img/assets/bg.png')] overflow-hidden rounded-xl bg-cover	bg-center">
                        <form method="GET">
                            <div class="relative text-gray-600 focus-within:text-gray-400">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </button>
                                </span>

                                <input type="search" name="q" class="py-2 text-sm lg:w-96 sm:w-fit text-white bg-gray-200 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900" placeholder="Cari Pelajaran disini..." autocomplete="off" />
                            </div>
                        </form>
                    </div>
                </CardBody>
            </Card>
            <div className="flex justify-start items-start gap-2 ">
                {Kelas.map((tab, index) => (
                    <Alert
                        key={tab.value}
                        open={activeTab === tab.value && openAlerts[tab.index]}
                        onClose={() => {
                            toggleAlert(tab.value);
                            // setFilter(null); // or setFilter(defaultValue);
                        }}
                        variant="outlined"
                        className="w-36 wrounded-none border-l-4 border-[#FCAA00] bg-[#ffe0b2]/10 text-sm text-[#FCAA00]"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 100 },
                        }}
                    >
                        {tab.value}
                    </Alert>
                ))}

                {Jurusan.map((tab, index) => (
                    <Alert
                        key={tab.value}
                        open={activeTabJurusan === tab.value && openJurusanAlerts[tab.value]}
                        onClose={() => {
                            toggleJurusanAlert(tab.value);
                            // setFilter(null);
                        }}
                        variant="outlined"
                        className="w-36 wrounded-none border-l-4 border-[#b71c1c] bg-[#ffcdd2]/10 text-sm text-[#b71c1c]"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 100 },
                        }}
                    >
                        {tab.value}
                    </Alert>
                ))}

                {Semester.map((tab, index) => (
                    <Alert
                        key={tab.value}
                        open={activeTabSemester === tab.value && openSemesterAlerts[tab.value]}
                        onClose={() => toggleSemesterAlert(index)}
                        variant="outlined"
                        className="w-36 wrounded-none border-l-4 border-[#00695c] bg-[#80cbc4]/10 text-sm text-[#00695c]"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 100 },
                        }}
                    >
                        {tab.value}
                    </Alert>
                ))}


            </div>
            {dataLearn.map((item, index) => (
                item.Learning.length > 0 &&
                (!filter || Object.entries(filter).every(([key, value]) => !value || item.Learning.some((learn) => learn[key] === value))) &&
                (
                    <div key={index} className="bg-white p-4 shadow-md flex-col sm:flex-row justify-between items-center rounded-2xl mt-3 border-l-8 py-3 my-6 border-teal-400">
                        {/* {console.log('item.Learning:', item.Learning)} */}
                        {console.log('filter:', filter)}
                        {/* {console.log('Filter Result:', Object.entries(filter).every(([key, value]) => !value || item.Learning.some((learn) => learn[key] === value)))} */}
                        <div className="flex flex-row gap-2 items-center inline-block align-middle">
                            <BookOpenIcon color="#179B8E" className="w-4" />
                            <p className="text-sm sm:text-base font-bold">{item.name}</p>
                        </div>

                        <div className="mt-4 mb-4 grid gap-y-4 gap-x-6 sm:grid-cols-4 gap-0 sm:gap-5">
                            {item.Learning.filter((learn) =>
                                (!filter || Object.entries(filter).every(([key, value]) => !value || learn[key] === value))
                            ).map((learn, LearnIndex) => (

                                <Card key={LearnIndex} color="transparent" shadow={false} className="w-full overflow-hidden max-w-[26rem] px-4 bg-[url('/img/assets/bg.png')] bg-cover bg-center max-w-xs transition duration-300 
                                
                                ease-in-out hover:scale-110" onClick={(() => { 
                                     dataUser.display_purchase_category === 'Premium' && learn.access_type   === 'Free' ?  navigateHandle(learn.id)
                                    :dataUser.display_purchase_category === 'Premium' && learn.access_type   === 'Premium' ?  navigateHandle(learn.id)
                                    :dataUser.display_purchase_category === 'Free' && learn.access_type   === 'Free' ?  navigateHandle(learn.id)
                                    :dataUser.display_purchase_category === 'Free' && learn.access_type   === 'Premium' ? swalGoPremium()
                                    : null
                                    
                                    })}>


                                    <div className="to-bg-black-50 absolute inset-0 h-full w-full bg-gradient-to-b from-black/100 via-black/50" />
                                    <CardHeader
                                        color="transparent"
                                        floated={false}
                                        shadow={false}
                                        className="mx-0 flex items-center gap-4 pt-0 pb-2"
                                    >
                                        <div className="flex w-full flex-col gap-0.5">
                                            <div className="flex items-center justify-between">
                                                <Typography variant="h5" color="blue-gray" className="text-gray-100">
                                                    {learn.name_learning}
                                                </Typography>
                                                <div className="5 flex items-center gap-0">
                                                    <Typography
                                                        color="blue-gray"
                                                        className="flex text-gray-100 items-center gap-1.5 font-normal"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="-mt-0.5 h-5 w-5 text-yellow-700"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        5.0
                                                    </Typography>
                                                </div>
                                            </div>
                                            <Typography color="blue-gray" className="text-gray-100">Kelas {learn.class} Semester {learn.semester}</Typography>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="flex mb-2 p-0 justify-end">
                                        <Button size="sm" variant="text" className="flex gap-2 z-10 items-center text-white">
                                            Pelajari
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                                />
                                            </svg>
                                        </Button>

                                    </CardBody>
                                </Card>

                            ))}
                        </div>

                    </div>
                )
            ))}
        </>
    )
}

export default Learning;

