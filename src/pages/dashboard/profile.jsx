import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Spinner
} from "@material-tailwind/react";

import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useEffect, useState, useRef } from "react";
import { SettingUserData, moreInfo } from "@/data";
import { IoShieldCheckmarkOutline, IoPeopleCircleOutline } from "react-icons/io5";
import { LuClipboardCheck } from "react-icons/lu";
import { CiFaceSmile, CiStar } from "react-icons/ci";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { PiNotePencilDuotone } from "react-icons/pi";
import { FaRegUserCircle, FaWhatsapp } from "react-icons/fa";
import { TbMailHeart } from "react-icons/tb";
import { LiaUniversitySolid } from "react-icons/lia";
import { GiTiedScroll } from "react-icons/gi";
import { RiSchoolLine } from "react-icons/ri";

import Lottie from "react-lottie";
import animateDefault from "@/lotties/defaultprofile"
import feedback from "@/lotties/feedBack"

import axios from "axios";
import Swal from "sweetalert2";

import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'

export function Profile() {

  //LOTTIE OPTION
  const defaultContent = {
    loop: true,
    autoplay: true,
    animationData: animateDefault,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const feedBack = {
    loop: true,
    autoplay: true,
    animationData: feedback,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [preview, setPreview] = useState(undefined)

  const [menuContent, setMenuContent] = useState("default");

  const [dataUser, setDataUser] = useState(null)
  // console.log(dataUser)
  const [moreInfos, setMoreInfo] = useState(undefined)

  const [name, setName] = useState(undefined)
  const [address, setAddress] = useState(undefined)
  const [phone, setPhone] = useState(undefined)
  const [gender, setGender] = useState(undefined)
  const [asalSekolah, setAsalSekolah] = useState(undefined)
  const [saran, setSaran] = useState('')
  const [rating, setRating] = useState(0)



  const fetchData = async () => {

    try {
      const data = await SettingUserData();
      const dataMoreInfo = await moreInfo();
      setDataUser(data)
      setMoreInfo(dataMoreInfo)

      const response = await axios.get(`https://panel.goprestasi.com/api/province`)
      setProvince(response?.data)

      const getUniv = await axios.get(`https://panel.goprestasi.com/api/universities`)
      setDataUniv(getUniv.data.universities)


      setLoading(false);


    } catch (error) {

      console.error('Error Fetcing Data:', error);
    }
  };




  const updateProfile = async () => {

    try {

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found.');
        return null;
      }

      setLoadingUpdate(true)

      const requiredFields = [
        { variable: phone, message: 'No Handphone tidak boleh kosong' },
        { variable: address, message: 'Alamat Harus Diisi' },
        { variable: asalSekolah, message: 'Lengkapi asal sekolah kamu' },
        { variable: Idprovince, message: 'Lengkapi data Provinsi' },
        { variable: Idcity, message: 'Lengkapi data Kabupaten / Kota' },
        { variable: Iddistrict, message: 'Lengkapi data Kecamatan.' },
        { variable: Idvillage, message: 'Lengkapi Data Kelurahan' },
        { variable: IdUniv, message: 'Pilih Universitas Tujuan Kamu' },
        { variable: IdMajor, message: 'Pilih Jurusan Tujuan Kamu' }
      ];

      const missingField = requiredFields.find(field => !field.variable);

      if (missingField) {
        const swalRequire = () => {
          Swal.fire({
            icon: "error",
            title: missingField.message,
          });
        }
        swalRequire()
        setTimeout(() => {
          setLoadingUpdate(false);
        }, 1000);
        return null
      }


      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(`https://panel.goprestasi.com/api/setting/${dataUser?.user.id}`, {
        "name": name,
        "password": dataUser?.user?.password,
        "province_id": Idprovince,
        "city_id": Idcity,
        "district_id": Iddistrict,
        "village_id": Idvillage,
        "address": address,
        "phone_number": phone,
        "gender": gender,
        "is_member": dataUser?.user?.student?.is_member,
        "origin_of_school": asalSekolah,
        "university_id": IdUniv,
        "major_id": IdMajor
      }, config);

      resetState()

      setLoadingUpdate(false)

      const swalSuccess = () => {
        Swal.fire({
          icon: "success",
          title: "Berhasil Update Data",
        });
      }
      swalSuccess()

    } catch (error) {

      console.error('Update data Failed:', error);

    }
  };


  const [province, setProvince] = useState(undefined)
  const [city, setCity] = useState(undefined)
  const [district, setDistrict] = useState(undefined)
  const [village, setVillage] = useState(undefined)

  const [Idprovince, setIdProvince] = useState(undefined)
  const [Idcity, setIdCity] = useState(undefined)
  const [Iddistrict, setIdDistrict] = useState(undefined)
  const [Idvillage, setIdVillage] = useState(undefined)

  const [dataUniv, setDataUniv] = useState(undefined)
  const [dataMajor, setDataMajor] = useState(undefined)

  const [IdUniv, setIdUniv] = useState(undefined)
  const [IdMajor, setIdMajor] = useState(undefined)



  const getCity = async (provinceId) => {
    const response = await axios.get(`https://panel.goprestasi.com/api/city/${provinceId}`)
    setCity(response.data)
  }

  const getDistrict = async (cityId) => {
    const response = await axios.get(`https://panel.goprestasi.com/api/district/${cityId}`)
    setDistrict(response.data)
  }

  const getVillage = async (districtId) => {
    const response = await axios.get(`https://panel.goprestasi.com/api/village/${districtId}`)
    setVillage(response.data)
  }

  const getDataMajorbyId = async (selectedId) => {
    const response = await axios.get(`https://panel.goprestasi.com/api/universities/${selectedId}`)
    setDataMajor(response.data.universities.majors)

  }


  const handleSelectChangeProvince = (selectedOption) => {
    const provinceId = selectedOption;
    setIdProvince(provinceId)
    getCity(provinceId);
  };

  const handleSelectChangeCity = (selectedOption) => {
    const cityId = selectedOption;
    setIdCity(cityId)
    getDistrict(cityId)
  };

  const handleSelectChangeDistrict = (selectedOption) => {
    const districtId = selectedOption;
    setIdDistrict(districtId)
    getVillage(districtId);
  };

  const handleSelectChangeVillage = (selectedOption) => {
    const villageId = selectedOption;
    setIdVillage(villageId)
  };

  const handleSelectChangeUniv = (selectedOption) => {
    const selectedId = selectedOption;
    setIdUniv(selectedId)
    getDataMajorbyId(selectedId);
  };

  const handleSelectChangeMajor = (selectedOption) => {
    const selectedId = selectedOption;
    setIdMajor(selectedId)
  };


  useEffect(() => {
    fetchData();

  }, []);

  const resetState = () => {
    setDataUser(null);
    fetchData();
  };



  //Update Photo

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Membuka dialog pemilihan file saat tombol ditekan
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (event) => {
    // Handle file yang dipilih
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

      const selectedFile = event.target.files[0];
      setPreview(URL.createObjectURL(selectedFile))

      setLoadingUpdate(true)
      const form = new FormData()
      form.append('image', selectedFile)
      // console.log(file)
      const response = await axios.post(`https://panel.goprestasi.com/api/setting/image/${dataUser?.user.id}`, form, config);
      // console.log(response)

      resetState()

      setLoadingUpdate(false)

    } catch (error) {

      console.error('Update Photo Failed:', error);

    }

  };


  const handleSendFeedback = async () => {
    // Handle file yang dipilih
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

      const response = await axios.put(`https://panel.goprestasi.com/api/setting/suggestion/${dataUser.user.id}`, {
        "suggestion": saran
      }, config);
      if (response.status === 200) {
        const swalRequire = () => {
          Swal.fire({
            icon: "success",
            title: "Berhasil Mengirim Saran / Masukan",
          });
        }
        swalRequire()
      }

    } catch (error) {

      console.error('Update Photo Failed:', error);

    }

  };


  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  if (loading) {
    return <div className="mb-12 flex justify-center h-96">
      <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
        <Spinner className="h-16 w-16 text-gray-900/50" />
      </div>
    </div>;
  }




  return (
    <>

      <div>

        <Card className=" mt-3  mb-4  border border-blue-gray-100 bg-teal-500 flex">
          <CardBody className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {dataUser === null ? (
                <div className="mb-12 flex justify-center h-30">
                  <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
                    <Spinner className="h-16 w-16 text-gray-900/50" />
                  </div>
                </div>
              ) : (
                <div className="flex col-span-2 items-center justify-center md:justify-start mb-3">
                  {preview ? (
                    <Avatar
                      src={preview}
                      alt="bruce-mars"
                      size="xxl"
                      variant="rounded"
                      className="rounded-md"
                    />) : (
                    <Avatar
                      src={dataUser?.user?.image}
                      alt="bruce-mars"
                      size="xxl"
                      variant="rounded"
                      className="rounded-md"
                    />
                  )}
                  <button onClick={handleButtonClick}>
                    <PiNotePencilDuotone color="white" className="h-6 w-6 mt-20" />
                  </button>

                  <input
                    className='form-control'
                    name="myfile"
                    accept="image/*"
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />

                </div>
              )}
              <div className="col-span-10">
                <div className="mb-3 text-white mt-2 md:mt-0 flex justify-between items-center text-sm md:text-base" >
                  <h1>Detail Personal Info</h1>

                  <button className="flex gap-1 border-amber-400 bg-amber-400 p-2 rounded-md text-xs md:text-xs font-bold items-center"
                    onClick={(() => { setMenuContent("ubahprofile") })}
                  >
                    <PiNotePencilDuotone color="white" className="h-2 w-2 md:h-6 md:w-6 text-xs" />
                    <h1>Ubah Data Diri</h1>
                  </button>

                </div>
                {dataUser === null ? (
                  <div className="mb-12 flex justify-center h-30">
                    <div className='items-center justify-center sm:flex w-full flex-1 sm:flex-1'>
                      <Spinner className="h-16 w-16 text-gray-900/50" />
                    </div>
                  </div>
                ) : (

                  <div className=" border-white border-2 rounded-md text-white text-sm md:text-md grid md:grid-cols-12">
                    <div className="col-span-12 md:col-span-4 m-1">
                      <div className="flex gap-2 items-center m-1">
                        <FaRegUserCircle /><h1>{dataUser?.user?.name}</h1>
                      </div>
                      <div className="flex gap-2 items-center m-1">
                        <TbMailHeart /><h1>{dataUser?.user?.email}</h1>
                      </div>
                      <div className="flex gap-2 items-center m-1">
                        <FaWhatsapp /><h1>{dataUser?.user?.student?.phone_number ? dataUser?.user?.student?.phone_number : '-'}</h1>
                      </div>
                      <hr className="visible md:invisible mt-3 mb-2 md:mt-0 md:mb-0" />
                    </div>

                    <div className="col-span-8 text-sm md:text-md">

                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="col-span-4 flex gap-2 items-center m-1">
                          <LiaUniversitySolid /><h1>Kampus Tujuan </h1>
                        </div>
                        <div className="col-span-8 flex items-center m-1">
                          <h1>: {dataUser?.user?.student?.university?.name ? dataUser?.user?.student?.university?.name : '-'}</h1>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="col-span-4 flex gap-2 items-center m-1">
                          <GiTiedScroll /><h1>Target Jurusan </h1>
                        </div>
                        <div className="col-span-8 flex items-center m-1">
                          <h1>: {dataUser?.user?.student?.major?.name ? dataUser?.user?.student?.major?.name : '-'}</h1>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="col-span-4 flex gap-2 items-center m-1">
                          <RiSchoolLine /><h1>Asal Sekolah </h1>
                        </div>
                        <div className="col-span-8 flex items-center m-1">
                          <h1>: {dataUser?.user?.student?.origin_of_school ? dataUser?.user?.student?.origin_of_school : '-'}</h1>
                        </div>
                      </div>
                    </div>

                  </div>

                )}
              </div>
            </div>
          </CardBody>

        </Card>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-12">

        <div className="col-span-4 -mt-2 order-last md:order-first">
          <Card className="mb-6 border border-blue-gray-100">
            <CardBody className="p-4">
              <div>
                <h1 className="text-teal-500 font-bold">Informasi Lainnya</h1>
              </div>
              <div>
                <button className="w-full" onClick={(() => { setMenuContent("kebijakan") })}>
                  <Card className="mt-2 w-full border border-blue-gray-400">
                    <CardBody className="flex justify-between items-center gap-3">
                      <IoShieldCheckmarkOutline className="h-5 w-5" />
                      <Typography color="blue-gray" className="text-sm font-bold">
                        Kebijakan Privasi
                      </Typography>
                      <ChevronRightIcon className="h-5 w-5" />
                    </CardBody>
                  </Card>
                </button>
              </div>
              <div>
                <button className="w-full" onClick={(() => { setMenuContent("s&k") })}>
                  <Card className="mt-2 w-full border border-blue-gray-400">
                    <CardBody className="flex justify-between items-center gap-3">
                      <LuClipboardCheck className="h-5 w-5" />
                      <Typography color="blue-gray" className="text-sm font-bold">
                        Syarat & Ketentuan
                      </Typography>
                      <ChevronRightIcon className="h-5 w-5" />
                    </CardBody>
                  </Card>
                </button>
              </div>
              <div>
                <button className="w-full" onClick={(() => { setMenuContent("aboutus") })}>
                  <Card className="mt-2 w-full border border-blue-gray-400">
                    <CardBody className="flex justify-between items-center gap-3">
                      <IoPeopleCircleOutline className="h-5 w-5" />
                      <Typography color="blue-gray" className="text-sm font-bold">
                        Tentang Kami
                      </Typography>
                      <ChevronRightIcon className="h-5 w-5" />
                    </CardBody>
                  </Card>
                </button>
              </div>
              <div>
                <button className="w-full" onClick={(() => { setMenuContent("s&m") })}>
                  <Card className="mt-2 w-full border border-blue-gray-400">
                    <CardBody className="flex justify-between items-center gap-3">
                      <CiFaceSmile className="h-5 w-5" />
                      <Typography color="blue-gray" className="text-sm font-bold">
                        Saran & Masukan
                      </Typography>
                      <ChevronRightIcon className="h-5 w-5" />
                    </CardBody>
                  </Card>
                </button>
              </div>
              {/* <div>
                <button className="w-full" onClick={(() => { setMenuContent("review") })}>
                  <Card className="mt-2 w-full border border-blue-gray-400">
                    <CardBody className="flex justify-between items-center gap-3">
                      <CiStar className="h-5 w-5" />
                      <Typography color="blue-gray" className="text-sm font-bold">
                        Review Kami
                      </Typography>
                      <ChevronRightIcon className="h-5 w-5" />
                    </CardBody>
                  </Card>

                </button>
              </div> */}
            </CardBody>
          </Card>
        </div>


        <div className="col-span-8 -mt-2 mx-3">
          {menuContent === "default" ? (

            <div className="flex flex-col items-center justify-center text-teal-500 text-lg font-bold">
              <h1>Silahkan Pilih Menu Terlebih Dahulu</h1>
              <Lottie
                options={defaultContent}
                height={400}
                width={400}
              />
            </div>

          ) : menuContent === "ubahprofile" ? (
            <Card className="mb-6  border border-blue-gray-100">
              <CardBody className="p-4">
                <h1 className="text=base font-bold text-teal-500">Ubah Profil</h1>
                <form className="mt-2 mb-2 flex items-center justify-center">
                  <div className="m-4 flex flex-col gap-6 w-full">
                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Nama
                    </Typography>
                    <Input
                      size="lg"
                      placeholder={dataUser?.user?.name}
                      className=""
                      label={dataUser?.user?.name ?? "Name"}

                      onChange={((item) => { setName(item.target.value) })}

                    />

                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Gender
                    </Typography>

                    <Select size="md" label={!dataUser?.user?.student?.gender ? "Pilih Gender"
                      : dataUser?.user?.student?.gender === "M" ? "Laki - Laki" : "Perempuan"} onChange={(value) => setGender(value)}
                      error={!dataUser?.user?.student?.gender && !gender ? true : false}
                    >
                      <Option value="M">Laki-Laki</Option>
                      <Option value="F">Perempuan</Option>
                    </Select>

                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      No. HP/ No.Telpon
                    </Typography>
                    <Input
                      size="lg"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onInput={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value)) {
                          e.target.value = value.replace(/[^0-9]/g, '');
                        }
                      }}
                      className="transform origin-bottom"
                      error={!dataUser?.user?.student?.phone_number && !phone ? true : false}
                      label={dataUser?.user?.student?.phone_number ?? "phone number"}
                      onChange={((item) => { setPhone(item.target.value) })}
                    />
                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Address
                    </Typography>
                    <Input
                      size="lg"
                      className="transform origin-bottom"
                      error={!dataUser?.user?.student?.address && !address ? true : false}
                      label={dataUser?.user?.student?.address ?? "Alamat"}
                      onChange={((item) => { setAddress(item.target.value) })}
                    />
                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Asal Sekolah
                    </Typography>
                    <Input
                      size="lg"
                      className="transform origin-bottom"
                      error={!dataUser?.user?.student?.origin_of_school && !asalSekolah ? true : false}
                      label={dataUser?.user?.student?.origin_of_school ?? "Asal Sekolah"}
                      onChange={((item) => { setAsalSekolah(item.target.value) })}
                    />
                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Provinsi
                    </Typography>
                    <Select style={{ maxHeight: '50px' }} className="transform origin-bottom"
                      error={!dataUser?.user?.student?.province && !Idprovince ? true : false}
                      size="md" label={!dataUser?.user?.student?.province ? "Pilih Provinsi" : dataUser?.user?.student?.province.name} onChange={(value) => handleSelectChangeProvince(value)}>
                      {/* value dikirim sebagai parameter funtion handle select */}
                      {province?.map((item, key) => (
                        //value diambil dari id univ
                        <Option key={key} value={item.id}>
                          {item.name}
                        </Option>

                      ))}
                    </Select>


                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Kota
                    </Typography>
                    <Select style={{ maxHeight: '50px' }} className="transform origin-bottom" size="md"
                      label={!dataUser?.user?.student?.city ? "Pilih Kota" : dataUser?.user?.student?.city?.name}
                      error={!dataUser?.user?.student?.city && !Idcity ? true : false}
                      onChange={(value) => handleSelectChangeCity(value)}>
                      {!city ? (
                        <p>Select Provinsi Terlebih Dahulu</p>
                      ) : (
                        city?.map((item, key) => (
                          <Option key={key} value={item.id}>
                            {item.name}
                          </Option>
                        ))
                      )}
                    </Select>

                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Kecamatan
                    </Typography>
                    <Select style={{ maxHeight: '50px' }} className="transform origin-bottom" size="md"
                      label={!dataUser?.user?.student?.district ? "Pilih Kecamatan" : dataUser?.user?.student?.district?.name}
                      error={!dataUser?.user?.student?.district && !Iddistrict ? true : false}
                      onChange={(value) => handleSelectChangeDistrict(value)}>
                      {!district ? (
                        <p>Select Kota Terlebih Dahulu</p>
                      ) : (
                        district?.map((item, key) => (
                          <Option key={key} value={item.id}>
                            {item.name}
                          </Option>
                        ))
                      )}
                    </Select>

                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Desa / Kelurahan
                    </Typography>
                    <Select style={{ maxHeight: '50px' }} className="transform origin-bottom" size="md"
                      label={!dataUser?.user?.student?.village ? "Pilih Kelurahan" : dataUser?.user?.student?.village?.name}
                      error={!dataUser?.user?.student?.village && !Idvillage ? true : false}
                      onChange={(value) => handleSelectChangeVillage(value)}>
                      {!village ? (
                        <p>Select Kecamatan Terlebih Dahulu</p>
                      ) : (
                        village?.map((item, key) => (
                          <Option key={key} value={item.id}>
                            {item.name}
                          </Option>
                        ))
                      )}
                    </Select>

                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Universitas Tujuan
                    </Typography>
                    <Select style={{ maxHeight: '50px' }} className="transform origin-bottom" size="md"
                      label={!dataUser?.user?.student?.university ? "Pilih Universitas" : dataUser?.user?.student?.university?.name}
                      error={!dataUser?.user?.student?.university && !IdUniv ? true : false}
                      onChange={(value) => handleSelectChangeUniv(value)}>
                      {/* value dikirim sebagai parameter funtion handle select */}
                      {dataUniv?.map((item, key) => (
                        //value diambil dari id univ

                        <Option key={key} value={item.id}>
                          {item.universitas}
                        </Option>

                      ))}
                    </Select>

                    <Typography color="blue-gray" className="-mb-3 text-sm font-bold">
                      Target Jurusan
                    </Typography>
                    <Select style={{ maxHeight: '50px' }} className="transform origin-bottom" size="md"
                      label={!dataUser?.user?.student?.major ? "Pilih Jurusan" : dataUser?.user?.student?.major?.name}
                      error={!dataUser?.user?.student?.major && !IdMajor ? true : false}
                      onChange={(value) => handleSelectChangeMajor(value)}>
                      {!dataMajor ? (
                        <p>Select Univ First</p>
                      ) : (
                        dataMajor?.map((item, key) => (
                          <Option key={key} value={item.id}>
                            {item.major}
                          </Option>
                        ))
                      )}
                    </Select>
                    <div className="flex items-center justify-center">
                      <Button className="w-full md:w-1/2 flex gap-3 items-center justify-center" color="teal" variant="gradient"
                        onClick={(() => { updateProfile(); setLoadingUpdate(true) })}
                      >
                        <span className="text-xs">Simpan Perubahan</span>
                        {loadingUpdate ? (<Spinner className="h-6 w-6" color="amber" />) : null}
                      </Button>
                    </div>
                  </div>
                </form>

              </CardBody>
            </Card>
          ) : menuContent === "kebijakan" ? (
            <Card className="mb-6  border border-blue-gray-100">
              <CardBody className="p-4">
                <h1 className="text=base font-bold text-teal-500">Kebijakan Dan Privasi</h1>

                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.privacy.content[0]}</p>
                </div>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.privacy.content[1]}</p>
                </div>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.privacy.content[2]}</p>
                </div>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.privacy.content[3]}</p>
                </div>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.privacy.content[4]}</p>
                </div>

              </CardBody>
            </Card>
          ) : menuContent === "s&k" ? (
            <Card className="mb-6  border border-blue-gray-100">
              <CardBody className="p-4">
                <h1 className="text=base font-bold text-teal-500">Syarat & Ketentuan</h1>

                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.message[0]}</p>
                </div>

                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <p>{moreInfos.message[1]}</p>
                </div>

                <h1 className="text=base font-bold text-blue-900">Pendaftaran</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">

                  <div className="flex gap-2 mt-3">
                    <p>1.</p>
                    <p>{moreInfos?.register?.step[0]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>2.</p>
                    <p>{moreInfos?.register?.step[1]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>3.</p>
                    <p>{moreInfos?.register?.step[2]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>4.</p>
                    <p>{moreInfos?.register?.step[3]}</p>
                  </div>

                </div>

                <h1 className="text=base font-bold text-blue-900">Akun Peserta</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">

                  <div className="flex gap-2 mt-3">
                    <p>1.</p>
                    <p>{moreInfos?.account.step[0]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>2.</p>
                    <p>{moreInfos?.account.step[1]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>3.</p>
                    <p>{moreInfos?.account.step[2]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>4.</p>
                    <p>{moreInfos?.account.step[3]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>4.</p>
                    <p>{moreInfos?.account.step[4]}</p>
                  </div>
                </div>

                <h1 className="text=base font-bold text-blue-900">Profile Peserta</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className="flex gap-2 mt-3">
                    <p>1.</p>
                    <p>{moreInfos?.profile.step[0]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>2.</p>
                    <p>{moreInfos?.profile.step[1]}</p>
                  </div>
                </div>

                <h1 className="text=base font-bold text-blue-900">Pembayaran</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className="flex gap-2 mt-3">
                    <p>1.</p>
                    <p>{moreInfos?.payment.step[0]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>2.</p>
                    <p>{moreInfos?.payment.step[1]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>3.</p>
                    <p>{moreInfos?.payment.step[2]}</p>
                  </div>
                </div>

                <h1 className="text=base font-bold text-blue-900">Perilaku Peserta</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className="flex gap-2 mt-3">
                    <p>1.</p>
                    <p>{moreInfos?.rules.step[0]}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <p>2.</p>
                    <p>{moreInfos?.rules.step[1]}</p>
                  </div>
                </div>

                <h1 className="text=base font-bold text-blue-900">Penggunaan Informasi</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className="flex gap-2 mt-3">
                    <p>{moreInfos?.info?.step[0]}</p>
                  </div>
                </div>

              </CardBody>
            </Card>
          ) : menuContent === "aboutus" ? (
            <Card className="mb-6  border border-blue-gray-100">
              <CardBody className="p-4">
                <h1 className="text=base font-bold text-teal-500">Tentang Kami</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className="flex gap-2 mt-3">
                    <p>{moreInfos?.about.moto}</p>
                  </div>
                </div>

                <h1 className="text=base font-bold text-blue-900">Visi</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className="flex gap-2 mt-3">
                    <p>“{moreInfos?.about.vision}“</p>
                  </div>
                </div>

                <h1 className="text=base font-bold text-blue-900">Our Value #SahabatPrestasi</h1>
                <div className="mb-4 mt-4 mx-4 mr-4 text-justify">
                  <div className=" mt-3">
                    <p className="mb-3 font-bold">Keep The Faith</p>
                    <p>{moreInfos?.about.value.step[0]}</p>
                  </div>
                  <div className=" mt-3">
                    <p className="mb-3 font-bold">Growth Up Together</p>
                    <p>{moreInfos?.about.value.step[1]}</p>
                  </div>
                  <div className=" mt-3">
                    <p className="mb-3 font-bold">Teaching Is Learning And Learning Is Teaching</p>
                    <p>{moreInfos?.about.value.step[2]}</p>
                  </div>
                </div>

              </CardBody>
            </Card>
          ) : menuContent === "s&m" ? (
            <Card className="mb-6  border border-blue-gray-100">
              <CardBody className="p-4">

                <div className="flex flex-col items-center justify-center text-teal-500 text-lg font-bold">
                  <h1>Saran dan masukan</h1>
                  <Lottie
                    options={feedBack}
                    height={80}
                    width={80}
                  />

                  <div className="w-96">
                    <Textarea onChange={((item) => { setSaran(item.target.value) })} label="Message" />
                  </div>

                  <div>
                    <Button color="teal" variant="gradient" onClick={(() => { handleSendFeedback() })}>Kirim</Button>
                  </div>

                </div>
              </CardBody>
            </Card>
          ) : null}
          
          {/* menuContent === "review" ? (
            <Card className="mb-6  border border-blue-gray-100">
              <CardBody className="p-4">
                <CardBody className="p-4 grid justify-center text-center">
                  <h1 className="text-xl font-semibold mb-4">Review Kami</h1>
                  <Rating style={{ maxWidth: 250 }} value={rating} onChange={setRating} />
                </CardBody>
              </CardBody>
            </Card>
          ) :  */}



        </div>

      </div >
    </>
  );
}

export default Profile;
