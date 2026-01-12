import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GitHubButton from "react-github-btn";
import { BiGitCompare } from "react-icons/bi";
import {
  FaAndroid,
  FaApple,
  FaGlobe,
  FaLinux,
  FaWindows,
} from "react-icons/fa6";
import { HiChevronDown } from "react-icons/hi2";

export const allPlatforms = [
  "Android",
  "iOS",
  "Windows",
  "MacOS",
  "Linux",
  "Web",
];

const PlatformIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const props = { className };
  switch (name.toLowerCase()) {
    case "android":
      return <FaAndroid {...props} />;
    case "ios":
      return <FaApple {...props} />;
    case "macos":
      return <FaApple {...props} />;
    case "windows":
      return <FaWindows {...props} />;
    case "linux":
      return <FaLinux {...props} />;
    case "web":
      return <FaGlobe {...props} />;
    default:
      return null;
  }
};

export default function Form({
  versions,
  platforms,
  setPlatform,
}: {
  versions: string[];
  platforms: Set<string>;
  setPlatform: (platforms: string) => void;
}) {
  const router = useRouter();
  const from = `${router.query.from ?? ""}`;
  const to = `${router.query.to ?? ""}`;

  const [fullVersion, setFullVersion] = useState(versions);
  const [fromList, setFromList] = useState(versions);
  const [toList, setToList] = useState(versions);

  const [hideBugfixes, setHideBugfixes] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHideBugfixes(localStorage.getItem("hideBugfixes") === "true");
  }, []);

  // versions list is paginated
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFullVersion(
      hideBugfixes ? versions.filter((v) => v.endsWith(".0")) : versions,
    );
  }, [versions, hideBugfixes]);

  useEffect(() => {
    const fromIdx = fullVersion.indexOf(from);
    if (fromIdx >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToList(fullVersion.slice(0, fromIdx));
    } else {
      setToList(fullVersion.slice(0, fullVersion.length - 1)); // remove first version
    }
  }, [from, fullVersion]);

  useEffect(() => {
    const toIdx = fullVersion.indexOf(to);
    if (toIdx >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFromList(fullVersion.slice(toIdx + 1));
    } else {
      setFromList(fullVersion.slice(1)); // remove last version
    }
  }, [to, fullVersion]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          <div className="flex items-start justify-between">
            {/* Hide Bugfixes */}
            <div className="flex items-center gap-2">
              <input
                id="hide-bugfixes"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
                checked={hideBugfixes}
                onChange={(e) => {
                  setHideBugfixes(e.target.checked);
                  localStorage.setItem(
                    "hideBugfixes",
                    e.target.checked.toString(),
                  );
                }}
              />
              <label
                htmlFor="hide-bugfixes"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Hide bugfix releases
              </label>
            </div>

            <GitHubButton
              href="https://github.com/albinpk/flutter-upgrade-helper"
              data-color-scheme="no-preference: light; light: light; dark: dark;"
              data-icon="octicon-star"
              data-show-count="true"
              aria-label="Star albinpk/flutter-upgrade-helper on GitHub"
            >
              Star
            </GitHubButton>
          </div>

          {/* Top Row: Version Selection */}
          <div className="flex flex-row gap-4 md:items-end">
            <div className="flex-1">
              <VersionDropdown
                label="Base Version"
                value={from}
                versions={fromList}
                placeholder="Select base"
                onChange={(v) => {
                  router.replace({
                    query: { ...router.query, from: v },
                  });
                }}
              />
            </div>

            {/* Comparison Icon */}
            <div className="flex items-center justify-center pb-2 md:pb-3">
              <div className="text-gray-400 dark:text-gray-500">
                <BiGitCompare size={24} />
              </div>
            </div>

            <div className="flex-1">
              <VersionDropdown
                label="Target Version"
                value={to}
                versions={toList}
                placeholder="Select target"
                onChange={(v) => {
                  router.replace({
                    query: { ...router.query, to: v },
                  });
                }}
              />
            </div>
          </div>

          {/* Bottom Row: Platform Selection */}
          <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter Platforms:
            </label>
            <div className="flex flex-wrap gap-2">
              {allPlatforms.map((platform) => (
                <PlatformToggle
                  key={platform}
                  platform={platform}
                  checked={platforms.has(platform.toLowerCase())}
                  onChange={() => setPlatform(platform)}
                />
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function VersionDropdown({
  label,
  value,
  versions,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  versions: string[];
  onChange: (version: string) => void;
  placeholder: string;
}) {
  return (
    <div className="group w-full">
      <label className="mb-1 ml-1 block text-[10px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="peer w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-3 font-mono text-sm text-gray-900 shadow-sm transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 transition-colors peer-focus:text-blue-500">
          <HiChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}

function PlatformToggle({
  platform,
  checked,
  onChange,
}: {
  platform: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        checked
          ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/30"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700/50"
      } `}
    >
      <PlatformIcon
        name={platform}
        className={checked ? "text-white" : "text-gray-400 dark:text-gray-500"}
      />
      <span>{platform}</span>
    </button>
  );
}
