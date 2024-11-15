import React from 'react';

interface NavbarModalEquipmentProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavbarModalEquipment: React.FC<NavbarModalEquipmentProps> = ({ isOpen, onClose }) => {
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-5xl">
        {/* Close button (X) in the top-right corner */}
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        
        {/* Modal header */}
        <h3 className="font-bold text-lg">Equipment</h3>
        
        {/* Modal content */}
        <div className="py-4">
          {/* Add your Equipment content here */}
          <p>Your Equipment content goes here...</p>
        </div>
        
        {/* Modal actions */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      
      {/* Backdrop for clicking outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default NavbarModalEquipment;