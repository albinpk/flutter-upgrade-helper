import DiffView from "@/components/DiffView";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";
import "react-diff-view/style/index.css";
import { SiFlutter } from "react-icons/si";
import Form, { allPlatforms } from "../components/Form";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const octokit = new Octokit({});

export default function Home() {
  const router = useRouter();
  const [platform, setPlatform] = useState(
    new Set<string>(allPlatforms.map((v) => v.toLowerCase())),
  );

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const perPage = 100; // this is the max allowed by github
    const fetchTags = async () => {
      const get = async (page: number): Promise<string[]> => {
        try {
          const res = await octokit.rest.repos.listTags({
            owner: "albinpk",
            repo: "flutter-upgrade-helper-diff",
            per_page: perPage,
            page: page,
          });
          return res.data
            .filter((v) => v.name.startsWith("sdk-"))
            .map((v) => v.name.substring(4));
        } catch (err) {
          console.error(err);
          return [];
        }
      };

      const cachedTags = JSON.parse(
        localStorage.getItem("tags") ?? "[]",
      ) as string[];

      let page = 0;
      while (true) {
        const list = await get(++page);
        if (list.length === 0) break;

        // if we have cached tags, we only need the first page (recent tags)
        if (page === 1) {
          if (cachedTags.length > 0) {
            setTags(() => [...new Set([...list, ...cachedTags])]);
            break;
          }
        }

        setTags((o) => [...o, ...list]);
        if (list.length < perPage) break;
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (tags.length > 0) localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  const from = `${router.query.from ?? ""}`;
  const to = `${router.query.to ?? ""}`;

  const pageTitle =
    from && to && from !== to
      ? `Diff ${from} -> ${to} | Flutter Upgrade Helper`
      : "Flutter Upgrade Helper — Upgrade Flutter Projects with Confidence";

  const pageDescription =
    from && to && from !== to
      ? `Compare changes between Flutter SDK versions ${from} and ${to}. Visualize template updates and migrate with confidence.`
      : "Seamlessly compare changes across Flutter SDK versions. Upgrade your Flutter projects with confidence using our diff viewer.";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>
      <div className="m-2 sm:m-8">
        <div className="flex flex-col items-center py-6 sm:py-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <SiFlutter className="h-6 w-6 text-[#02569B] sm:h-8 sm:w-8 dark:text-[#4AC3E7]" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl dark:text-white">
              <Link href="/">Flutter Upgrade Helper</Link>
            </h1>
          </div>
        </div>

        <Form
          versions={tags}
          platforms={platform}
          setPlatform={(value) => {
            const v = value.toLowerCase();
            setPlatform((platform) => {
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
