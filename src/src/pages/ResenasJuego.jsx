// Archivo: src/pages/ResenasJuego.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Star, ThumbsUp, Edit2, Trash2, X, Save, Send } from 'lucide-react';
import './ResenasJuego.css';

const ResenasJuego = () => {
  const { id } = useParams();
  const [resenas, setResenas] = useState([]);
  const [juego, setJuego] = useState(null);
  const [idEdicion, setIdEdicion] = useState(null);
  const [nuevaResena, setNuevaResena] = useState({
    puntuacion: 5,
    textoResena: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true,
  });

  const cargarDatos = useCallback(async () => {
    try {
      const [juegoRes, resenasRes] = await Promise.all([
        api.get(`/juegos/${id}`),
        api.get(`/resenas/juego/${id}`),
      ]);
      setJuego(juegoRes.data);
      setResenas(resenasRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar datos');
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, [cargarDatos]);

  const activarEdicion = (resena) => {
    setIdEdicion(resena._id);
    setNuevaResena({
      puntuacion: resena.puntuacion,
      textoResena: resena.textoResena,
      horasJugadas: resena.horasJugadas,
      dificultad: resena.dificultad,
      recomendaria: resena.recomendaria,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setIdEdicion(null);
    setNuevaResena({ puntuacion: 5, textoResena: '', horasJugadas: 0, dificultad: 'Normal', recomendaria: true });
  };

  const eliminarResena = (idResena) => {
    toast((t) => (
      <div className="toast-confirm">
        <span className="toast-text">¿Borrar reseña?</span>
        <div className="toast-actions">
          <button
            className="btn-toast btn-toast-danger"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/resenas/${idResena}`);
                toast.success('Reseña eliminada');
                cargarDatos();
                if (idEdicion === idResena) cancelarEdicion();
              } catch {
                toast.error('Error al eliminar');
              }
            }}
          >
            Sí
          </button>

          <button className="btn-toast btn-toast-cancel" onClick={() => toast.dismiss(t.id)}>
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (idEdicion) {
        await api.put(`/resenas/${idEdicion}`, nuevaResena);
        toast.success('Reseña actualizada correctamente');
        cancelarEdicion();
      } else {
        await api.post('/resenas', { ...nuevaResena, juegoId: id });
        toast.success('Reseña publicada');
        setNuevaResena({ puntuacion: 5, textoResena: '', horasJugadas: 0, dificultad: 'Normal', recomendaria: true });
      }
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar');
    }
  };

  if (!juego) return <div className="loading">Cargando...</div>;

  return (
    <div className="resenas-container">
      <div className="resenas-header">
        <Link to="/" className="back-link">← Volver a Biblioteca</Link>
        <h1 className="resenas-title">Reseñas: <span className="resenas-title-game">{juego.titulo}</span></h1>
      </div>

      <div className="resenas-grid">
        <aside className="resenas-form-card">
          <div className="form-top">
            <h3 className={idEdicion ? 'form-editing' : 'form-new'}>{idEdicion ? 'Editando Reseña' : 'Escribir Reseña'}</h3>
            {idEdicion && <button className="btn btn-secondary btn-cancel-edit" onClick={cancelarEdicion}><X size={14}/> Cancelar</button>}
          </div>

          <form onSubmit={handleSubmit} className="resena-form">
            <div className="input-group">
              <label>Puntuación</label>
              <div className="stars-row">
                {[1,2,3,4,5].map((estrella) => (
                  <Star
                    key={estrella}
                    size={28}
                    fill={estrella <= nuevaResena.puntuacion ? '#facc15' : 'none'}
                    stroke={estrella <= nuevaResena.puntuacion ? 'none' : 'currentColor'}
                    onClick={() => setNuevaResena({ ...nuevaResena, puntuacion: estrella })}
                    className="star-icon"
                  />
                ))}
              </div>
              <p className="star-count">{nuevaResena.puntuacion} de 5 estrellas</p>
            </div>

            <div className="input-group">
              <label>Horas Jugadas</label>
              <input type="number" min="0" value={nuevaResena.horasJugadas} onChange={(e) => setNuevaResena({ ...nuevaResena, horasJugadas: e.target.value })} className="form-input" />
            </div>

            <div className="input-group">
              <label>Dificultad</label>
              <select value={nuevaResena.dificultad} onChange={(e) => setNuevaResena({ ...nuevaResena, dificultad: e.target.value })} className="form-select">
                {['Fácil','Normal','Difícil'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Tu Opinión</label>
              <textarea value={nuevaResena.textoResena} onChange={(e) => setNuevaResena({ ...nuevaResena, textoResena: e.target.value })} className="form-textarea" />
            </div>

            <label className="checkbox-row">
              <input type="checkbox" checked={nuevaResena.recomendaria} onChange={(e) => setNuevaResena({ ...nuevaResena, recomendaria: e.target.checked })} className="form-checkbox" />
              <span className="checkbox-text">¿Lo recomendarías?</span>
            </label>

            <button type="submit" className={`btn resena-submit ${idEdicion ? 'btn-primary' : 'btn-success'}`}>
              {idEdicion ? <><Save size={18} /> Actualizar Reseña</> : <><Send size={18} /> Publicar Reseña</>}
            </button>
          </form>
        </aside>

        <section className="resenas-list">
          {resenas.length === 0 ? (
            <p className="empty-state">Aún no hay reseñas. ¡Sé el primero!</p>
          ) : (
            resenas.map((r) => (
              <article key={r._id} className={`resena-card ${idEdicion === r._id ? 'resena-editing' : ''}`}>
                <header className="resena-header">
                  <div className="resena-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < r.puntuacion ? '#facc15' : 'none'} stroke={i < r.puntuacion ? 'none' : 'gray'} />
                    ))}
                  </div>

                  <div className="resena-actions">
                    <button title="Editar" className="icon-btn" onClick={() => activarEdicion(r)}><Edit2 size={16} /></button>
                    <button title="Eliminar" className="icon-btn delete" onClick={() => eliminarResena(r._id)}><Trash2 size={16} /></button>
                  </div>
                </header>

                <p className="resena-text">{r.textoResena}</p>

                <footer className="resena-meta">
                  <span>⏱ {r.horasJugadas}h jugadas</span>
                  <span>{r.dificultad}</span>
                  {r.recomendaria && <span className="recomendado"><ThumbsUp size={12} /> Recomendado</span>}
                </footer>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default ResenasJuego;

