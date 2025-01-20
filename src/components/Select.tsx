import { ChangeEvent } from 'react';

type SelectProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  label: string;
  options: string[];
};

const Select = ({ value, onChange, id, options, label }: SelectProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-stone-200">{label}:</p>
      </div>

      <select
        className="hover:cursor-pointer text-sm bg-stone-700 rounded-md px-2 py-1 
        text-stone-300 w-[150px] outline-none"
        id={id}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option className="" key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
