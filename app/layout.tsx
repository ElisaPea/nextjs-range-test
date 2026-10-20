import { Navigation } from "@/components/navigation/Navigation";
import "@/styles/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
