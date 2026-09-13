import type { Metadata } from "next";
import { StoreProvider } from "@/components/store";
import { Shell } from "@/components/shell";
import "./globals.css";
import "./search-fidelity.css";
import "./mobile-fidelity.css";
export const metadata: Metadata = {
  title: "Amazon.com. Spend less. Smile more.",
  description:
    "Explore deals, discover products, and try a complete demo shopping experience.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
