import "./button.css";
import { xIcon } from "@/assets/icons/xIcon";

function CloseButton({ ...props }) {
  return (
    <button className="close-button" {...props}>
      {xIcon}
    </button>
  );
}

export default CloseButton;
