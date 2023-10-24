import Providers from "./Providers";
import Navbar from "./components/UI_SECTIONS/header/Navbar";
//import Navbar from "./components/UI SECTIONS/Navbar";
import "./globals.css";
import { Rubik } from "next/font/google";
import { RootLayoutProps } from "./types";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "HESCO SOFTWARE",
  description: "Generated by create next app",
};



const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Providers>
        <body className={`${rubik.className} w-full h-screen flex flex-col`}>
        <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </body>
      </Providers>
    </html>
  );
}

export default RootLayout;