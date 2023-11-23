interface ButtonProps {
  description: string;
  onClick: () => void;
}

const TopMenuButton: React.FC<ButtonProps> = ({ description, onClick }) => {
  return (
    <button
      className="bg-dark-blue text-white rounded-md px-4 py-1 text-xs shadow-md"
      onClick={onClick}
    >
      {description}
    </button>
  );
};

export default TopMenuButton;
