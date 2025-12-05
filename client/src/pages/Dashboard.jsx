import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = ({ theme, onToggleTheme }) => {
    return (
        <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-slate-50">
            {/* SideNavBar */}
            <aside className="flex w-64 flex-col bg-white dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700/50 sticky top-0 h-screen">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-3">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="Boutique Logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfbhilQrBbu12o2adB75tI8KvRI7dUAW5UwX63XfHengdSct1ZaRqDOftXlUE-w3vQtZIvq6A93E0bJgGR9U6wEJq0Ld0abSqYna-gP4xL-1IdSY5ocHHWb-IkJ4xnwdvtIIbiNLGRQVmoEgV1BpDhDhGPQkHFtzxBMxnqvHy3NQxOjprESw9IPYSFqPIF5amjNPTtmH7SzODNirgSueulPekedv2JTab8QLgfHYwtUiMHpSmnKdIqU4wi_s5sJxUi-5QtxWQeodLjM")' }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-gray-900 dark:text-white text-base font-bold leading-normal">Chic Boutique</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">por Jane Doe</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2 mt-4">
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-300" href="#">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                            <p className="text-sm font-semibold leading-normal">Panel</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">shopping_bag</span>
                            <p className="text-sm font-medium leading-normal">Productos</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">receipt_long</span>
                            <p className="text-sm font-medium leading-normal">Ordenes</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">group</span>
                            <p className="text-sm font-medium leading-normal">Clientes</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">analytics</span>
                            <p className="text-sm font-medium leading-normal">Reportes</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">settings</span>
                            <p className="text-sm font-medium leading-normal">Configuración</p>
                        </a>
                    </nav>
                </div>
                <div className="flex flex-col gap-4 mt-auto">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Agregar Producto</span>
                    </button>
                    <div className="flex flex-col gap-1">
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg" href="#">
                            <span className="material-symbols-outlined">logout</span>
                            <p className="text-sm font-medium leading-normal">Cerrar Sesión</p>
                        </a>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Header: Page Heading + Search Bar */}
                    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex min-w-72 flex-col gap-1">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Panel</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">¡Bienvenida, Jane! Aquí tienes un resumen del rendimiento de tu boutique.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex-grow max-w-md">
                                <label className="flex flex-col min-w-40 h-12 w-full">
                                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                        <div className="text-gray-500 dark:text-gray-400 flex border border-r-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center pl-4 rounded-l-lg">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-l-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full placeholder:text-gray-400 px-4 rounded-l-none text-base font-normal leading-normal" placeholder="Buscar órdenes, productos..." defaultValue="" />
                                    </div>
                                </label>
                            </div>
                            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                        </div>
                    </header>
                    {/* Stats Section */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                            <p className="text-gray-600 dark:text-gray-300 text-base font-medium leading-normal">Ventas de Hoy</p>
                            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">$1,234.56</p>
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+5.2%</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                            <p className="text-gray-600 dark:text-gray-300 text-base font-medium leading-normal">Ingresos (Mes)</p>
                            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">$15,890.21</p>
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium leading-normal">-1.8%</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                            <p className="text-gray-600 dark:text-gray-300 text-base font-medium leading-normal">Nuevas Ordenes</p>
                            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">24</p>
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+12 desde ayer</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                            <p className="text-gray-600 dark:text-gray-300 text-base font-medium leading-normal">Alertas de Stock Bajo</p>
                            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">8</p>
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+2 nuevas alertas</p>
                        </div>
                    </section>
                    {/* Main Dashboard Content: Chart + Recent Orders */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sales Chart */}
                        <div className="lg:col-span-2 flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="text-gray-900 dark:text-white text-lg font-semibold leading-normal">Resumen de Ventas</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Ingresos de las últimas 4 semanas.</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal">Este Mes</p>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+12.5%</p>
                                </div>
                            </div>
                            <div className="flex min-h-[300px] flex-1 flex-col justify-end gap-8 py-4">
                                <svg className="h-full" fill="none" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#paint0_linear_chart)"></path>
                                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#1773cf" strokeLinecap="round" strokeWidth="3"></path>
                                    <defs>
                                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chart" x1="236" x2="236" y1="1" y2="149">
                                            <stop stopColor="#1773cf" stopOpacity="0.2"></stop>
                                            <stop offset="1" stopColor="#1773cf" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="flex justify-around">
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Sem 1</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Sem 2</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Sem 3</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Sem 4</p>
                                </div>
                            </div>
                        </div>
                        {/* Recent Orders Table */}
                        <div className="lg:col-span-1 flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                            <h3 className="text-gray-900 dark:text-white text-lg font-semibold leading-normal">Órdenes Recientes</h3>
                            <div className="overflow-x-auto -mx-6">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead className="border-b border-gray-200 dark:border-gray-700 font-medium">
                                        <tr>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">ID Orden</th>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">Cliente</th>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">Total</th>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34567</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Olivia Martin</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$125.50</td>
                                            <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Enviado</span></td>
                                        </tr>
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34566</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Liam Johnson</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$89.00</td>
                                            <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">Procesando</span></td>
                                        </tr>
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34565</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Ava Williams</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$210.00</td>
                                            <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Enviado</span></td>
                                        </tr>
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34564</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Noah Brown</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$45.75</td>
                                            <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-300">Cancelado</span></td>
                                        </tr>
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34563</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Emma Jones</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$350.20</td>
                                            <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Enviado</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
