import { ReactNode } from "react";
import "./styles.css";

type Props = {
  children: ReactNode;
  id?: string;
  name?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  onClick?:
    | ((e: React.FormEvent<HTMLButtonElement>) => void)
    | ((e: React.MouseEvent<HTMLButtonElement>) => void);
};

function TransportButton({ children, ...props }: Props) {
  return (
    <button style={{ padding: "1.025rem" }} className="button" {...props}>
      {children}
    </button>
  );
}

export default TransportButton;
