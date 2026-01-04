import { ReactNode } from "react";
import { FaAngleDown, FaAngleUp, FaRegCopy } from "react-icons/fa6";
import IconButton, { SmallButton } from "./IconButton";

interface Props {
  filePath: string;
  visible: boolean;
  onExpand: () => void;
  children: ReactNode;
}

export default function FileTile({
  children,
  filePath,
  visible,
  onExpand,
}: Props) {
  return (
    <div className="mb-4 overflow-clip rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="sticky top-0 flex flex-row items-center gap-3 bg-gray-50 px-3 py-2 dark:bg-gray-800">
        <IconButton
          icon={visible ? <FaAngleUp /> : <FaAngleDown />}
          onClick={onExpand}
        />
        <p className="break-all text-gray-700 dark:text-gray-300">{filePath}</p>
        <div className="mr-2">
          <SmallButton
            Icon={FaRegCopy}
            onClick={() => {
              navigator.clipboard.writeText(filePath);
            }}
          />
        </div>
      </div>
      {visible && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}
