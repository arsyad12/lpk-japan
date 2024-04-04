import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Typography,
    Card,
    CardBody,
    CardFooter,
    Button,
    Spinner,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import Countdown from 'react-countdown';




export function PaymentHistory() {

    const navigate = useNavigate()

    const [dataHistory, setDataHistory] = useState(undefined)
    const [detailInvoice, setDetailInvoice] = useState(undefined)
 

    const waitingTransactions = dataHistory?.transaction_history?.filter((item) => item.transaction_status === "Unpaid");
    const successTransactions = dataHistory?.transaction_history?.filter((item) => item.transaction_status === "Paid");
    const failedTransactions = dataHistory?.transaction_history?.filter((item) => item.transaction_status === "Failed");



    const getHistoryHandler = async () => {
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

            const response = await axios.get(`https://panel.goprestasi.com/api/transaction-history`, config);
            setDataHistory(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching history payment:', error);
        }
    };

    const [activeTab, setActiveTab] = useState("menunggu");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    const getDetailInvoice = async (idHistory) => {
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

            const response = await axios.get(`https://panel.goprestasi.com/api/transaction-invoice/${idHistory}`, config);
            setDetailInvoice(response?.data)

        } catch (error) {
            console.error('Error fetching history payment:', error);
        }
    };

    //countdown
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            window.location.href = '/dashboard/paymentHistory'
        } else {
            // Render a countdown
            return <>

                <p>{hours} Jam</p>
                <p>{minutes} Menit</p>
                <p>{seconds} Detik</p>

            </>
        }
    };

    //SWALL
    const MySwal = withReactContent(Swal);

    const swalConfirm = (waiting) => {

        if (!detailInvoice) {
            return;
        }

        MySwal.fire({
            title: "Konfirmasi Pembelian",
            html: <>

                <div className="mb-3"><p>Apakah pembelian kamu sudah benar? Paket tidak dapat diubah setelah ini</p></div>

                <div className="mb-3 border-teal-500 border-2">
                    <p className="pt-2">Ringkasan Pembelian</p>
                    <div className="m-4 flex justify-between">
                        <Typography className="font-normal">Harga Paket</Typography>
                        <Typography color="gray-300" className="text-start text-teal-700 font-bold ">
                            {waiting?.package?.price_before_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>
                    </div>
                    <div className="m-4 -mt-3 flex justify-between">
                        <Typography className="font-normal">Diskon {waiting?.package?.discount ? waiting?.package?.discount : '0'} %</Typography>
                        <Typography color="gray-300" className="text-start text-red-500 font-bold ">
                            - {waiting?.package?.price_after_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>

                    </div>

                    <hr className="border-1 border-cyan-700 -mt-3" />

                    <div className="m-4  flex justify-between">
                        <Typography className="font-normal">Total Order</Typography>
                        <Typography color="gray-300" className="text-start  text-teal-700 font-bold ">
                            {waiting?.package?.price_after_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>
                    </div>

                </div>

                <div className="m-4  flex justify-center gap-2 text-teal-500">
                    <Countdown
                        date={detailInvoice?.midtrans?.expiry_time}
                        intervalDelay={0}
                        precision={3}
                        renderer={renderer}
                    />
                </div>

            </>,
            showCancelButton: true,
            cancelButtonColor: "#d33",
            cancelButtonText: "Kembali",
            showConfirmButton: true,
            confirmButtonColor: "#03989E",
            confirmButtonText: "Konfirmasi",
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                const popupWidth = 600;
                const popupHeight = 600;

                // Menghitung posisi tengah layar
                const leftPosition = (window.innerWidth - popupWidth) / 2;
                const topPosition = (window.innerHeight - popupHeight) / 2;

                const popupOptions = `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`;

                // Membuka jendela popup
                const popupWindow = window.open(`${waiting.checkout_link}`, "MidtransPopup", popupOptions);

                // Menambahkan event listener untuk menangkap perubahan URL saat jendela ditutup
                // Memulai polling untuk memeriksa status popup setiap beberapa milidetik
                const pollPopupStatus = setInterval(() => {
                    if (popupWindow.closed) {
                        // Jendela popup ditutup, navigasi ke halaman lain
                        clearInterval(pollPopupStatus);
                        navigate('/dashboard/paymentHistory');
                    }
                }, 1000); // Interval polling setiap 1 detik
            }
        });
    };
    const swalConfirmSuccess = (waiting) => {

        MySwal.fire({
            title: "Pembelian Berhasil",
            html: <>

                <div className="mb-3 border-teal-500 border-2">
                    <p className="pt-2">Invoice Pembelian</p>
                    <div className="m-4 flex justify-between">
                        <Typography className="font-normal">Harga Paket</Typography>
                        <Typography color="gray-300" className="text-start text-teal-700 font-bold ">
                            {waiting?.package?.price_before_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>
                    </div>
                    <div className="m-4 -mt-3 flex justify-between">
                        <Typography className="font-normal">Diskon {waiting?.package?.discount ? waiting?.package?.discount : '0'} %</Typography>
                        <Typography color="gray-300" className="text-start text-red-500 font-bold ">
                            - {waiting?.package?.price_after_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>

                    </div>

                    <hr className="border-1 border-cyan-700 -mt-3" />

                    <div className="m-4  flex justify-between">
                        <Typography className="font-normal">Total Order</Typography>
                        <Typography color="gray-300" className="text-start  text-teal-700 font-bold ">
                            {waiting?.package?.price_after_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>
                    </div>
                </div>

            </>,
            showConfirmButton: true,
            confirmButtonColor: "#03989E",
            confirmButtonText: "Tutup"
        })
    }
    const swalFailed = (waiting) => {

        MySwal.fire({
            title: "Transaksi Gagal",
            html: <>

                <div className="mb-3 border-teal-500 border-2">
                    <p className="pt-2">Invoice Pembelian</p>
                    <div className="m-4 flex justify-between">
                        <Typography className="font-normal">Harga Paket</Typography>
                        <Typography color="gray-300" className="text-start text-teal-700 font-bold ">
                            {waiting?.package?.price_before_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>
                    </div>
                    <div className="m-4 -mt-3 flex justify-between">
                        <Typography className="font-normal">Diskon {waiting?.package?.discount ? waiting?.package?.discount : '0'} %</Typography>
                        <Typography color="gray-300" className="text-start text-red-500 font-bold ">
                            - {waiting?.package?.price_after_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>

                    </div>

                    <hr className="border-1 border-cyan-700 -mt-3" />

                    <div className="m-4  flex justify-between">
                        <Typography className="font-normal">Total Order</Typography>
                        <Typography color="gray-300" className="text-start  text-teal-700 font-bold ">
                            {waiting?.package?.price_after_discount.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            })},-
                        </Typography>
                    </div>
                </div>

            </>,
            showConfirmButton: true,
            confirmButtonColor: "#03989E",
            confirmButtonText: "Tutup"
        })
    }


    // Efek untuk membuka jendela setelah dataInvoice terisi
    useEffect(() => {
        getHistoryHandler()
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

            <div className="mt-2">
                <Card className="mt-6 bg-teal-400 w-full">
                    <Card className="mx-1 w-full overflow-hidden">
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <TabsHeader className="m-4 bg-teal-600">
                                <Tab value="menunggu">
                                    <div className={activeTab === "menunggu" ? "flex items-center gap-2" : "flex items-center gap-2 text-white"}>
                                        <p>Menunggu</p>
                                    </div>
                                </Tab>
                                <Tab value="berhasil">
                                    <div className="flex items-center gap-2">
                                        <p>Berhasil</p>
                                    </div>
                                </Tab>
                                <Tab value="gagal">
                                    <div className="flex items-center gap-2">
                                        <p>Gagal</p>
                                    </div>
                                </Tab>
                            </TabsHeader>
                            <TabsBody>

                                <TabPanel value="menunggu">

                                    {waitingTransactions?.length === 0 ? (
                                        <Card className="mt-3 w-full border-2 border-teal-400">
                                            <CardBody className=" grid grid-cols-1 md:grid-cols-12 justify-center">

                                                <div className="col-span-2">

                                                </div>

                                                <div className="col-span-8 items-center justify-center">
                                                    <div className="mt-3 text-center">
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Kamu belum beli paket belajar apapun :(
                                                        </Typography>
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Ayow! Pilih paket My Tryout dan My Learning Sekarang
                                                        </Typography>
                                                        <button>
                                                            <Typography className="bg-teal-100 text-teal-800 font-bold p-2 rounded px-4">
                                                                PEMBELIAN
                                                            </Typography>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 order-first md:order-last mb-3 md:mb-0">
                                                    <img
                                                        src="/img/failpict.png"
                                                        alt="bruce-mars"
                                                        className="w-30 h-30 mb-4 object-center mx-auto"
                                                    />
                                                </div>

                                            </CardBody>
                                        </Card>
                                    ) :
                                        <>
                                            {dataHistory?.transaction_history.filter((item) => item.transaction_status === "Unpaid").map((waiting, waitingKey) => (
                                                <Card key={waitingKey} className="mt-3 w-full border-2 border-teal-400">
                                                    <CardBody>
                                                        <Typography variant="h4" color="gray" className="mb-2">
                                                            #{waiting?.package_name}
                                                        </Typography>
                                                        <Typography color="gray-300" className="text-start text-teal-700 text-xl font-bold mb-3 ">
                                                            {waiting?.total_purchases.toLocaleString('id-ID', {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                minimumFractionDigits: 0
                                                            })},-
                                                        </Typography>
                                                        <Typography>
                                                            Kadaluarsa Pada {waiting?.maximum_payment_time}
                                                        </Typography>
                                                        <div className="flex flex-col md:flex-row justify-start md:justify-between">
                                                            <div className="mt-3">
                                                                <Typography className="bg-amber-100 text-amber-800 font-bold p-1 rounded text-sm px-2">
                                                                    {waiting?.transaction_status === "Unpaid" ? "Menunggu Pembayaran" : null}
                                                                </Typography>
                                                            </div>
                                                            <Typography className="pt-3">
                                                                No. Order {waiting?.receipt_code}
                                                            </Typography>
                                                        </div>
                                                    </CardBody>
                                                    <CardFooter className="pt-0 flex justify-end items-end">
                                                        <Button onClick={(() => { getDetailInvoice(waiting.id); swalConfirm(waiting) })} color="teal" variant="gradient">Lihat Invoice</Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </>
                                    }
                                </TabPanel>


                                <TabPanel value="berhasil">

                                    {successTransactions?.length === 0 ? (
                                        <Card className="mt-3 w-full border-2 border-teal-400">
                                            <CardBody className=" grid grid-cols-1 md:grid-cols-12 justify-center">

                                                <div className="col-span-2">

                                                </div>

                                                <div className="col-span-8 items-center justify-center">
                                                    <div className="mt-3 text-center">
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Kamu belum beli paket belajar apapun :(
                                                        </Typography>
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Ayow! Pilih paket My Tryout dan My Learning Sekarang
                                                        </Typography>
                                                        <button>
                                                            <Typography className="bg-teal-100 text-teal-800 font-bold p-2 rounded px-4">
                                                                PEMBELIAN
                                                            </Typography>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 order-first md:order-last mb-3 md:mb-0">
                                                    <img
                                                        src="/img/failpict.png"
                                                        alt="bruce-mars"
                                                        className="w-30 h-30 mb-4 object-center mx-auto"
                                                    />
                                                </div>

                                            </CardBody>
                                        </Card>
                                    ) :
                                        <>
                                            {dataHistory?.transaction_history.filter((item) => item.transaction_status === "Paid").map((waiting, waitingKey) => (
                                                <Card key={waitingKey} className="mt-3 w-full border-2 border-teal-400">
                                                    <CardBody>
                                                        <Typography variant="h4" color="gray" className="mb-2">
                                                            #{waiting?.package_name}
                                                        </Typography>
                                                        <Typography color="gray-300" className="text-start text-teal-700 text-xl font-bold mb-3 ">
                                                            {waiting?.total_purchases.toLocaleString('id-ID', {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                minimumFractionDigits: 0
                                                            })},-
                                                        </Typography>
                                                        <Typography>
                                                            Kadaluarsa Pada {waiting?.maximum_payment_time}
                                                        </Typography>
                                                        <div className="flex flex-col md:flex-row justify-start md:justify-between">
                                                            <div className="mt-3">
                                                                <Typography className="bg-cyan-100 text-cyan-800 font-bold p-1 rounded text-sm px-2">
                                                                    {waiting?.transaction_status === "Paid" ? "Transaksi Berhasil" : null}
                                                                </Typography>
                                                            </div>
                                                            <Typography className="pt-3">
                                                                No. Order {waiting?.receipt_code}
                                                            </Typography>
                                                        </div>
                                                    </CardBody>
                                                    <CardFooter className="pt-0 flex justify-end items-end">
                                                        <Button onClick={(() => { swalConfirmSuccess(waiting) })} color="teal" variant="gradient">Lihat Invoice</Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </>
                                    }
                                </TabPanel>


                                <TabPanel value="gagal">

                                    {failedTransactions?.length === 0 ? (
                                        <Card className="mt-3 w-full border-2 border-teal-400">
                                            <CardBody className=" grid grid-cols-1 md:grid-cols-12 justify-center">

                                                <div className="col-span-2">

                                                </div>

                                                <div className="col-span-8 items-center justify-center">
                                                    <div className="mt-3 text-center">
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Kamu belum beli paket belajar apapun :(
                                                        </Typography>
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Ayow! Pilih paket My Tryout dan My Learning Sekarang
                                                        </Typography>
                                                        <button>
                                                            <Typography className="bg-teal-100 text-teal-800 font-bold p-2 rounded px-4">
                                                                PEMBELIAN
                                                            </Typography>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 order-first md:order-last mb-3 md:mb-0">
                                                    <img
                                                        src="/img/failpict.png"
                                                        alt="bruce-mars"
                                                        className="w-30 h-30 mb-4 object-center mx-auto"
                                                    />
                                                </div>

                                            </CardBody>
                                        </Card>
                                    ) :
                                        <>
                                            {dataHistory?.transaction_history.filter((item) => item.transaction_status === "Failed").map((waiting, waitingKey) => (
                                                <Card key={waitingKey} className="mt-3 w-full border-2 border-teal-400">
                                                    <CardBody>
                                                        <Typography variant="h4" color="gray" className="mb-2">
                                                            #{waiting?.package_name}
                                                        </Typography>
                                                        <Typography color="gray-300" className="text-start text-teal-700 text-xl font-bold mb-3 ">
                                                            {waiting?.total_purchases.toLocaleString('id-ID', {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                minimumFractionDigits: 0
                                                            })},-
                                                        </Typography>
                                                        <Typography>
                                                            Kadaluarsa Pada {waiting?.maximum_payment_time}
                                                        </Typography>
                                                        <div className="flex flex-col md:flex-row justify-start md:justify-between">
                                                            <div className="mt-3">
                                                                <Typography className="bg-red-100 text-red-800 font-bold p-1 rounded text-sm px-2">
                                                                    {waiting?.transaction_status === "Failed" ? "Transaksi Gagal" : null}
                                                                </Typography>
                                                            </div>
                                                            <Typography className="pt-3">
                                                                No. Order {waiting?.receipt_code}
                                                            </Typography>
                                                        </div>
                                                    </CardBody>
                                                    <CardFooter className="pt-0 flex justify-end items-end">
                                                        <Button onClick={(() => { swalFailed(waiting) })} color="teal" variant="gradient">Lihat Invoice</Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </>
                                    }
                                </TabPanel>

                            </TabsBody>
                        </Tabs>
                    </Card>
                </Card>
            </div>
        </>
    );
}

export default PaymentHistory;

