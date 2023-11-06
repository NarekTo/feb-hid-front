// `IndeterminateCheckbox` is a function component that renders a checkbox with indeterminate state.

import {
  useEffect,
  useRef,
  InputHTMLAttributes,
  useMemo,
  useState,
} from "react";

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

//Filter is a component that renders a column filter using a datalist for auto-complete and a debounced input for filtering
export const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value, index) => (
          <option value={value as string} key={index} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={columnFilterValue || ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded outline-none text-primary-menu"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

//DebouncedInput is a component rendering an input with a managed value and a debounced onChange event.
export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
