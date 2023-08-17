import "./styles.css";
import { xIcon } from "../../assets/icons/xIcon";

function CloseButton({ ...props }) {
  return (
    <button
      className="button disabled"
      style={{
        margin: "8px",
        padding: "4px",
        right: "4px",
        top: "2px",
      }}
      {...props}
    >
      {xIcon}
    </button>
  );
}

export default CloseButton;
