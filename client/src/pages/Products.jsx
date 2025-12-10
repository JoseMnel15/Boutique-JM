import React, {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import JsBarcode from 'jsbarcode';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const categoryConfig = {
    tenis: { label: 'Tenis (Unisex)', sizeType: 'shoe', audience: 'Unisex' },
    tenisHombre: { label: 'Tenis Hombre', sizeType: 'shoe', audience: 'Hombre' },
    tenisMujer: { label: 'Tenis Mujer', sizeType: 'shoe', audience: 'Mujer' },
    bolsos: { label: 'Bolsos (Mujer)', sizeType: 'none', audience: 'Mujer' },
    bolsosHombre: { label: 'Bolsos Hombre', sizeType: 'none', audience: 'Hombre' },
    ropaDama: { label: 'Ropa Dama', sizeType: 'clothing', audience: 'Mujer' },
    ropaHombre: { label: 'Ropa Hombre', sizeType: 'clothing', audience: 'Hombre' },
    ropaNina: { label: 'Ropa Niña', sizeType: 'kids-clothing', audience: 'Niña' },
    ropaNino: { label: 'Ropa Niño', sizeType: 'kids-clothing', audience: 'Niño' },
    accesorios: { label: 'Accesorios (Unisex)', sizeType: 'none', audience: 'Unisex' },
    accesoriosHombre: { label: 'Accesorios Hombre', sizeType: 'none', audience: 'Hombre' },
    accesoriosMujer: { label: 'Accesorios Mujer', sizeType: 'none', audience: 'Mujer' },
};

const sizeOptionsByType = {
    shoe: ['23', '24', '25', '26', '27', '28', '29', '30'],
    clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'kids-clothing': ['2', '4', '6', '8', '10', '12', '14'],
};

const Products = () => {
    const { theme, onToggleTheme } = useOutletContext();
    const { apiBase, token, logout } = useAuth();

    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [brandMode, setBrandMode] = useState('select'); // select | new
    const [newBrand, setNewBrand] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [labelCode, setLabelCode] = useState('');
    const [form, setForm] = useState({
        name: '',
        brand: '',
        category: 'tenis',
        price: '',
        stock: '',
        size: '',
        color: '',
    });

    const sizeType = categoryConfig[form.category]?.sizeType || 'none';
    const sizeOptions = sizeOptionsByType[sizeType] || [];
    const categoryLabel = useMemo(() => categoryConfig[form.category]?.label || '', [form.category]);

    const loadData = useCallback(async () => {
        if (!token) return;
        setError('');
        try {
            const [brandsRes, productsRes] = await Promise.all([
                fetch(`${apiBase}/brands`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBase}/products`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            if (brandsRes.status === 401 || productsRes.status === 401) {
                logout();
                throw new Error('Sesión inválida. Inicia sesión de nuevo.');
            }
            const brandsData = await brandsRes.json();
            const productsData = await productsRes.json();
            if (!brandsRes.ok) throw new Error(brandsData?.message || 'No se pudieron cargar las marcas');
            if (!productsRes.ok) throw new Error(productsData?.message || 'No se pudieron cargar los productos');
            setBrands(brandsData.brands || []);
            setProducts(productsData.products || []);
            if ((brandsData.brands || []).length) {
                setForm((prev) => ({ ...prev, brand: prev.brand || brandsData.brands[0].id }));
            }
        } catch (err) {
            const apiMessage = apiBase ? '' : ' VITE_API_URL no está definido.';
            setError(err.message || `Error al cargar inventario.${apiMessage}`);
        }
    }, [apiBase, token, logout]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showModal]);

    useEffect(() => {
        if (showModal && !brands.length) {
            loadData();
        }
    }, [showModal, brands.length, loadData]);

    useEffect(() => {
        if (!labelCode) {
            setLabelCode(''); // ensure sync reset
        }
    }, [labelCode]);

    const barcodeRef = useRef(null);
    useEffect(() => {
        if (barcodeRef.current && labelCode) {
            try {
                JsBarcode(barcodeRef.current, labelCode, {
                    format: 'CODE128',
                    width: 2,
                    height: 60,
                    displayValue: true,
                    fontSize: 14,
                    margin: 8,
                });
            } catch {
                // ignore invalid codes
            }
        } else if (barcodeRef.current) {
            barcodeRef.current.innerHTML = '';
        }
    }, [labelCode, showModal]);

    const resetForm = () => {
        setForm({
            name: '',
            brand: brands[0]?.id || '',
            category: 'tenis',
            price: '',
            stock: '',
            size: '',
            color: '',
        });
        setBrandMode('select');
        setNewBrand('');
        setEditingId(null);
        setLabelCode('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');
        setLoading(true);

        if (!form.name.trim() || (!labelCode && brandMode !== 'new') || (!form.brand && brandMode !== 'new')) {
            setError('Nombre, marca y código de barras son obligatorios.');
            setLoading(false);
            return;
        }
        if (!labelCode) {
            setError('Captura o genera un código de barras.');
            setLoading(false);
            return;
        }
        if (Number(form.price) <= 0 || Number.isNaN(Number(form.price))) {
            setError('Precio debe ser mayor a 0.');
            setLoading(false);
            return;
        }
        if (Number(form.stock) < 0 || Number.isNaN(Number(form.stock))) {
            setError('Inventario no puede ser negativo.');
            setLoading(false);
            return;
        }
        if (sizeType !== 'none' && !form.size) {
            setError('Selecciona una talla para esta categoría.');
            setLoading(false);
            return;
        }

        const createBrandIfNeeded = async () => {
            if (brandMode !== 'new') return form.brand;
            const brandName = newBrand.trim();
            if (!brandName) throw new Error('La marca es obligatoria.');
            const res = await fetch(`${apiBase}/brands`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: brandName }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'No se pudo crear la marca');
            const updatedBrands = [...brands, data.brand].sort((a, b) => a.name.localeCompare(b.name));
            setBrands(updatedBrands);
            return data.brand.id;
        };

        const persistProduct = async (brandId) => {
            const payload = {
                name: form.name.trim(),
                brandId,
                category: form.category,
                barcode: labelCode.trim(),
                sku: labelCode.trim(), // compat con back anterior
                price: Number(form.price),
                stock: Number(form.stock),
                size: sizeType === 'none' ? null : form.size,
                color: form.color.trim() || '—',
            };
            const url = editingId ? `${apiBase}/products/${editingId}` : `${apiBase}/products`;
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'No se pudo guardar el producto');
            if (editingId) {
                setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
            } else {
                setProducts((prev) => [data.product, ...prev]);
            }
        };

        try {
            const brandId = await createBrandIfNeeded();
            await persistProduct(brandId);
            setStatus(editingId ? 'Producto actualizado.' : 'Producto agregado al inventario.');
            resetForm();
            setShowModal(false);
        } catch (err) {
            setError(err.message || 'Error al guardar producto');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (product) => {
        setError('');
        setStatus('');
        setEditingId(product.id);
        setBrandMode('select');
        setNewBrand('');
        setForm({
            name: product.name || '',
            brand: product.brand_id || product.brand || '',
            category: product.category || 'tenis',
            price: product.price || '',
            stock: product.stock || '',
            size: product.size || '',
            color: product.color || '',
        });
        setLabelCode(product.sku || product.barcode || '');
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Eliminar producto',
            text: `¿Deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;
        setError('');
        setStatus('');
        try {
            const res = await fetch(`${apiBase}/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'No se pudo eliminar');
            }
            setProducts((prev) => prev.filter((p) => p.id !== id));
            setStatus('Producto eliminado.');
            await Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                timer: 1400,
                showConfirmButton: false,
            });
        } catch (err) {
            setError(err.message || 'Error al eliminar');
            await Swal.fire({
                icon: 'error',
                title: 'No se pudo eliminar',
                text: err.message || 'Intenta de nuevo',
            });
        }
    };

    const generateLabelCode = () => {
        const randomCode = `PRD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        setLabelCode(labelCode || randomCode);
    };

    const printLabel = () => {
        if (!form.name.trim() || !labelCode || !form.price || form.stock === '' || (sizeType !== 'none' && !form.size)) {
            Swal.fire({
                icon: 'warning',
                title: 'Completa el formulario',
                text: 'Llena nombre, código, precio, inventario y talla si aplica antes de imprimir.',
            });
            return;
        }
        if (!labelCode) {
            setError('Genera o captura un código de barras para imprimir.');
            return;
        }
        const labelHtml = `
            <div style="font-family: Arial, sans-serif; width: 320px; padding: 12px 16px; border: 1px solid #ddd;">
                <div style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">${form.name || 'Producto'}</div>
                <div style="font-size: 12px; color: #555; margin-bottom: 6px;">
                    Código: ${labelCode || 'N/A'}<br/>
                    Talla: ${form.size || '—'} &nbsp; | &nbsp; Color: ${form.color || '—'}
                </div>
                ${barcodeRef.current ? barcodeRef.current.outerHTML : ''}
            </div>
        `;
        const printWindow = window.open('', 'PRINT', 'width=400,height=400');
        if (!printWindow) return;
        printWindow.document.write(`<!doctype html><html><head><title>Etiqueta</title></head><body>${labelHtml}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <p className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Inventario</p>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Agrega y gestiona productos de boutique.</p>
                </div>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </header>

            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Listado de inventario</h3>
                    <div className="flex items-center gap-3">
                        {status && !error && <span className="text-sm text-green-600 dark:text-green-300">{status}</span>}
                        {error && <span className="text-sm text-red-600 dark:text-red-300">{error}</span>}
                        <button
                            type="button"
                            onClick={() => { resetForm(); setError(''); setStatus(''); setShowModal(true); }}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white font-semibold px-4 py-2 hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            Agregar producto
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto -mx-6">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b border-gray-200 dark:border-gray-700 font-medium">
                            <tr>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Producto</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Marca</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Categoría</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">SKU</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Precio</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Stock</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Talla</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Público</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Color</th>
                                <th className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">{p.name}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{p.brand_name || p.brand}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{categoryConfig[p.category]?.label || p.category}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{p.sku}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">${Number(p.price).toLocaleString()}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{p.stock}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{p.size || '—'}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{p.gender || categoryConfig[p.category]?.audience}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-600 dark:text-gray-300">{p.color}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(p)}
                                                className="inline-flex items-center gap-1 rounded-md border border-primary/40 px-2.5 py-1 text-primary hover:bg-primary/10 font-semibold"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                                <span className="hidden sm:inline">Editar</span>
                                            </button>
                                            <button
                                                type="button"
                                            onClick={() => handleDelete(p.id, p.name)}
                                            className="inline-flex items-center gap-1 rounded-md border border-red-500/50 px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold"
                                        >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                <span className="hidden sm:inline">Eliminar</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!products.length && (
                                <tr>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" colSpan={10}>Sin productos en inventario.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-10">
                    <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                            <div className="flex flex-col">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{editingId ? 'Editar producto' : 'Agregar producto'}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Define tallas y detalles según la categoría.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setShowModal(false); setError(''); setStatus(''); }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200 mb-4">
                                    {error}
                                </div>
                            )}
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Nombre
                                    <input
                                        className="form-input w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.name}
                                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Vestido Luna"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Marca
                                    <select
                                        className="form-select w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={brandMode === 'new' ? '__add_brand__' : form.brand}
                                        onChange={(e) => {
                                            if (e.target.value === '__add_brand__') {
                                                setBrandMode('new');
                                                setForm((prev) => ({ ...prev, brand: '' }));
                                            } else {
                                                setBrandMode('select');
                                                setForm((prev) => ({ ...prev, brand: e.target.value }));
                                                setNewBrand('');
                                            }
                                        }}
                                    >
                                        {brands.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                        <option value="__add_brand__">+ Agregar marca</option>
                                    </select>
                                </label>
                                {brandMode === 'new' && (
                                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 md:col-span-2">
                                        Nueva marca
                                        <input
                                            className="form-input w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                            value={newBrand}
                                            onChange={(e) => setNewBrand(e.target.value)}
                                            placeholder="Ej. Lacoste"
                                            required
                                        />
                                    </label>
                                )}
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Categoría
                                    <select
                                        className="form-select w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.category}
                                        onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value, size: '' }))}
                                    >
                                        {Object.entries(categoryConfig).map(([value, cfg]) => (
                                            <option key={value} value={value}>{cfg.label}</option>
                                        ))}
                                    </select>
                                </label>
                                <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Código de barras / etiqueta</span>
                                        <input
                                            className="form-input w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                            value={labelCode}
                                            onChange={(e) => setLabelCode(e.target.value)}
                                            placeholder="Escanéalo o genera uno"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Úsalo si el producto no trae etiqueta. Se imprime con nombre, talla y color.</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={generateLabelCode}
                                                className="rounded-md border border-primary/50 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10"
                                            >
                                                Generar código
                                            </button>
                                            <button
                                                type="button"
                                                onClick={printLabel}
                                                className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary/90"
                                            >
                                                Imprimir etiqueta
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Vista previa</span>
                                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 min-h-[120px] flex items-center justify-center">
                                            {labelCode ? (
                                                <svg ref={barcodeRef} />
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Ingresa o genera un código para ver la vista previa.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Precio
                                    <input
                                        type="number"
                                        className="form-input w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.price}
                                        onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                                        min="0"
                                        step="0.01"
                                        placeholder="1499"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Inventario
                                    <input
                                        type="number"
                                        className="form-input w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.stock}
                                        onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                                        min="0"
                                        step="1"
                                        placeholder="10"
                                        required
                                    />
                                </label>
                                {sizeType !== 'none' && (
                                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Talla ({categoryLabel})
                                        <select
                                            className="form-select w/full rounded-lg border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                            value={form.size}
                                            onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))}
                                            required
                                        >
                                            <option value="">Selecciona talla</option>
                                            {sizeOptions.map((sz) => (
                                                <option key={sz} value={sz}>{sz}</option>
                                            ))}
                                        </select>
                                    </label>
                                )}
                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Color
                                    <input
                                        className="form-input w/full rounded-lg border border-gray-300 dark.border-gray-700 bg-background-light dark:bg-gray-900 px-3 py-2 text-base dark:text-white focus:ring-2 focus:ring-primary"
                                        value={form.color}
                                        onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                                        placeholder="Negro, Azul, Camel"
                                    />
                                </label>
                                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); setError(''); resetForm(); }}
                                        className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-lg bg-primary text-white font-semibold px-4 py-2 hover:bg-primary/90 disabled:opacity-70"
                                    >
                                        {editingId ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
