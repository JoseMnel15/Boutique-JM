import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const { theme, onToggleTheme } = useOutletContext();

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            {/* Header: Page Heading + Search Bar */}
            <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Panel</p>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">¡Bienvenid@, {user?.fullName || user?.username}! Aquí tienes un resumen del rendimiento de tu boutique.</p>
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

            {/* Main Dashboard Content: Top Products + Recent Orders */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-900 dark:text-white text-lg font-semibold leading-normal">Top productos</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Los 5 más vendidos este mes.</p>
                        </div>
                        <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actualizado hoy</span>
                    </div>
                    <div className="overflow-x-auto -mx-6">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b border-gray-200 dark:border-gray-700 font-medium">
                                <tr>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Producto</th>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Unidades</th>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Ingresos</th>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Margen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {[
                                    { name: 'Vestido Luna', units: 124, revenue: '$3,720', margin: '42%' },
                                    { name: 'Blusa Aura', units: 98, revenue: '$1,960', margin: '38%' },
                                    { name: 'Jeans Indigo', units: 86, revenue: '$2,150', margin: '35%' },
                                    { name: 'Bolso Terra', units: 64, revenue: '$4,100', margin: '48%' },
                                ].map((p) => (
                                    <tr key={p.name}>
                                        <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                                        <td className="whitespace-nowrap px-6 py-3 text-gray-600 dark:text-gray-300">{p.units}</td>
                                        <td className="whitespace-nowrap px-6 py-3 text-gray-600 dark:text-gray-300">{p.revenue}</td>
                                        <td className="whitespace-nowrap px-6 py-3 text-gray-600 dark:text-gray-300">{p.margin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Recent Orders Table */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                    <h3 className="text-gray-900 dark:text-white text-lg font-semibold leading-normal">Órdenes Recientes</h3>
                    <div className="overflow-x-auto -mx-6">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b border-gray-200 dark:border-gray-700 font-medium">
                                <tr>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">ID Orden</th>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">Producto</th>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">Total</th>
                                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs" scope="col">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34567</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Playera</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$125.50</td>
                                    <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Enviado</span></td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34566</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Playera</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$89.00</td>
                                    <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">Procesando</span></td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34565</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Playera</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$210.00</td>
                                    <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Enviado</span></td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34564</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Playera</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$45.75</td>
                                    <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-300">Cancelado</span></td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">#34563</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">Playera</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">$350.20</td>
                                    <td className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Enviado</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
