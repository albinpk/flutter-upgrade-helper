import DiffView from "@/components/DiffView";
import fs from "fs";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import path from "path";
import { useState } from "react";
import "react-diff-view/style/index.css";
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
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [platform, setPlatform] = useState(
    new Set<string>(allPlatforms.map((v) => v.toLowerCase())),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="m-8">
        <div className="mb-6 text-center text-2xl">Flutter Upgrade Helper</div>

        <Form
          versions={versions}
          setFrom={setFrom}
          setTo={setTo}
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

        <DiffView from={from} to={to} platforms={platform} />
      </div>
    </ThemeProvider>
  );
}
