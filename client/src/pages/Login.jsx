import React from 'react';

const Login = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark text-[#0e141b] dark:text-slate-50 group/design-root overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full p-6 lg:p-10">
                <div className="flex items-center gap-4 text-current">
                    <div className="size-6">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Luxe</h2>
                </div>
            </div>
            <div className="layout-container flex h-full grow flex-col justify-center px-6 py-12 lg:px-8">
                <div className="layout-content-container flex w-full max-w-sm flex-col items-center">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#0e141b] dark:text-slate-50 text-center pb-3 pt-6">Bienvenido de nuevo</h1>
                    <div className="w-full mt-8">
                        <div className="flex flex-col gap-6">
                            <label className="flex flex-col w-full">
                                <p className="text-sm font-medium leading-normal pb-2 dark:text-slate-300">Correo Electrónico</p>
                                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#d0dbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark h-12 px-4 text-base font-normal leading-normal placeholder:text-[#4e7397] dark:placeholder:text-slate-500 focus:border-primary dark:focus:border-primary focus:ring-primary/20 focus:ring-2 dark:text-slate-50" placeholder="tu@ejemplo.com" defaultValue="" />
                            </label>
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-baseline pb-2">
                                    <p className="text-sm font-medium leading-normal dark:text-slate-300">Contraseña</p>
                                    <a className="text-sm font-medium leading-normal text-primary hover:text-primary/80 underline" href="#">¿Olvidaste tu contraseña?</a>
                                </div>
                                <div className="relative w-full">
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#d0dbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark h-12 pr-12 pl-4 text-base font-normal leading-normal placeholder:text-[#4e7397] dark:placeholder:text-slate-500 focus:border-primary dark:focus:border-primary focus:ring-primary/20 focus:ring-2 dark:text-slate-50" placeholder="Ingresa tu contraseña" type="password" defaultValue="" />
                                    <button className="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-[#4e7397] dark:text-slate-500" type="button">
                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                    </button>
                                </div>
                            </label>
                        </div>
                        <button className="mt-8 flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-slate-50 text-base font-bold leading-normal tracking-wide hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                            <span className="truncate">Iniciar Sesión</span>
                        </button>
                    </div>
                    <p className="mt-10 text-center text-sm text-[#4e7397] dark:text-slate-400">
                        ¿No tienes una cuenta?
                        <a className="font-semibold leading-6 text-primary hover:text-primary/80" href="#">Regístrate</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
