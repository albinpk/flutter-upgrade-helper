import NewDiff from "@/components/NewDiff";
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

export async function getStaticProps() {
  const jsonPath = path.join(process.cwd(), "public", "data", "versions.json");
  const content = fs.readFileSync(jsonPath, "utf8");
  const versions = JSON.parse(content);
  return { props: { versions } };
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

        {/* todo: file names */}
        <NewDiff from={from} to={to} platforms={platform} />
        {/* <Diff from={from} to={to} platforms={platform} /> */}
      </div>
    </ThemeProvider>
  );
}
