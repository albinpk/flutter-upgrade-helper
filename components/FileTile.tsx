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
  const i = "text-black/50 dark:text-white/50";
  return (
    <div className="mb-5 rounded-md border border-solid border-black/20 dark:border-white/20">
      <div className="sticky top-0 flex flex-row items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-900">
        <IconButton
          icon={
            visible ? (
              <FaAngleUp className={i} />
            ) : (
              <FaAngleDown className={i} />
            )
          }
          onClick={onExpand}
        />
        <p className="break-all">
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
      {visible && <div className="mt-4">{children}</div>}
    </div>
  );
}
