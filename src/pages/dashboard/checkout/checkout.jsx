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
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { FaLess } from "react-icons/fa";


export function Checkout() {

  const location = useLocation();
  const { item } = location.state;

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

  const navigate = useNavigate()


  const [dataInvoice, setDataInvoice] = useState(undefined);
  


  const snapTokenHandler = async () => {
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

      const response = await axios.post(`https://panel.goprestasi.com/api/transaction/${item.id}`, {}, config);
      setDataInvoice(response.data);

      // const responseHistory =  await axios.get(`https://panel.goprestasi.com/api/transaction-history`, config);
      // console.log(responseHistory)
  


    } catch (error) {
      console.error('Error fetching detail tryout:', error);
    }
  };




  const MySwal = withReactContent(Swal);



  const swalConfirm = () => {

    MySwal.fire({
      title: "Konfirmasi Pembelian",
      html: <>

        <div className="mb-3"><p>Apakah pembelian kamu sudah benar? Paket tidak dapat diubah setelah ini</p></div>

        <div className="mb-3 border-teal-500 border-2">
          <p className="pt-2">Ringkasan Pembelian</p>
          <div className="m-4 flex justify-between">
            <Typography className="font-normal">Harga Paket</Typography>
            <Typography color="gray-300" className="text-start text-teal-700 font-bold ">
              {item.price_before_discount.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              })},-
            </Typography>
          </div>
          <div className="m-4 -mt-3 flex justify-between">
            <Typography className="font-normal">Diskon {item?.discount ? item?.discount : '0'} %</Typography>
            <Typography color="gray-300" className="text-start text-red-500 font-bold ">
              - {item.price_after_discount.toLocaleString('id-ID', {
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
              {item.price_after_discount.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              })},-
            </Typography>
          </div>
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
        snapTokenHandler();
        // transactionInvoice()
    
      }
    });
  }

  
  useEffect(() => {
  // Efek untuk membuka jendela setelah dataInvoice terisi
    if (dataInvoice?.transaction?.checkout_link) {
      const popupWidth = 600;
      const popupHeight = 600;

      // Menghitung posisi tengah layar
      const leftPosition = (window.innerWidth - popupWidth) / 2;
      const topPosition = (window.innerHeight - popupHeight) / 2;

      const popupOptions = `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`;

      const popupWindow = window.open(`${dataInvoice?.transaction?.checkout_link}`, "MidtransPopup", popupOptions);

      // Memulai polling untuk memeriksa status popup setiap beberapa milidetik
      //saat popup ditutup akan navigasi ke history payment
      const pollPopupStatus = setInterval(() => {
        if (popupWindow.closed) {
          // Jendela popup ditutup, navigasi ke halaman lain
          clearInterval(pollPopupStatus);
          navigate('/dashboard/paymentHistory');
        }
      }, 1000); // Interval polling setiap 1 detik
    }

  }, [dataInvoice]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-8 mt-2">
          <Card className="mt-6 bg-teal-400 w-full">
            <Card className="mx-1 w-full overflow-hidden">

              <div class="absolute right-0 top-0 h-12 w-16">
                <div class="absolute transform rotate-45 bg-red-600 text-center text-white font-semibold py-1 right-[-85px] top-[20px] w-[230px]">
                  {item.access_type}
                </div>
              </div>


              <div className="p-4 border border-teal-800 overflow-hidden rounded-xl">

                <Typography className="font-normal mb-2">{item.name}</Typography>

                <div className="justify-items-start flex gap-2 mb-3">
                  <Typography color="gray-300" className="font-light line-through text-start">
                    {item.price_before_discount.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    })},-
                  </Typography>
                  <Typography color="red" className="font-medium text-start">
                    {item.price_after_discount.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    })},-
                  </Typography>
                </div>

                <ul className="flex flex-col gap-4">
                  {item.packet_detail?.split('<br>').map((desc, indexTrim) => (
                    <li key={indexTrim} className="flex items-center gap-4">
                      <span className="rounded-full border border-teal-800 bg-teal-50 p-1">
                        <CheckIcon />
                      </span>
                      <Typography className="font-normal">{desc.trim()}</Typography>
                    </li>
                  ))}
                </ul>
              </div>

            </Card>
          </Card>
        </div>
        <div className="col-span-4 mt-2 mx-6">
          <Card className="mt-6 bg-teal-400 w-full">
            <Card className="mx-1 w-full">
              <div className="m-4 flex justify-between">
                <Typography className="font-normal">Harga Paket</Typography>
                <Typography color="gray-300" className="text-start text-teal-700 font-bold ">
                  {item.price_before_discount.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  })},-
                </Typography>
              </div>
              <div className="m-4 -mt-3 flex justify-between">
                <Typography className="font-normal">Diskon {item?.discount ? item?.discount : '0'} %</Typography>
                <Typography color="gray-300" className="text-start text-red-500 font-bold ">
                  - {item.price_after_discount.toLocaleString('id-ID', {
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
                  {item.price_after_discount.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  })},-
                </Typography>

              </div>

              {/* <p>Ringkasan Pembelian</p>
              <p>Pastikan nominal transfer tepat berjumlah angka di atas (hingga 3 angka terakhir)</p>
              <p>Apakah pembelian kamu sudah benar?\nMetode pembayaran tidak dapat diubah setelah ini</p> */}
            </Card>
          </Card>

          <Button variant="gradient" color="teal" size="lg" className="w-full mt-4"
            onClick={(() => { swalConfirm() })}>
            Beli Paket
          </Button>

        </div>
      </div>
    </>
  );
}

export default Checkout;
