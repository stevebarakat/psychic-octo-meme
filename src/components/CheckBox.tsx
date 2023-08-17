import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id: string;
  name?: string;
  type?: string;
  value?: string;
  checked: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
};

function CheckBox({
  children,
  id,
  name,
  type,
  value,
  checked,
  onChange,
}: Props) {
  return (
    <>
      <input
        type={type || "checkbox"}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{children}</label>
    </>
  );
}

export default CheckBox;
