import type { Metadata } from "next";
import Navbar from "@/components/Navbar";



export const metadata: Metadata = {
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
        <body>
            <Navbar/>
          {children}
        </body>
    </html>
  );
}
