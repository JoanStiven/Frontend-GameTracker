import { Trash2, Edit, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TarjetaJuego.css';

const TarjetaJuego = ({ juego, onDelete, onCardClick }) => {
  return (
    <div className="card" onClick={() => onCardClick(juego)}>
      
      <div className="card-image-container">
        <img
          src={juego.imagenPortada}
          alt={juego.titulo}
          className="card-img"
        />
      </div>

      <div className="card-content">

        <div className="title-badge-row">
          <h3 className="card-title">{juego.titulo}</h3>

          {juego.completado && (
            <span className="badge-completed">Completado</span>
          )}
        </div>
        
        <p className="card-subtitle">
          {juego.genero} • {juego.plataforma} • {juego.añoLanzamiento}
        </p>

        <p className="card-desc">
          {juego.descripcion || "Sin descripción disponible."}
        </p>

        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          
          <Link to={`/editar/${juego._id}`} className="btn btn-primary btn-edit btn-sm">
            <Edit size={14} /> Editar
          </Link>
          
          <button onClick={() => onDelete(juego._id)} className="btn btn-danger btn-sm">
            <Trash2 size={14} /> Eliminar
          </button>
          
          <Link to={`/resenas/${juego._id}`} className="btn btn-success btn-sm">
            <Star size={14} /> Reseñas
          </Link>

        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;