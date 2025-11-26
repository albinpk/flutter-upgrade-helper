import { FileData, FileMap } from "@/scripts/generateSource";

import { useTheme } from "next-themes";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Diff,
  Hunk,
  HunkData,
  HunkTokens,
  markEdits,
  parseDiff,
  tokenize,
} from "react-diff-view";
import { diffLines, formatLines } from "unidiff";
import FileTile from "./FileTile";
import { allPlatforms } from "./form";
import TextButton from "./TextButton";

export default function NewDiff({
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

  type Visibility = { [key: string]: boolean };

  const [visibility, setVisibility] = useState<Visibility>({});
  const [expandAll, setExpandAll] = useState(true);

  const onVisibilityChange = (key: string) => {
    setVisibility((o) => {
      const n = { ...o };
      n[key] = !(n[key] ?? true);
      return n;
    });
  };

  const onExpandAll = () => {
    setVisibility(
      expandAll
        ? filtered.reduce((prev, cur) => ({ ...prev, [cur]: false }), {})
        : {},
    );
    setExpandAll((v) => !v);
  };

  if (!from || !to)
    return (
      <div className="mt-8 flex items-center justify-center text-gray-500">
        Please select two versions
      </div>
    );

  const files = Array.from(
    new Set([...Object.keys(oldData), ...Object.keys(newData)]),
  );

  const filtered = files.filter((v) => {
    const dir = v.split("/")[0];
    if (!allPlatforms.map((v) => v.toLowerCase()).includes(dir)) return true;
    return platforms?.has(dir) ?? true;
  });

  return (
    <>
      <div className="mb-3 flex flex-row justify-end rounded-md">
        <TextButton
          label={expandAll ? "Collapse All" : "Expand All"}
          onClick={onExpandAll}
        />
      </div>

      {filtered.map((key) => (
        <FileTile
          filePath={key}
          visible={visibility[key] ?? true}
          onExpand={() => onVisibilityChange(key)}
        >
          <DiffView key={key} oldValue={oldData[key]} newValue={newData[key]} />
        </FileTile>
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

  const diffText = formatLines(
    diffLines(oldValue?.content ?? "", newValue?.content ?? ""),
    { context: 3 },
  );
  const [diff] = parseDiff(diffText, {
    // nearbySequences: "zip"
  });

  const getHunksWithAppName = useCallback(
    (originalHunks: HunkData[]) => {
      return originalHunks;
      // if (!appName && !appPackage) {
      //   // No patching of rn-diff-purge output required.
      //   return originalHunks
      // }

      // return originalHunks.map((hunk) => ({
      //   ...hunk,
      //   changes: hunk.changes.map((change) => ({
      //     ...change,
      //     content: replaceAppDetails(change.content, appName, appPackage),
      //   })),
      //   content: replaceAppDetails(hunk.content, appName, appPackage),
      // }))
    },
    // [appName, appPackage]
    [],
  );

  const updatedHunks: HunkData[] = useMemo(
    () => getHunksWithAppName(diff.hunks),
    [diff.hunks],
  );

  const tokens: HunkTokens = useMemo(
    () =>
      tokenize(diff.hunks, {
        enhancers: [markEdits(updatedHunks)],
      }),
    [diff.hunks, updatedHunks],
  );

  return (
    <Diff
      viewType="split"
      diffType={diff.type}
      hunks={diff.hunks || []}
      optimizeSelection
      tokens={tokens}
    >
      {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
    </Diff>
  );
});
