export default function EmptyRow({ colSpan, text }) {
  return <tr><td colSpan={colSpan} className="empty-row">{text}</td></tr>;
}
