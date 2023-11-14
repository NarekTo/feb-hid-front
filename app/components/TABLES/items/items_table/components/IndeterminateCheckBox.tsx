import { InputHTMLAttributes, useEffect, useRef } from "react";

interface IndeterminateCheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
  className?: string;
}
// It uses a ref to set the indeterminate property of the checkbox.
export const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({
  indeterminate = false,
  className = "",
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} cursor-pointer`}
      {...rest}
    />
  );
};
