import { FileData, FileMap } from "@/scripts/generateSource";
import { useTheme } from "next-themes";
import { memo, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { allPlatforms } from "./form";

export default function Diff({
  from,
  to,
  platforms,
}: {
  from?: string;
  to?: string;
  platforms?: Set<string>;
}) {
  const [oldData, setOldData] = useState<FileMap>({});
  const [newData, setNewData] = useState<FileMap>({});

  useEffect(() => {
    if (!from) return;
    fetch(`/data/json/${from}.json`)
      .then((res) => res.json())
      .then((d) => {
        return setOldData(d);
      })
      .catch(console.error);
  }, [from]);

  useEffect(() => {
    if (!to) return;
    fetch(`/data/json/${to}.json`)
      .then((res) => res.json())
      .then((d) => {
        return setNewData(d);
      })
      .catch(console.error);
  }, [to]);

  if (!from || !to)
    return (
      <div className="flex items-center justify-center text-gray-500 mt-8">
        Please select two versions
      </div>
    );

  const files = Array.from(
    new Set([...Object.keys(oldData), ...Object.keys(newData)])
  );

  const filtered = files.filter((v) => {
    const dir = v.split("/")[0];
    if (!allPlatforms.map((v) => v.toLowerCase()).includes(dir)) return true;
    return platforms?.has(dir) ?? true;
  });

  return (
    <>
      {filtered.map((key) => (
        <DiffView key={key} oldValue={oldData[key]} newValue={newData[key]} />
      ))}
    </>
  );
}

const DiffView = memo(function DiffView({
  oldValue,
  newValue,
}: {
  oldValue?: FileData;
  newValue?: FileData;
}) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <div className="mt-6">
      <ReactDiffViewer
        oldValue={oldValue?.content}
        newValue={newValue?.content}
        splitView={true}
        leftTitle={oldValue?.path}
        rightTitle={
          oldValue?.path === newValue?.path ? undefined : newValue?.path
        }
        useDarkTheme={currentTheme === "dark"}
        styles={{
          line: {
            wordBreak: "break-word",
          },
          diffRemoved: {
            overflowX: "auto",
            maxWidth: 300,
          },
          diffAdded: {
            overflowX: "auto",
            maxWidth: 300,
          },
        }}
      />
    </div>
  );
});
