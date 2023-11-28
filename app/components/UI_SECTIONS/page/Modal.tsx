interface ModalProps {
  isOpen: boolean;
  text: string;
  button1Text: string;
  button1Action: () => void;
  button2Text?: string;
  button2Action?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  text,
  button1Text,
  button1Action,
  button2Text,
  button2Action,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded p-6 m-4 max-w-xs mx-auto text-center">
        <p className="mb-4">{text}</p>
        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={() => {
              button1Action();
            }}
            className="px-4 py-2 text-white bg-dark-blue rounded"
          >
            {button1Text}
          </button>
          {button2Text && (
            <button
              onClick={() => {
                button2Action();
              }}
              className="px-4 py-2 text-white bg-dark-blue rounded"
            >
              {button2Text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
