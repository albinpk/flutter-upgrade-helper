import { FileData, FileMap } from "@/scripts/generateSource";

import { useTheme } from "next-themes";
import { useRouter } from "next/router";
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

export default function DiffView({
  platforms,
}: {
  platforms?: Set<string>;
}) {
  const router = useRouter();
  const [oldData, setOldData] = useState<FileMap>({});
  const [newData, setNewData] = useState<FileMap>({});
  
  const from = `${router.query.from ?? ''}`;
  const to = `${router.query.to ??''}`

  useEffect(() => {
    if (!from || from === to) return;
    fetch(`/data/json/${from}.json`)
      .then((res) => res.json())
      .then((d) => {
        return setOldData(d);
      })
      .catch(console.error);
  }, [from]);

  useEffect(() => {
    if (!to || from === to) return;
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
  const [showChangesOnly, setShowChangesOnly] = useState(true);

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

  if (from === to)
    return (
      <div className="mt-8 flex items-center justify-center text-gray-500">
        Please select two different versions
      </div>
    );

  const files = Array.from(
    new Set([...Object.keys(oldData), ...Object.keys(newData)]),
  );

  var filtered = files.filter((v) => {
    if (v === ".metadata") return false;

    const dir = v.split("/")[0];
    if (!allPlatforms.map((v) => v.toLowerCase()).includes(dir)) return true;
    return platforms?.has(dir) ?? true;
  });

  if (showChangesOnly) {
    filtered = filtered.filter((key) => {
      return oldData[key]?.content !== newData[key]?.content;
    });
  }

  return (
    <>
      <div className="mb-3 flex flex-row items-center justify-between rounded-md">
        {filtered.length} files
        <div>
          <TextButton
            label={showChangesOnly ? "Show All Files" : "Show Changes Only"}
            onClick={() => setShowChangesOnly((v) => !v)}
          />
          <TextButton
            label={expandAll ? "Collapse All" : "Expand All"}
            onClick={onExpandAll}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex items-center justify-center text-gray-500">
          There are no changes
        </div>
      ) : (
        filtered.map((key) => (
          <FileTile
            key={key}
            filePath={key}
            visible={visibility[key] ?? true}
            onExpand={() => onVisibilityChange(key)}
          >
            {oldData[key]?.content === newData[key]?.content ? (
              <div className="p-4 pt-0 text-center text-black/40 italic dark:text-white/40">
                No changes
              </div>
            ) : (
              <FileDiff oldValue={oldData[key]} newValue={newData[key]} />
            )}
          </FileTile>
        ))
      )}
    </>
  );
}

const FileDiff = memo(function DiffView({
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
