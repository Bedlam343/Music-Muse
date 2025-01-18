import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  position?: 'top' | 'bottom';
  text: string;
};

const Tooltip = ({ children, position = 'bottom', text }: TooltipProps) => {
  return (
    <div className="group flex justify-center items-center">
      {children}
      <span
        style={{
          marginTop: position === 'top' ? -60 : 0,
          marginBottom: position === 'bottom' ? -60 : 0,
        }}
        className="hover:transition-opacity delay-300 text-stone-300 absolute 
        rounded px-1 py-1 invisible group-hover:visible bg-stone-700 
        text-[12px]"
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
