import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import './FormularioJuego.css';

const FormularioJuego = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    genero: 'Acción',
    plataforma: 'PC',
    lanzamientoAnio: new Date().getFullYear(),
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  useEffect(() => {
    if (!id) return;

    const fetchJuego = async () => {
      try {
        const res = await api.get(`/juegos/${id}`);
        const data = res.data;
        setFormData({
          titulo: data.titulo || '',
          genero: data.genero || 'Acción',
          plataforma: data.plataforma || 'PC',
          lanzamientoAnio: data.lanzamientoAnio ? Number(data.lanzamientoAnio) : new Date().getFullYear(),
          desarrollador: data.desarrollador || '',
          imagenPortada: data.imagenPortada || '',
          descripcion: data.descripcion || '',
          completado: Boolean(data.completado)
        });
      } catch {
        toast.error('Error al cargar el juego');
      }
    };

    fetchJuego();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.desarrollador) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    if (formData.imagenPortada && !/^https?:\/\/.+\..+/.test(formData.imagenPortada)) {
      toast.error('URL de la imagen no válida');
      return;
    }

    try {
      if (id) {
        await api.put(`/juegos/${id}`, formData);
        toast.success('Juego actualizado correctamente');
      } else {
        await api.post('/juegos', formData);
        toast.success('Juego agregado a la biblioteca');
      }
      navigate('/');
    } catch {
      toast.error('Error al guardar el juego');
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Volver a la biblioteca
        </Link>

        <div className="form-header">
          <h2 className="form-title">{id ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
          <p className="form-subtitle">Completa la información para {id ? 'actualizar' : 'registrar'} tu juego.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="input-group">
            <label>Título del Juego</label>
            <input
              required
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: Elden Ring"
            />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="form-select"
              >
                {['Acción','RPG','Aventura','Deportes','Roguelike', 'Shooter', 'Metroidvania', 'Terror'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Plataforma</label>
              <select
                name="plataforma"
                value={formData.plataforma}
                onChange={handleChange}
                className="form-select"
              >
                {['PC','PlayStation','Xbox','Nintendo','Mobile'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Año de Lanzamiento</label>
              <input
                type="number"
                name="lanzamientoAnio"
                value={formData.lanzamientoAnio}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label>Desarrollador</label>
              <input
                required
                name="desarrollador"
                value={formData.desarrollador}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: FromSoftware"
              />
            </div>
          </div>

          <div className="input-group">
            <label>URL Imagen Portada</label>
            <input
              name="imagenPortada"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.imagenPortada}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Breve sinopsis del juego..."
            />
          </div>

          <div className="input-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="completado"
                checked={formData.completado}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>¿Ya completaste este juego?</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-submit">
              <Save size={18} />
              <span>{id ? 'Guardar Cambios' : 'Crear Juego'}</span>
            </button>

            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary btn-cancel">
              <X size={18} />
              <span>Cancelar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioJuego;

