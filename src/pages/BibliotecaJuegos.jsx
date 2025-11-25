import React, { useEffect, useState } from "react";
import api from "../services/api";
import TarjetaJuego from "../components/TarjetaJuego";
import ModalDetalles from "../components/ModalDetalles";
import { PlusCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);

  const cargarJuegos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/juegos");
      setJuegos(res.data);
    } catch {
      toast.error("Error al cargar la biblioteca.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarJuegos();
  }, []);

  const abrirDetalles = (juego) => setJuegoSeleccionado(juego);
  const cerrarDetalles = () => setJuegoSeleccionado(null);

  

  const eliminarJuego = (id) => {
    toast(
      (t) => (
        <div className="toast-delete-container">
          <span>¿Borrar juego?</span>

          <div className="toast-delete-buttons">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/juegos/${id}`);
                  toast.success("Juego eliminado");
                  cargarJuegos();
                } catch {
                  toast.error("No se pudo eliminar");
                }
              }}
              className="btn-toast btn-toast-danger"
            >
              Sí
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="btn-toast btn-toast-cancel"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="container">
      <div className="header-flex">
        <h1 className="title">
          <span style={{ color: 'red' }}>Game</span>Tracker
        </h1>

        <Link to="/buscar" className="search-wrapper search-container-limit">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="search-input"
            readOnly
          />
        </Link>

        <div className="header-buttons">
          <Link to="/agregar" className="btn btn-primary">
            <PlusCircle size={18} />
            <span className="hidden-mobile">Agregar Juego</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Cargando tu biblioteca...</p>
        </div>
      ) : (
        <>
          <div className="games-grid">
            {juegos.map((juego) => (
              <TarjetaJuego
                key={juego._id}
                juego={juego}
                onDelete={eliminarJuego}
                onCardClick={abrirDetalles}
              />
            ))}
          </div>

          {juegos.length === 0 && (
            <div className="empty-state">
              <h3>No tienes juegos en tu biblioteca</h3>
              <p>¡Comienza agregando tu primer juego!</p>
            </div>
          )}
        </>
      )}
      <ModalDetalles juego={juegoSeleccionado} onClose={cerrarDetalles} />
    </div>
  );
};

export default BibliotecaJuegos;