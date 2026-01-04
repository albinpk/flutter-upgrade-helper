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
      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
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
      className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    >
      <Icon size={14} />
    </button>
  );
}
