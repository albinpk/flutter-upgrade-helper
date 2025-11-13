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
  setFrom,
  setTo,
  platforms,
  setPlatform,
}: {
  versions: string[];
  setFrom: (version: string) => void;
  setTo: (version: string) => void;
  platforms: Set<string>;
  setPlatform: (platforms: string) => void;
}) {
  return (
    <form className="max-w-sm mx-auto">
      <div className="flex gap-4">
        <div className="flex-1">
          <VersionDropdown
            label="Current version"
            versions={versions}
            onChange={setFrom}
          />
        </div>
        <div className="flex-1">
          <VersionDropdown
            label="New version"
            versions={versions}
            onChange={setTo}
          />
        </div>
      </div>

      <div className="flex mt-5">
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
    <div className="flex items-center me-4">
      <input
        id={platform}
        type="checkbox"
        checked={checked}
        value={platform}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
  versions,
  onChange,
}: {
  label: string;
  versions: string[];
  onChange: (version: string) => void;
}) {
  return (
    <div className="">
      <label
        htmlFor={label}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={label}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(v) => onChange(v.target.value)}
        defaultValue={""}
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
