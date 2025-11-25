import { X } from 'lucide-react';
import './ModalDetalles.css';

export default function ModalDetalles({ juego, onClose }) {
  if (!juego) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn btn btn-secondary"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <header className="modal-header">
          <h2 id="modal-titulo" className="modal-title">
            {juego.titulo}
          </h2>
        </header>

        <section className="modal-body">
          <div className="modal-grid">
            <aside className="modal-left">
              <img
                src={juego.imagenPortada}
                alt={juego.titulo}
                className="modal-image"
              />

              <div className="data-grid">
                <div className="data-card">
                  <p className="data-label">Género</p>
                  <p className="data-value">{juego.genero}</p>
                </div>

                <div className="data-card">
                  <p className="data-label">Plataforma</p>
                  <p className="data-value">{juego.plataforma}</p>
                </div>

                <div className="data-card">
                  <p className="data-label">Lanzamiento</p>
                  <p className="data-value">{juego.añoLanzamiento}</p>
                </div>

                <div className="data-card">
                  <p className="data-label">Desarrollador</p>
                  <p className="data-value data-value-small">{juego.desarrollador}</p>
                </div>
              </div>
            </aside>

            <article className="modal-right">
              <h3 className="descripcion-title">Descripción</h3>
              <p className="descripcion-text">
                {juego.descripcion || 'Descripción no proporcionada.'}
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
