export default function ConfirmModal({ title, text, onCancel, onConfirm }) {
  return (
    <div id="confirmModal" className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="form-actions right">
          <button className="btn secondary" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
