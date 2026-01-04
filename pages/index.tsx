import DiffView from "@/components/DiffView";
import fs from "fs";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import path from "path";
import { useState } from "react";
import "react-diff-view/style/index.css";
import { SiFlutter } from "react-icons/si";
import Form, { allPlatforms } from "../components/form";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const compareSemanticVersions = (a: string, b: string) => {
  // 1. Split the strings into their parts.
  const a1 = a.split(".");
  const b1 = b.split(".");
  // 2. Contingency in case there's a 4th or 5th version
  const len = Math.min(a1.length, b1.length);
  // 3. Look through each version number and compare.
  for (let i = 0; i < len; i++) {
    const a2 = +a1[i] || 0;
    const b2 = +b1[i] || 0;

    if (a2 !== b2) {
      return a2 > b2 ? 1 : -1;
    }
  }

  // 4. We hit this if the all checked versions so far are equal
  //
  return b1.length - a1.length;
};

export async function getStaticProps() {
  const jsonPath = path.join(process.cwd(), "public", "data", "versions.json");
  const content = fs.readFileSync(jsonPath, "utf8");
  const versions = JSON.parse(content);
  return {
    props: { versions: versions.sort(compareSemanticVersions).reverse() },
  };
}

export default function Home({ versions }: { versions: string[] }) {
  const [platform, setPlatform] = useState(
    new Set<string>(allPlatforms.map((v) => v.toLowerCase())),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="m-2 sm:m-8">
        <div className="flex flex-col items-center py-6 sm:py-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <SiFlutter className="h-6 w-6 text-[#02569B] sm:h-8 sm:w-8 dark:text-[#4AC3E7]" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl dark:text-white">
              Flutter Upgrade Helper
            </h1>
          </div>
        </div>

        <Form
          versions={versions}
          platforms={platform}
          setPlatform={(value) => {
            const v = value.toLowerCase();
            setPlatform((o) => {
              const n = new Set(platform);
              if (n.has(v)) n.delete(v);
              else n.add(v);
              return n;
            });
          }}
        />
        <div className="h-4"></div>

        <DiffView platforms={platform} />
      </div>
    </ThemeProvider>
  );
}
