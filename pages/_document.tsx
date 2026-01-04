import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Compare Flutter versions, view project template changes, and upgrade your Flutter apps safer and faster with a GitHub-style diff viewer."
        />
        <meta
          name="keywords"
          content="Flutter upgrade tool, Flutter version comparison, Flutter SDK diff, Flutter migrate, Flutter template changes, compare Flutter versions, upgrade Flutter project"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://flutter-upgrade-helper.albinpk.dev/"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Flutter Upgrade Helper" />
        <meta
          property="og:description"
          content="A developer-focused tool to compare Flutter versions and upgrade Flutter apps confidently."
        />
        <meta
          property="og:url"
          content="https://flutter-upgrade-helper.albinpk.dev/"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/albinpk/flutter-upgrade-helper/refs/heads/main/public/flutter-upgrade-helper-logo.png"
        />

        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/flutter-upgrade-helper-logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flutter Upgrade Helper" />
        <meta
          name="twitter:description"
          content="Compare versions and upgrade Flutter apps without missing file changes."
        />
        <meta
          name="twitter:image"
          content="https://flutter-upgrade-helper.albinpk.dev/flutter-upgrade-helper-logo.png"
        />

        {/* JSON-LD - Add using dangerouslySetInnerHTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Flutter Upgrade Helper",
              url: "https://flutter-upgrade-helper.albinpk.dev/",
              description:
                "Tool to compare Flutter SDK versions and visualize project template changes.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              creator: {
                "@type": "Person",
                name: "Albin PK",
                url: "https://github.com/albinpk",
              },
            }),
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
