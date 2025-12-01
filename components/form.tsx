import { useRouter } from "next/router";

export const allPlatforms = [
  "Android",
  "iOS",
  "Windows",
  "MacOS",
  "Linux",
  "Web",
];

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
  const from = `${router.query.from ?? ''}`;
  const to = `${router.query.to ??''}`

  return (
    <form className="mx-auto max-w-sm">
      <div className="flex gap-4">
        <div className="flex-1">
          <VersionDropdown
            label="Current version"
            value={from}
            versions={versions}
            onChange={(v)=>{
              router.replace({
                query: {
                  ...router.query,
                  from: v
                }
              })
            }}
          />
        </div>
        <div className="flex-1">
          <VersionDropdown
            label="New version"
            value={to}
            versions={versions}
            onChange={(v)=>{
              router.replace({
                query: {
                  ...router.query,
                  to: v
                }
              })
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {allPlatforms.map((platform) => (
          <Check
            key={platform}
            platform={platform}
            checked={platforms.has(platform.toLowerCase())}
            onChange={setPlatform}
          />
        ))}
      </div>
    </form>
  );
}

function Check({
  platform,
  checked,
  onChange,
}: {
  platform: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="me-4 flex items-center">
      <input
        id={platform}
        type="checkbox"
        checked={checked}
        value={platform}
        className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        onChange={(e) => onChange(e.target.value)}
      />
      <label
        htmlFor={platform}
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {platform}
      </label>
    </div>
  );
}

function VersionDropdown({
  label,
  value,
  versions,
  onChange,
}: {
  label: string;
  value: string | undefined;
  versions: string[];
  onChange: (version: string) => void;
}) {
  return (
    <div className="">
      <label
        htmlFor={label}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={label}
        value={value ?? ''}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        onChange={(v) => onChange(v.target.value)}
        // defaultValue={""}
      >
        <option value="" disabled>
          Select a version
        </option>
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
