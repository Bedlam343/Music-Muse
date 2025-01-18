import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

const Modal = ({ open, children, onClose }: ModalProps) => {
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        childrenRef.current &&
        !childrenRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed w-[100%] h-[100%] top-0 z-50 left-0 bg-black 
flex items-center justify-center bg-opacity-80"
    >
      <div ref={childrenRef}>{children}</div>
    </div>,
    document.getElementById('overlays')!
  );
};

export default Modal;
