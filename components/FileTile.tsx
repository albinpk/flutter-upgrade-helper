import { FileType, File as HunkFile } from "gitdiff-parser";
import { ReactNode } from "react";
import { FaAngleDown, FaAngleUp, FaRegCopy } from "react-icons/fa6";
import IconButton, { SmallButton } from "./IconButton";

interface Props {
  visible: boolean;
  onExpand: () => void;
  children: ReactNode;
  file: HunkFile;
}

export default function FileTile({ children, visible, onExpand, file }: Props) {
  const filePath = (() => {
    if (file.type === "add") return file.newPath;
    if (file.type === "delete") return file.oldPath;
    if (file.type === "rename") return `${file.oldPath} → ${file.newPath}`;
    return file.newPath;
  })();
  return (
    <div className="mb-4 overflow-clip rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="sticky top-0 flex flex-row items-center gap-1 bg-gray-50 px-3 py-2 dark:bg-gray-800">
        <IconButton
          icon={visible ? <FaAngleUp /> : <FaAngleDown />}
          onClick={onExpand}
        />
        <p className="ml-3 break-all text-gray-700 dark:text-gray-300">
          {filePath}
        </p>
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
