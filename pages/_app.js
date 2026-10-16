import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import AnnouncementBar from "@/components/AnnouncementBar";
import CartDrawer from "@/components/CartDrawer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from "next/script";

const GlobalStyles = createGlobalStyle`
  :root {
    /* Colors */
    --color-background: #eeeeee;
    --color-surface: #ffffff;
    --color-text: #1a1a1a;
    --color-text-muted: #767676;
    --color-primary: #0D3D29;
    --color-primary-hover: #082619;
    --color-primary-contrast: #ffffff;
    --color-accent: #C8472B;
    --color-accent-hover: #a73720;
    --color-border: #cccccc;
    --color-border-light: rgba(0, 0, 0, 0.1);
    --color-success: #2E7D4F;
    --color-warning: #B7791F;
    --color-error: #B3261E;
    --color-header-bg: #222222;
    --color-header-text: #ffffff;
    --color-nav-link: #b5b5b5;
    --color-nav-link-hover: #ffffff;

    /* Typography */
    --font-heading: 'Playfair Display', Georgia, serif;
    --font-body: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-md: 1.1875rem;
    --font-size-lg: 1.4375rem;
    --font-size-xl: 1.75rem;
    --font-size-2xl: 2.0625rem;
    --font-size-3xl: 2.5rem;
    --font-size-4xl: 3rem;
    --line-height-body: 1.55;
    --line-height-heading: 1.2;

    /* Spacing */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    --space-6: 32px;
    --space-7: 48px;
    --space-8: 64px;
    --space-9: 96px;

    /* Layout */
    --max-width: 1200px;
    --gutter: 20px;
    --radius-sm: 5px;
    --radius-md: 10px;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    line-height: var(--line-height-body);
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: var(--line-height-heading);
    color: var(--color-text);
    margin-top: 0;
  }

  hr {
    display: block;
    border: 0;
    border-top: 1px solid var(--color-border);
    margin: var(--space-4) 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-WATCHSTORE123';
  const pixelId = process.env.NEXT_PUBLIC_PIXEL_ID;

  return (
    <>
      <GlobalStyles />

      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel */}
      {pixelId && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      <SessionProvider session={session}>
        <CartContextProvider>
          <ErrorBoundary>
            <AnnouncementBar />
            <Component {...pageProps} />
            <CartDrawer />
          </ErrorBoundary>
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
