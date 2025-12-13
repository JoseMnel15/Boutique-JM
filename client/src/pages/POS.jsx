import React from 'react';

const POS = () => {
    return (
        <div className="h-full flex overflow-hidden p-4 gap-4">
            {/* Zona izquierda: búsqueda y carrito */}
            <div className="flex-1 flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-card border border-gray-200 dark:border-gray-700/60 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700/60">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,0.9fr,0.8fr] gap-4 items-end">
                        <div className="col-span-1 lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Producto</label>
                            <div className="relative">
                                <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary py-2.5 pl-4 pr-10 shadow-sm transition-colors" placeholder="Buscar por código o nombre del producto" type="text" />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined text-lg">search</span>
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-[1fr,1fr] gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Cantidad</label>
                                <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary py-2.5 px-3 text-center shadow-sm transition-colors" placeholder="1" type="number" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Desc. $</label>
                                <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary py-2.5 px-3 text-center shadow-sm transition-colors" placeholder="0" type="number" />
                            </div>
                        </div>
                        <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg shadow-card font-semibold transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                            Agregar al carrito
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unidad</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Cantidad</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Precio</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Subtotal</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Descuento</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Total</th>
                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700/60">
                            {/* Fila ejemplo: Se usaría un map aquí */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Vestido Aura</td>
                                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">UND</td>
                                <td className="py-3 px-4 text-sm">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800">
                                            <span className="material-symbols-outlined text-xs">remove</span>
                                        </button>
                                        <span className="w-8 text-center text-gray-900 dark:text-white font-medium">1</span>
                                        <button className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800">
                                            <span className="material-symbols-outlined text-xs">add</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 text-right">$59.00</td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 text-right">$59.00</td>
                                <td className="py-3 px-4 text-sm text-center">
                                    <input className="w-16 text-center text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 focus:ring-primary focus:border-primary" type="text" defaultValue="0" />
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white text-right">$59.00</td>
                                <td className="py-3 px-4 text-center">
                                    <button className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Panel derecho resumen */}
            <div className="w-full md:w-[380px] flex flex-col gap-4">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card border border-gray-200 dark:border-gray-700/60 flex flex-col h-full relative overflow-hidden">
                    <div className="bg-primary text-white p-7 relative z-10 receipt-top">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Total $0.00</h2>
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Documento contable</label>
                            <select className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary py-2.5 shadow-sm">
                                <option>Ticket</option>
                                <option>Factura</option>
                                <option>Nota de venta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cliente</label>
                            <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary py-2.5 shadow-sm" placeholder="Consumidor final" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha de emisión</label>
                            <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary py-2.5 shadow-sm" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700/60 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900 dark:text-white">$0.00</span></div>
                            <div className="flex justify-between"><span>Descuento</span><span className="font-medium text-gray-900 dark:text-white">$0.00</span></div>
                            <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-white"><span>Total a pagar</span><span>$0.00</span></div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Ítems en carrito: 0</div>
                        </div>
                    </div>
                    <div className="p-6 pt-0 space-y-3">
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all transform active:scale-[0.98] flex items-center justify-between group disabled:opacity-60">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">point_of_sale</span>
                                Vender
                            </span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm group-hover:bg-white/30 transition-colors">Total $0.00</span>
                        </button>
                        <div className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 px-4 rounded-lg flex items-center justify-between text-sm font-medium shadow-sm">
                            <span>0 ítems en el carrito</span>
                            <button className="hover:text-red-600 dark:hover:text-red-300 transition-colors">
                                <span className="material-symbols-outlined text-lg">delete_sweep</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;
