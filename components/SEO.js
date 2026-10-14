import Head from "next/head";

export default function SEO({
  title = "WatchStore — Premium Horology & Luxury Watches",
  description = "Discover an exquisite curated collection of luxury timepieces, chronographs, and precision automatic watches at WatchStore with certified authenticity and 2-year warranty.",
  ogImage = "/og-image.jpg",
  ogType = "website",
}) {
  const fullTitle = title.includes("WatchStore") ? title : `${title} | WatchStore`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
