export default function FlashMessage({ message }) {
  return <p className={'message' + (message.type ? ' ' + message.type : '')}>{message.text}</p>;
}
