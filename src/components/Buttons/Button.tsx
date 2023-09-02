import type { ReactNode } from "react";
import "./button.css";

type Props = {
  children: ReactNode;
  id?: string;
  name?: string;
  title?: string;
  value?: string | number | undefined;
  disabled?: boolean;
  className?: string;
  onClick?:
    | ((e: React.FormEvent<HTMLButtonElement>) => void)
    | ((e: React.MouseEvent<HTMLButtonElement>) => void);
};

function Button({ children, className, ...props }: Props) {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
