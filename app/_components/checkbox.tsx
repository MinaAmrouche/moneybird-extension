import { Path, UseFormRegister, FieldValues } from "react-hook-form";

type CheckboxProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  id: string;
  register: UseFormRegister<TFieldValues>;
  required?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox<
  TFieldValues extends FieldValues = FieldValues
>({
  label,
  name,
  id,
  register,
  required = false,
  handleChange,
}: CheckboxProps<TFieldValues>) {
  return (
    <div className="inline-flex items-center">
      <label
        className="relative flex items-center p-3 rounded-full cursor-pointer"
        htmlFor={id}
      >
        <input
          type="checkbox"
          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 dark:checked:border-gray-300 checked:bg-gray-900 checked:before:bg-gray-900 dark:checked:before:bg-gray-300 hover:before:opacity-10"
          id={id}
          {...register(name, { required, onChange: handleChange })}
        />
        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </label>
      <label
        className="mt-px font-light text-gray-700 dark:text-gray-300 cursor-pointer select-none"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}
