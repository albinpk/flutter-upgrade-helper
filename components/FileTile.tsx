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
      <div className="flex flex-row items-center gap-2 rounded-md bg-black/10 dark:bg-white/10">
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
        {filePath}
        <SmallButton
          Icon={FaRegCopy}
          onClick={() => {
            navigator.clipboard.writeText(filePath);
          }}
        />
      </div>
      {visible && <div className="mt-4">{children}</div>}
    </div>
  );
}
