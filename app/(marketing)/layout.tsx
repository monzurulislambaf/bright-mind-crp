import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StructuredData } from "@/components/site/StructuredData";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <StructuredData />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
