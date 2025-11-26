interface Props {
  label: string;
  onClick: () => void;
}

export default function TextButton({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-heading box-border rounded-md border border-transparent bg-transparent px-4 py-2.5 text-sm leading-5 font-medium hover:bg-black/10 dark:hover:bg-white/10"
    >
      {label}
    </button>
  );
}
