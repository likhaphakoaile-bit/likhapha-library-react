/* Panel title + description, with an optional control (search box, button) on the right. */
export default function PanelHeading({ title, text, children }) {
  return (
    <div className="panel-heading">
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      {children}
    </div>
  );
}
