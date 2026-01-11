import { File as HunkFile } from "gitdiff-parser";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Diff,
  HunkData,
  HunkTokens,
  markEdits,
  parseDiff,
  tokenize,
} from "react-diff-view";
import FileTile from "./FileTile";

import { octokit } from "@/pages";
import { useRouter } from "next/router";
import { allPlatforms } from "./form";
import TextButton from "./TextButton";

export default function DiffView({ platforms }: { platforms?: Set<string> }) {
  const router = useRouter();
  const [patch, setPatch] = useState<string>("");

  const from = `${router.query.from ?? ""}`;
  const to = `${router.query.to ?? ""}`;

  useEffect(() => {
    if (!from || !to) return;
    if (from === to) return;
    octokit.rest.repos
      .compareCommits({
        owner: "albinpk",
        repo: "flutter-upgrade-helper-diff",
        base: `sdk-${from}`,
        head: `sdk-${to}`,
        mediaType: { format: "diff" },
      })
      .then((res) => setPatch(`${res.data}`))
      .catch((err) => console.error(err));
  }, [from, to]);

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
        ? filtered.reduce(
            (prev, cur) => ({ ...prev, [getFileKey(cur)]: false }),
            {},
          )
        : {},
    );
    setExpandAll((v) => !v);
  };

  if (!from || !to)
    return (
      <div className="mt-8 mb-40 flex items-center justify-center text-gray-500">
        Please select two versions
      </div>
    );

  if (from === to)
    return (
      <div className="mt-8 mb-40 flex items-center justify-center text-gray-500">
        Please select two different versions
      </div>
    );

  const files = patch ? parseDiff(patch, { nearbySequences: "zip" }) : [];

  const ignoredFiles = [".metadata"];
  const ignoredExtensions = [".png", ".ico"];

  const isIgnored = (file: HunkFile) => {
    const name = file.type === "delete" ? file.oldPath : file.newPath;
    if (ignoredFiles.includes(name)) return true;
    if (ignoredExtensions.some((v) => name.endsWith(v))) return true;
    return false;
  };

  const filtered = files.filter((v) => {
    if (isIgnored(v)) return false;
    const name = v.type === "delete" ? v.oldPath : v.newPath;
    const dir = name.split("/")[0];
    // root files
    if (!allPlatforms.map((v) => v.toLowerCase()).includes(dir)) return true;
    // platform specific files
    return platforms?.has(dir) ?? true;
  });

  const getFileKey = (file: HunkFile) => file.oldPath + "-" + file.newPath;

  return (
    <div className="mb-40">
      <div className="mb-3 flex flex-row items-center justify-between rounded-md">
        {filtered.length} files
        <TextButton
          label={expandAll ? "Collapse All" : "Expand All"}
          onClick={onExpandAll}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-2 text-gray-500">
          <p className="text-lg font-medium">No changes detected</p>
          <p className="text-sm text-gray-400">
            Try selecting different versions or platforms.
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((file) => {
            const key = getFileKey(file);
            return (
              <FileDiff
                key={key}
                file={file}
                show={visibility[key] ?? true}
                onClickExpand={() => onVisibilityChange(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FileDiff({
  file,
  show,
  onClickExpand,
}: {
  file: HunkFile;
  show: boolean;
  onClickExpand: () => void;
}) {
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
    () => getHunksWithAppName(file.hunks),
    [file.hunks, getHunksWithAppName],
  );

  const tokens: HunkTokens = useMemo(
    () =>
      tokenize(file.hunks, {
        enhancers: [markEdits(updatedHunks)],
      }),
    [file.hunks, updatedHunks],
  );

  return (
    <FileTile file={file} visible={show} onExpand={onClickExpand}>
      {show && (
        <Diff
          viewType="split"
          diffType={file.type}
          hunks={file.hunks}
          optimizeSelection
          tokens={tokens}
        />
      )}
    </FileTile>
  );
}
