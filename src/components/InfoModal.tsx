import React from 'react';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <span className="text-xl">&times;</span>
        </button>
        <h3 className="text-lg font-semibold mb-2">Update Information</h3>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          <li>error bug fixing calendar stop render at June 2025</li>
          <li>adding more inspection date until August 2025</li>
          <li>adding timeout &gt;1 mins</li>
          <li>fixing minor bug</li>
          <li>anjay mabar slebew</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoModal;
