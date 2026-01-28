import { octokit } from "@/pages";
import { FileType, File as HunkFile } from "gitdiff-parser";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck, FaRegCopy } from "react-icons/fa6";
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
      <div className="sticky top-0 gap-1 bg-gray-50 px-3 py-2 dark:bg-gray-800">
        <div className="flex justify-between gap-2">
          <div className="flex flex-row items-center gap-1">
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
                onClick={() => navigator.clipboard.writeText(filePath)}
              />
            </div>
            <ChangeTypeBadge type={file.type} />
          </div>
          {file.type !== "delete" && <CopyButton file={file} />}
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

function ChangeTypeBadge({ type }: { type: FileType }) {
  if (type === "modify") return null;

  const colors: Record<FileType, string> = {
    add: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    delete:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    modify:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    rename:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    copy: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  };

  return (
    <div
      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
        colors[type] ||
        "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {
        {
          add: "ADDED",
          delete: "DELETED",
          modify: "MODIFIED",
          rename: "RENAMED",
          copy: "COPIED",
        }[type]
      }
    </div>
  );
}

function CopyButton({ file }: { file: HunkFile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const to = `${router.query.to ?? ""}`;

  const getContent = async () => {
    try {
      setIsLoading(true);
      const { data } = await octokit.rest.repos.getContent({
        owner: "albinpk",
        repo: "flutter-upgrade-helper-diff",
        path: file.newPath,
        ref: `sdk-${to}`,
      });

      if (!Array.isArray(data)) {
        if (data.type === "file") {
          const content = Buffer.from(data.content, "base64").toString();
          navigator.clipboard.writeText(content);
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IconButton
      icon={
        copied ? (
          <FaCheck className="text-lg text-emerald-600" />
        ) : isLoading ? (
          <Spinner />
        ) : (
          <FaRegCopy />
        )
      }
      onClick={getContent}
    />
  );
}

function Spinner() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
  );
}
