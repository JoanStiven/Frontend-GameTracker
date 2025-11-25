import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import TarjetaJuego from '../components/TarjetaJuego';
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './BuscarJuegos.css';

const BuscarJuegos = () => {
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filtros, setFiltros] = useState({
        titulo: '',
        genero: '',
        plataforma: '',
        completado: 'all',
        sortBy: 'titulo',
        order: 'asc'
    });

    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

    const handleChangeFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const hayFiltrosActivos =
        filtros.titulo.trim() !== '' ||
        filtros.genero !== '' ||
        filtros.plataforma !== '' ||
        filtros.completado !== 'all';

    const buscarJuegos = useCallback(async () => {
        setLoading(true);

        try {
            const params = {};

            if (filtros.titulo.trim()) params.titulo = filtros.titulo.trim();
            if (filtros.genero) params.genero = filtros.genero;
            if (filtros.plataforma) params.plataforma = filtros.plataforma;
            if (filtros.completado !== 'all') params.completado = filtros.completado;

            params.sortBy = filtros.sortBy;
            params.order = filtros.order;

            const res = await api.get('/juegos/buscar/filtros', { params });
            setJuegos(res.data);

            if (res.data.length === 0 && hayFiltrosActivos) {
                toast('No hay resultados. Intenta con otros filtros.', {
                    id: 'no-results',
                    className: 'toast-no-results'
                });
            } else {
                toast.dismiss('no-results');
            }
        } catch {
            toast.error("Error al buscar juegos.");
            toast.dismiss('no-results');
        } finally {
            setLoading(false);
        }
    }, [filtros, hayFiltrosActivos]);

    useEffect(() => {
        const handler = setTimeout(() => buscarJuegos(), 300);
        return () => clearTimeout(handler);
    }, [filtros, buscarJuegos]);

    const generos = ['Acción','RPG','Aventura','Deportes','Roguelike', 'Shooter', 'Metroidvania', 'Terror'];
    const plataformas = ["Mobile", "PC", "PlayStation", "Xbox", "Nintendo"];

    const criteriosOrdenacion = [
        { value: 'titulo', label: 'Título' },
        { value: 'plataforma', label: 'Plataforma' }
    ];

    return (
        <div className="container search-container">
            <Link to="/" className="back-link">← Volver a Biblioteca</Link>

            <h1 className="title title-search">
                <span className="title-primary">Búsqueda</span> Avanzada
            </h1>

            <div className="search-bar">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por Título..."
                    className="search-input"
                    name="titulo"
                    value={filtros.titulo}
                    onChange={handleChangeFiltro}
                />
            </div>

            <div className="filters-card">
                <div
                    className="filters-header"
                    onClick={() => setMostrarFiltrosAvanzados(prev => !prev)}
                >
                    <h4 className="filters-title">
                        <SlidersHorizontal size={20} className="filters-icon" />
                        Filtros Adicionales
                    </h4>

                    {mostrarFiltrosAvanzados ? (
                        <ChevronUp size={20} />
                    ) : (
                        <ChevronDown size={20} />
                    )}
                </div>

                {mostrarFiltrosAvanzados && (
                    <div className="filters-grid">

                        <div className="input-group">
                            <label>Género</label>
                            <select
                                name="genero"
                                value={filtros.genero}
                                onChange={handleChangeFiltro}
                            >
                                <option value="">Todos</option>
                                {generos.map(g => (
                                    <option key={g} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Plataforma</label>
                            <select
                                name="plataforma"
                                value={filtros.plataforma}
                                onChange={handleChangeFiltro}
                            >
                                <option value="">Todas</option>
                                {plataformas.map(p => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Estado</label>
                            <select
                                name="completado"
                                value={filtros.completado}
                                onChange={handleChangeFiltro}
                            >
                                <option value="all">Todos</option>
                                <option value="true">Completados</option>
                                <option value="false">Pendientes</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Ordenar por</label>
                            <select
                                name="sortBy"
                                value={filtros.sortBy}
                                onChange={handleChangeFiltro}
                            >
                                {criteriosOrdenacion.map(c => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Dirección</label>
                            <select
                                name="order"
                                value={filtros.order}
                                onChange={handleChangeFiltro}
                            >
                                <option value="desc">Descendente ↓</option>
                                <option value="asc">Ascendente ↑</option>
                            </select>
                        </div>

                    </div>
                )}
            </div>

            <h2 className="results-title">
                {loading ? "Buscando..." : `Resultados (${juegos.length})`}
            </h2>

            {loading ? (
                <div className="loading">Cargando resultados...</div>
            ) : (
                <>
                    <div className="games-grid">
                        {juegos.map(juego => (
                            <TarjetaJuego
                                key={juego._id}
                                juego={juego}
                                onDelete={() =>
                                    toast.error("Función de eliminación no disponible aquí.")
                                }
                            />
                        ))}
                    </div>

                    {juegos.length === 0 && (
                        <div className="empty-state">
                            {hayFiltrosActivos ? (
                                <>
                                    <h3>Sin resultados encontrados</h3>
                                    <p>No se encontraron juegos que coincidan con tus filtros.</p>
                                </>
                            ) : (
                                <>
                                    <h3>Ingresa un criterio de búsqueda</h3>
                                    <p>Tu biblioteca está esperando ser explorada.</p>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BuscarJuegos;