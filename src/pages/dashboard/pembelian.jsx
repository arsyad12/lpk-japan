import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    IconButton,
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

import { Transaction_paket } from "@/data";


function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-3 w-3"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
    );
}

export function Pembelian() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [dataLearn, setData] = useState(null);
    const [selectedPacket, setSelectedPacket] = useState(null);
    console.log(selectedPacket)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataLearn = await Transaction_paket();
                console.log(dataLearn.packets);
                setData(dataLearn.packets);
                setLoading(false);
            } catch (error) {
                console.error('Error setting user data:', error);
            }
        };

        fetchData();
    }, []);

    const [open, setOpen] = useState(false);

    const handleOpen = (packet) => {
        setSelectedPacket(packet);
        if (open === true) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };



    if (loading) {
        return <div className="mb-12 flex justify-center h-96">
            <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
                <Spinner className="h-16 w-16 text-gray-900/50" />
            </div>
        </div>;
    }

    return (
        <>
            <div className="relative p-4 mb-6 mt-4 w-full overflow-hidden rounded-xl bg-orange-600 bg-cover bg-center">
                {/* <div className="absolute inset-0 h-full w-full bg-gray-900/25" /> */}
                <div className=" flex items-center justify-between flex-wrap gap-4">
                    <div className="w-100">
                        <div className="flex items-center gap-2">
                            <div className='border-l-4 border-white-500 rounded-1'>
                                <Typography variant="h6" color="white" className="ml-2">
                                    Program Lolos PTN Impian Jalur SNBT & SNBP 2024
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="w-62">
                        <div className="flex items-center gap-2">
                            <Button
                                size="lg"
                                variant="outlined"
                                color="white"
                                className="group relative flex items-center gap-1 overflow-hidden pr-[36px] transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none ..."
                                onClick={(()=>{navigate('/dashboard/paymentHistory')})}
                            ><span className=" grid h-full w-7 place-items-center bg-light-orange-600 transition-colors group-hover:bg-light-orange-700">
                                    <i class="fa-solid fa-clock-rotate-left"></i>
                                </span>
                                Riwayat Pembelian
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

            <div className=" flex-col sm:flex-row justify-between items-center rounded-2xl mt-3 my-6">
                <div className="mt-4 mb-4 grid gap-y-4 gap-x-6 sm:grid-cols-3 gap-0 sm:gap-5">
                    {dataLearn.map((item, index) => (
                        <div key={index} className="inline-block">
                            <Card className="mt-6 w-full">
                                <CardHeader className="flex justify-between relative h-22 p-4 bg-[url('/img/assets/bg.png')] overflow-hidden rounded-xl bg-cover bg-center">
                                    <div class="absolute right-0 top-0 h-12 w-16">
                                        <div class="absolute transform rotate-45 bg-red-600 text-center text-white font-semibold py-1 right-[-55px] top-[15px] w-[170px]">
                                            {item.discount}% OFF
                                        </div>
                                    </div>
                                    <div className='text-2xl sm:text-3xl text-white'>
                                        <p>Paket Promo</p>
                                        <p>{item.active_period} {item.type}</p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="mb-2 flex gap-4 items-center justify-between">
                                        <Typography variant="h5" color="blue-gray" className="mb-2">
                                            {item.sub_description}
                                        </Typography>
                                        <div className="justify-items-end">
                                            <Typography color="gray-300" className="font-light line-through text-end">
                                                {item.price_before_discount.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0
                                                })},-
                                            </Typography>
                                            <Typography variant="h5" color="red" className="font-medium text-end">
                                                {item.price_after_discount.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0
                                                })},-
                                            </Typography>
                                        </div>

                                    </div>
                                </CardBody>
                                <CardFooter className="pt-0">
                                    <div class="flex justify-between ...">
                                        <Button onClick={() => handleOpen(item)} variant="outlined" color="orange">
                                            Selengkapnya
                                        </Button>
                                        <Button color="orange" onClick={() =>{navigate(`/dashboard/checkout/${item.id}`,{ state: { item }})}}>Beli Paket</Button>
                                    </div>
                                </CardFooter>
                            </Card>

                            <Dialog className="overflow-hidden"
                                open={open}
                                handler={handleOpen}
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0.9, y: -100 },
                                }}
                            >
                                <div class="absolute right-0 top-0 h-12 w-16">
                                    <div class="absolute transform rotate-45 bg-red-600 text-center text-white font-semibold py-1 right-[-65px] top-[35px] w-[230px]">
                                        {selectedPacket?.access_type}
                                    </div>
                                </div>
                                <DialogHeader>
                                    <div>
                                        <Typography variant="h4">{selectedPacket?.name}</Typography>
                                        <Typography>{selectedPacket?.description}</Typography>
                                    </div>
                                </DialogHeader>
                                <DialogBody>
                                    <div className="p-4 border border-orange-800 overflow-hidden rounded-xl">
                                        <ul className="flex flex-col gap-4">
                                            {selectedPacket?.packet_detail?.split('<br>').map((desc, indexTrim) => (
                                                <li key={indexTrim} className="flex items-center gap-4">
                                                    <span className="rounded-full border border-orange-800 bg-orange-50 p-1">
                                                        <CheckIcon />
                                                    </span>
                                                    <Typography className="font-normal">{desc.trim()}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </DialogBody>
                                <DialogFooter>
                                    <Button variant="gradient" color="orange" onClick={handleOpen}>
                                        <span>Confirm</span>
                                    </Button>
                                </DialogFooter>
                            </Dialog>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default Pembelian;

