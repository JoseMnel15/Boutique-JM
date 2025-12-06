import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'seller', label: 'Vendedor' },
];

const Users = ({ theme, onToggleTheme }) => {
    const { apiBase, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ id: null, username: '', fullName: '', role: 'seller', password: '' });

    const authHeaders = useMemo(() => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }), [token]);

    const loadUsers = useCallback(async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/users`, { headers: authHeaders });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Error al cargar usuarios');
            setUsers(data.users || []);
        } catch (err) {
            if (err.message && err.message.toLowerCase().includes('expected pattern')) {
                setError('No se pudo construir la URL de la API. Verifica VITE_API_URL y reinicia el dev server.');
            } else {
                setError(err.message || 'Error al cargar usuarios');
            }
        } finally {
            setLoading(false);
        }
    }, [apiBase, authHeaders]);

    useEffect(() => {
        if (token) {
            loadUsers();
        }
    }, [token, loadUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                username: form.username,
                fullName: form.fullName,
                role: form.role,
            };
            if (form.password) payload.password = form.password;

            const isEdit = Boolean(form.id);
            const url = isEdit ? `${apiBase}/users/${form.id}` : `${apiBase}/users`;
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Error al guardar usuario');

            await loadUsers();
            setForm({ id: null, username: '', fullName: '', role: 'user', password: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (user) => {
        setForm({
            id: user.id,
            username: user.username,
            fullName: user.full_name || user.fullName || '',
            role: user.role || 'seller',
            password: '',
        });
    };

    return (
        <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-slate-50">
            {/* Side padding mimic main layout */}
            <main className="flex-1 p-8 w-full">
                <div className="w-full max-w-7xl mx-auto">
                    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Usuarios y Roles</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Administra accesos, roles y contraseñas.</p>
                        </div>
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <section className="lg:col-span-1 flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{form.id ? 'Editar usuario' : 'Agregar usuario'}</h3>
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
                                    {error}
                                </div>
                            )}
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Usuario
                                    <input
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.username}
                                        onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Nombre completo
                                    <input
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.fullName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                    />
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Rol
                                    <select
                                        className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.role}
                                        onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                                    >
                                        {roles.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Contraseña {form.id ? '(dejar en blanco para no cambiar)' : ''}
                                    <input
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                        placeholder={form.id ? '••••••••' : 'Define una contraseña'}
                                        required={!form.id}
                                    />
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 rounded-lg bg-primary text-white font-semibold py-2 hover:bg-primary/90 disabled:opacity-70"
                                    >
                                        {form.id ? 'Guardar cambios' : 'Crear usuario'}
                                    </button>
                                    {form.id && (
                                        <button
                                            type="button"
                                            onClick={() => setForm({ id: null, username: '', fullName: '', role: 'user', password: '' })}
                                            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Listado de usuarios</h3>
                                {loading && <p className="text-sm text-gray-500">Cargando...</p>}
                            </div>
                            <div className="overflow-x-auto -mx-6">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead className="border-b border-gray-200 dark:border-gray-700 font-medium">
                                        <tr>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Usuario</th>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Nombre</th>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Rol</th>
                                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.map((u) => (
                                            <tr key={u.id}>
                                                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">{u.username}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-300">{u.full_name || u.fullName || '—'}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(u)}
                                                        className="text-primary hover:underline text-sm font-semibold"
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!users.length && (
                                            <tr>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" colSpan={4}>Sin usuarios cargados.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Users;
