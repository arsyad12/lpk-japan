import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";

export function ChangePass() {

    const location = useLocation();
    const { email } = location.state;

    const [password, setPassword] = useState(null);

    const navigate = useNavigate()

    const handleResetPass = async () => {

        event.preventDefault();

        try {
            const response = await axios.post(`https://panel.goprestasi.com/api/password/reset`, {
                "email": email,
                "password": password
            });
            if (response) {
                navigate(`/auth/sign-in`);
            }
        } catch {
            setError('gagal reset');
        }
    };



    return (

        <section className="p-4 flex gap-1">
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <img
                        src="/img/logo.png"
                        alt="bruce-mars"
                        size="xl"
                        className="w-1/3 mb-4 object-center mx-auto"
                    />
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Masukkan Password Baru Kamu</Typography>
                </div>

                <form onSubmit={handleResetPass} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Password
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="**********"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            onChange={(e) => setPassword(e.target.value)}
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>

                    <Button type="submit" className="mt-6" color="teal" fullWidth >
                        Update Password
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
    )
}

export default ChangePass;
