interface Props {
  label: string;
  onClick: () => void;
}

export default function TextButton({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {label}
    </button>
  );
}
