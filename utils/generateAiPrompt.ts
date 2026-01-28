import { ignoredExtensions, ignoredFiles } from "@/components/DiffView";
import { allPlatforms } from "@/components/Form";

export const generateAiPrompt = (
  rawDiff: string,
  from: string,
  to: string,
  platforms: Set<string>,
): string | null => {
  const ignoredPaths = [...ignoredFiles, ...ignoredExtensions];
  const parts = rawDiff.split("diff --git ");
  const platformNames = allPlatforms.map((v) => v.toLowerCase());
  const diff = parts
    .filter((v) => {
      const nameLine = v.split("\n")[0];
      const name = nameLine.replace("a/", "");
      return (
        !ignoredPaths.some((e) => nameLine.includes(e)) &&
        (platformNames.every((dir) => !name.startsWith(dir)) ||
          platforms.has(name.split("/")[0]))
      );
    })
    .join("\ndiff --git ")
    .trim();
  return diff ? promptContext(diff, from, to) : null;
};

const promptContext = (diff: string, from: string, to: string) => {
  return `
This Flutter project is being upgraded to a newer Flutter SDK version.

Please help apply relevant Flutter SDK template changes to this project,
using the provided diff only as a reference for what changed.

────────────────────────────────────────
UPGRADE CONTEXT
────────────────────────────────────────
- Base Flutter SDK version: ${from}
- Target Flutter SDK version: ${to}

────────────────────────────────────────
IMPORTANT CONSTRAINTS
────────────────────────────────────────
- The diff is generated from official Flutter SDK template projects.
- This project is NOT identical to the Flutter template.
- Line numbers in the diff DO NOT match this project.
- File paths in the diff are prefixed with \`a/\` and \`b/\` (standard Git diff notation)
  and do NOT represent actual directory names in this project.
- Always map file paths by relative location (e.g., \`pubspec.yaml\`,
  \`android/app/build.gradle\`, etc.), not by the \`a/\` or \`b/\` prefixes.
- Do NOT rely on line numbers.
- Always match changes using file paths and surrounding code context.
- Preserve all existing application logic unless a change is explicitly required.
- Do NOT remove user-written code unless the change is clearly necessary.
- Do NOT blindly delete files marked as deleted in the diff.

────────────────────────────────────────
INSTRUCTIONS
────────────────────────────────────────
For each file in the diff:

1. If the file exists in this project:
   - Locate the relevant section using surrounding code context.
   - Apply equivalent changes carefully.
2. If the file does not exist:
   - Decide whether it should be added based on the template change.
3. If a file is marked as RENAMED:
   - Treat it as a move and preserve existing content.
4. If a file is marked as DELETED:
   - Remove it only if it is a generated or template-only file.
5. If a change is ambiguous:
   - Explain the reasoning before applying it.

────────────────────────────────────────
FLUTTER TEMPLATE DIFF
────────────────────────────────────────
NOTE:
Line numbers and \`a/\` / \`b/\` path prefixes belong to Flutter SDK templates
and Git diff formatting. Always apply changes using semantic context and
relative file paths, NOT line numbers or literal prefixes.

--- BEGIN FLUTTER TEMPLATE DIFF ---
${diff}
--- END FLUTTER TEMPLATE DIFF ---

────────────────────────────────────────
FINAL NOTE
────────────────────────────────────────
If any change cannot be applied safely, explain why and suggest alternatives.

This diff was generated using Flutter Upgrade Helper:
https://flutter-upgrade-helper.site/?from=${from}&to=${to}
`;
};
