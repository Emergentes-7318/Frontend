import 'primeicons/primeicons.css';
export function SearchBar() {
    return (
        <div className="flex justify-start w-1/2">
            <div className="relative w-full">
                <i className="pi pi-search text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type="search"
                    placeholder="Buscar documentos, chats o reportes..."
                    className="w-full rounded-xl p-2 pl-10 border border-gray-200 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
        </div>
    );
}
