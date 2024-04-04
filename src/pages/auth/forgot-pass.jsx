import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Spinner
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import axios from "axios";

import { authService } from "@/data";

export function ForgotPass() {

    const [email, setEmail] = useState(null);
    // console.log(email)
    const [otp, setOtp] = useState('');
    // console.log(otp)
    const [loadingButton, setLoadingButton] = useState(false);

    const navigate = useNavigate();

    const [succes, setSuccess] = useState(null)


    const handleSendOTP = async (event) => {

        event.preventDefault();

        try {
            setLoadingButton(true)
            const success = await authService.resetPass(email);
            if (success) {
                setSuccess(success);
                setLoadingButton(false)

            } else {
                setError('Gagal mengirim otp'); // Reset pesan kesalahan sebelum menetapkannya
            }
        } catch {
            setError('gagal mengirim otp');
        }
    };


    const handleClickDiscussion = (email) => {
        navigate(`/auth/change-pass`, { state: { email } });
    }

    const validateOTP = async () => {
        try {
            setLoadingButton(true)
            const response = await axios.post(`https://panel.goprestasi.com/api/validation/otp`, {
                "email": email,
                "otp": otp
            });
            if (response.status === 200) {
                handleClickDiscussion(email)
                setLoadingButton(false)
            }
        } catch (error) {
            console.error('canot post otp:', error);
        }
    };



    return (
        !succes ? (
            <section className="p-4 flex gap-1">
                <div className="w-full lg:w-3/5 mt-24">
                    <div className="text-center">
                        <img
                            src="/img/logo.png"
                            alt="bruce-mars"
                            size="xl"
                            className="w-1/3 mb-4 object-center mx-auto"
                        />
                        <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Masukkan email kamu untuk mereset password</Typography>
                    </div>

                    <form onSubmit={handleSendOTP} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                Email
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setEmail(e.target.value)}
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>

                        <Button type="submit" className="mt-6  flex gap-2 items-center justify-center" color="teal" fullWidth >
                            <span>Request OTP</span> {loadingButton ? (<Spinner className="mx-3 h-4 w-4" color="amber" />) : null}
                        </Button>
                    </form>

                </div>
                <div className="w-2/6 h-full hidden lg:block mt-10">
                    <img
                        src="/img/forgotpass.png"
                        className="h-full w-full object-cover rounded-3xl"
                    />
                </div>

            </section>
        ) :


            <div className="bg-teal-500">
                <div className="flex h-screen w-screen justify-center items-center overflow-hidden">

                    <Card className="m-56 flex items-center justify-center">

                  

                        <div className=" mx-24 flex flex-col items-center justify-center overflow-hidden">

                        <img
                            src="/img/logo.png"
                            alt="bruce-mars"
                            size="xl"
                            className="w-1/3 mb-8 mt-4 object-center mx-auto"
                        />
                        <Typography color="white" className="-mt-4 font-bold mb-5 text-teal-500">Masukan Kode OTP yang sudah dikirm ke email anda</Typography>

                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span className="mx-3"> - </span>}
                                inputStyle={{
                                    borderColor: 'teal',
                                    borderWidth: 3,
                                    borderRadius: 10,
                                    width: '10vw',
                                    height: '10vw',
                                    maxWidth: '80px',
                                    maxHeight: '80px',
                                }}
                                renderInput={(props) => <input {...props} />}
                            />
                        </div>

                        <div className="mb-10">
                            <Button variant="gradient" color="teal" className="w-full mt-4 flex gap-2 items-center justify-center" loading={true} onClick={validateOTP}>
                                <span>Verifikasi</span> {loadingButton ? (<Spinner className="mx-3 h-4 w-4" color="amber" />) : null}
                            </Button>
                        </div>


                    </Card>

                </div>
            </div>



    );
}

export default ForgotPass;
