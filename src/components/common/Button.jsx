const Button = ({ onClick, value, type = "button", disabled = false }) => {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="flex cursor-pointer items-center justify-center gap-2 
        rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white 
        transition hover:bg-blue-700"
      >
        {value}
      </button>
    </div>
  );
};

export default Button;
