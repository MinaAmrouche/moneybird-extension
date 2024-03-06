import { Path, UseFormRegister, FieldValues } from "react-hook-form";
import clsx from "clsx";

type SelectProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  options: { value: string; label: string }[];
  register: UseFormRegister<TFieldValues>;
  required?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const selectClasses = [
  "peer h-full w-full rounded-[7px] px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all",
  "bg-white dark:bg-slate-800 disabled:bg-blue-gray-50 dark:disabled:bg-slate-500",
  "border border-blue-gray-200 dark:border-slate-700 border-t-transparent dark:border-t-transparent disabled:border-0",
  "text-blue-gray-700 dark:text-slate-100",
  "placeholder-shown:border-blue-gray-200 dark:placeholder-shown:border-slate-700 placeholder-shown:border-t-blue-gray-200 dark:placeholder-shown:border-t-slate-700 placeholder-shown:border",
  "focus:border-gray-900 dark:focus:border-slate-300 focus:border-2 focus:border-t-transparent dark:focus:border-t-transparent focus:outline-0",
];

const labelClasses = [
  "pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all",
  "text-blue-gray-400",
  "before:content[' '] before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 dark:before:border-slate-700 before:transition-all",
  "after:content[' '] after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 dark:after:border-slate-700 after:transition-all",
  "peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500",
  "peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 dark:peer-focus:text-slate-300 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 dark:peer-focus:before:border-slate-300 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 dark:peer-focus:after:border-slate-300",
  "peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent",
];

export default function Select<TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  options,
  register,
  required = false,
  handleChange,
}: SelectProps<TFieldValues>) {
  return (
    <div className="relative h-10 w-72 min-w-[200px]">
      <select
        className={clsx(selectClasses)}
        id={name}
        {...register(name, { required, onChange: handleChange })}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor={name} className={clsx(labelClasses)}>
        {label}
      </label>
    </div>
  );
}
