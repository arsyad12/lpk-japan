import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Chip,
  CardHeader,
  CardBody,
  IconButton,
  Button,
  ButtonGroup,
  Alert,
  Spinner,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard, SlideShow } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  SettingUserData,
  Tryout
} from "@/data";
import { CheckCircleIcon, LockClosedIcon, ChevronRightIcon, ClockIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import Lottie from "react-lottie";
import subsAnimated from "@/lotties/subs"
import withReactContent from 'sweetalert2-react-content'

export function Mytryout() {


  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [tryout, setTryoutData] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  // const [tryoutDetail, setDetailTryoutData] = useState(null);
  // console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SettingUserData();
        const tryout = await Tryout();
        console.log(tryout.tryout);
        // console.log(tryout.tryout[0].exam_groups);
        // setDetailTryoutData(tryout.tryout[0].exam_groups);
        setTryoutData(tryout.tryout);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error setting user data:', error);
      }
    };

    fetchData();
  }, []);

  const [filter, setFilter] = useState(null);

  const handleTabClick = (category) => {
    setFilter(category);
    // console.log(category);
  }

  const MySwal = withReactContent(Swal);

  const swalProfileNull = () => {
    Swal.fire({
      title: "Perhatian !",
      text: "Profil belum lengkap. Lengkapi di menu setting sekarang, agar dapat mengakses tryout",
      imageUrl: "https://shorturl.at/adt26",
      imageWidth: 200,
      imageHeight: 250,
      imageAlt: "Custom image"
    });
  }
  const subsAnimate = {
    loop: true,
    autoplay: true,
    animationData: subsAnimated,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

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

  // console.log(tryout);


  return (
    <div className="mt-5">
      <div className='mb-8 sm:flex w-full flex-1 sm:flex-1'>
        <SlideShow />
      </div>
      <div class="hidden lg:block">
        <div className="mb-12 grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-4 ">
          {statisticsCardsData.map(({ icon, title, footer, color, ...rest }) => (
            <StatisticsCard
              color="teal"
              key={title}
              {...rest}
              title={title}
              icon={React.createElement(icon, {
                className: "w-6 h-6 text-white",
              })}
            />
          ))}
        </div>
      </div>
      <Card className="my-4">
        <CardHeader variant="gradient" color="teal" className="mb-4 p-6">
          <Typography className="font-normal mb-5 text-center" color="white">
            Hallo {data.user.name}, <br></br>
            Kami siap menjadi Sahabat Prestasimu untuk mencapai impian!
          </Typography>
          {tryout && (
            <div class="grid gap-y-4 gap-x-6 md:grid-cols-5 sm:grid-cols-2 xl:grid-cols-5 justify-self-center">
              {tryout.map(item => (
                <Button key={item.id} variant="gradient" onClick={() => handleTabClick(item.name)} size="sm" color="white">{item.name}</Button>
              ))}
            </div>
          )}
          {/* {tryout && (
            <ButtonGroup
              fullWidth
              ripple={false}
              color="white">
              {tryout.map(item => (
                <Button key={item.id}>{item.name}</Button>
              ))}
            </ButtonGroup>
          )} */}
        </CardHeader>

        <CardBody className="flex flex-col gap-4 p-4">
          <Typography variant="h5" color="blue-gray">
            Pilih paket belajar kamu
          </Typography>
          {tryout?.map((item, index) => (
            (!filter || item.name === filter) && (
              <div key={index} className="flex flex-col gap-4">
                {console.log('filter:', filter)}
                {/* {tryout[index].exam_groups
            .filter((learn) => !filter || learn.kelas === filter)
            .map((detailTryout, learnIndex) => ( */}
                {item?.exam_groups?.map((detailTryout, index) => (
                    // {tryout[index].exam_groups.filter((learn) => !filter || learn.category === filter).map((detailTryout, learnIndex) => (
                    <div class="relative inline-flex" key={detailTryout.id}>
                      {/* {console.log('filter:', detailTryout.category)} */}

                      <button
                        class="align-middle select-none font-sans font-bold text-left uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-4 rounded-lg border border-gray-900 text-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] flex items-center gap-3 shadow-md shadow-gray-900/10 active:opacity-[0.85] active:shadow-none block w-full transition duration-300 ease-in-out hover:scale-105"
                        type="button" onClick={(() => {
                          
                            !data.user?.student?.origin_of_school ? swalProfileNull()
                              : data?.user?.display_purchase_category === 'Premium' && detailTryout.access_type === 'Free' ? navigate(`/dashboard/detailtryout/${detailTryout.id}`)
                              : data?.user?.display_purchase_category === 'Premium' && detailTryout.access_type === 'Premium' ? navigate(`/dashboard/detailtryout/${detailTryout.id}`)
                              : data?.user?.display_purchase_category === 'Free' && detailTryout.access_type === 'Free' ? navigate(`/dashboard/detailtryout/${detailTryout.id}`)
                              : data?.user?.display_purchase_category === 'Free' && detailTryout.access_type === 'Premium' ? swalGoPremium()
                              : null
                          
                          
                        })}>
                        <CheckCircleIcon strokeWidth={3} className="h-6 w-6" color="grey" />
                        {/* <Typography variant="h6" color="blue-gray"> */}
                        <p class="truncate w-4/5">{detailTryout.title}</p>

                        {/* </Typography> */}

                        {detailTryout.access_type === "Premium" ? (
                          <div className="!absolute items-center right-4">
                            <LockClosedIcon strokeWidth={10} className="h-5 w-5" color="#607d8b" />
                          </div>
                        ) : (
                          <div className="!absolute items-center right-4">
                            <ChevronRightIcon strokeWidth={3} className="h-5 w-5" color="#607d8b" />
                          </div>
                        )}
                      </button>

                      {detailTryout.access_type === "Free" ? (
                        <div
                          class="!absolute -top-1 -right-1 font-medium min-w-[24px] min-h-[24px]">
                          <img src="/img/ic_ribbon_free.svg" className="w-[50px]" alt="" style={{ filter: 'hue-rotate(142deg) contrast(1.8) brightness(0.88)' }}
                          />
                        </div>
                        // <div
                        //   class="absolute rotate-45 rounded-full py-1 px-2 text-xs font-medium content-[''] leading-none grid place-items-center top-[22%] right-[1%] translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[24px] min-h-[24px]">
                        //   Free
                        // </div>
                        // <div class="relative overflow-hidden w-56 h-56 bg-white border">
                        // </div>
                        // <div class="absolute right-2 -top-10 aspect-square w-20 overflow-hidden rounded-sm">
                        //   <div aria-hidden="true" class="absolute h-2 w-2 bg-violet-500"></div>
                        //   <div aria-hidden="true" class="absolute bottom-0 right-0 h-2 w-2 bg-violet-500"></div>
                        //   <div class="absolute bottom-0 right-0 w-square-diagonal origin-bottom-right rotate-45">
                        //     <a class="flex flex-col items-center bg-violet-300 py-2.5 shadow hover:bg-violet-200 focus:outline-none focus:ring focus:ring-inset focus:ring-violet-500" href="#"
                        //     >
                        //     <span class="font-bold leading-none text-violet-900">Free</span></a>
                        //   </div>
                        // </div>
                      ) : ("")}
                    </div>
                  ))}
              </div>
            )))}
        </CardBody>

      </Card>
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}
      {/* <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default Mytryout;
