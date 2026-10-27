import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.jsx';

/* ask(title, text, onConfirm) opens the confirmation dialog; render {modal} in the page. */
export default function useConfirm() {
  const [state, setState] = useState(null);

  const ask = (title, text, onConfirm) => setState({ title, text, onConfirm });
  const close = () => setState(null);
  const confirm = () => {
    const action = state.onConfirm;
    close();
    action();
  };

  const modal = state ? <ConfirmModal title={state.title} text={state.text} onCancel={close} onConfirm={confirm} /> : null;
  return { ask, modal };
}
