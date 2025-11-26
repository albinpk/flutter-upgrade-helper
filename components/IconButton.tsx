interface Props {
  icon: React.ReactNode;
  onClick: () => void;
}

export default function IconButton({ icon, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center text-white bg-brand hover:bg-black/20 dark:hover:bg-white/20 shadow-xs rounded-md w-10 h-10"
    >
      {icon}
    </button>
  );
}
