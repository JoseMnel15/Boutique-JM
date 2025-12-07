import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Layout = ({ theme, onToggleTheme }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const linkBase = 'flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg';
    const activeLink = 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-300';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-slate-50">
            {/* SideNavBar */}
            <aside className="flex w-64 flex-col bg-white dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700/50 sticky top-0 h-screen">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-3">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="Boutique Logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfbhilQrBbu12o2adB75tI8KvRI7dUAW5UwX63XfHengdSct1ZaRqDOftXlUE-w3vQtZIvq6A93E0bJgGR9U6wEJq0Ld0abSqYna-gP4xL-1IdSY5ocHHWb-IkJ4xnwdvtIIbiNLGRQVmoEgV1BpDhDhGPQkHFtzxBMxnqvHy3NQxOjprESw9IPYSFqPIF5amjNPTtmH7SzODNirgSueulPekedv2JTab8QLgfHYwtUiMHpSmnKdIqU4wi_s5sJxUi-5QtxWQeodLjM")' }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-gray-900 dark:text-white text-base font-bold leading-normal">Boutique JM</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">{user?.fullName || user?.username}</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2 mt-4">
                        <NavLink className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`} to="/dashboard">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                            <p className="text-sm font-semibold leading-normal">Panel</p>
                        </NavLink>
                        <NavLink className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`} to="/products">
                            <span className="material-symbols-outlined">shopping_bag</span>
                            <p className="text-sm font-medium leading-normal">Inventario</p>
                        </NavLink>
                        <a className={linkBase} href="#">
                            <span className="material-symbols-outlined">receipt_long</span>
                            <p className="text-sm font-medium leading-normal">Ordenes</p>
                        </a>
                        <a className={linkBase} href="#">
                            <span className="material-symbols-outlined">group</span>
                            <p className="text-sm font-medium leading-normal">Clientes</p>
                        </a>
                        <a className={linkBase} href="#">
                            <span className="material-symbols-outlined">analytics</span>
                            <p className="text-sm font-medium leading-normal">Reportes</p>
                        </a>
                        <NavLink className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`} to="/users">
                            <span className="material-symbols-outlined">badge</span>
                            <p className="text-sm font-medium leading-normal">Usuarios y Roles</p>
                        </NavLink>
                        <a className={linkBase} href="#">
                            <span className="material-symbols-outlined">settings</span>
                            <p className="text-sm font-medium leading-normal">Configuración</p>
                        </a>
                    </nav>
                </div>
                <div className="flex flex-col gap-4 mt-auto">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]" type="button">
                        <span className="truncate">Agregar Producto</span>
                    </button>
                    <div className="flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg text-left"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <p className="text-sm font-medium leading-normal">Cerrar Sesión</p>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1">
                <Outlet context={{ theme, onToggleTheme }} />
            </main>
        </div>
    );
};

export default Layout;
