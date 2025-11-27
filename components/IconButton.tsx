import { IconType } from "react-icons";

interface Props {
  icon: React.ReactNode;
  onClick: () => void;
}

export default function IconButton({ icon, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-brand inline-flex h-10 w-10 items-center justify-center rounded-md text-white shadow-xs hover:bg-black/20 dark:hover:bg-white/20"
    >
      {icon}
    </button>
  );
}

interface SmallProps {
  Icon: IconType;
  onClick: () => void;
}

export function SmallButton({ onClick, Icon }: SmallProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-brand inline-flex h-5 w-5 items-center justify-center rounded-md text-white shadow-xs hover:bg-black/20 dark:hover:bg-white/20"
    >
      {<Icon size={12} />}
    </button>
  );
}
