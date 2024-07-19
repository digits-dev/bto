import React, { useState, useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import InputWithLogo from "../../Components/Forms/InputWithLogo";

const LoginPage = () => {
    const { errors } = usePage().props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post(
            "login-save",
            {
                email,
                password,
            },
            {
                onError: (errors) => {
                    if (errors.email) {
                        setEmail("");
                    }
                    if (errors.password) {
                        setPassword("");
                    }
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <div className=" bg-slate-800 h-screen flex flex-col items-center justify-center p-5">
            <div className="flex flex-col justify-center items-center space-y-1 mb-5">
                <div className="flex mb-3">
                    <img
                        src="/images/login-page/digits-logo.png"
                        className="w-[70px] h-[70px]"
                    />
                </div>
                <p className="text-white font-nunito-sans font-bold text-[20px] text-center">
                    Template
                </p>
            </div>
            <div className="bg-white rounded-lg max-w-lg w-full font-nunito-sans">
                <p className="p-4 border-b-2 text-center font-bold">Login</p>
                <form onSubmit={handleSubmit}>
                    <div className="py-2 px-5">
                        {/* EMAIL */}
                        <InputWithLogo
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            logo="images/login-page/email-icon.png"
                            placeholder="Enter Email"
                            marginTop={2}
                        />
                        {errors.email && (
                            <div className="font-nunito-sans text-sm text-start my-2 font-bold text-red-500">
                                {errors.email}
                            </div>
                        )}
                        {/* PASSWORD */}
                        <InputWithLogo
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            logo="images/login-page/password-icon.png"
                            placeholder="Enter Password"
                            marginTop={2}
                        />
                        {errors.password && (
                            <div className="font-nunito-sans text-sm text-start my-3 font-bold text-red-500">
                                {errors.password}
                            </div>
                        )}
                        {errors.no_datas && (
                            <div className="font-nunito-sans text-sm text-center my-3 font-bold text-red-500">
                                {errors.no_datas}
                            </div>
                        )}
                        {errors.acc_deact && (
                            <div className="font-nunito-sans text-sm text-center my-3 font-bold text-red-500">
                                {errors.acc_deact}
                            </div>
                        )}

                        <div className="font-nunito-sans flex space-x-1 text-sm justify-center my-5">
                            <p>Forgot Password?</p>
                            <Link
                                href="reset_password"
                                className="text-red-500 font-bold"
                            >
                                Click here
                            </Link>
                        </div>
                    </div>
                    <div className="p-4 border-t-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-secondary w-full text-white font-nunito-sans p-[12px] font-bold rounded-[10px] hover:opacity-70"
                        >
                            {loading ? "Please wait..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
