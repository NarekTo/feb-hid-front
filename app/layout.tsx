import Providers from "./Providers";
import Navbar from "./components/UI_SECTIONS/header/Navbar";
//import Navbar from "./components/UI SECTIONS/Navbar";
import "./globals.css";
import { Rubik } from "next/font/google";
import { RootLayoutProps } from "./types";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "HESCO MGMT SOFTWARE",
  description: "Coded by the Hid it crew in Madrid",
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" className="h-screen m-0 p-0">
      <Providers>
        <body
          className={`${rubik.className} w-full h-full flex flex-col no-scrollbar`}
        >
          <Navbar />

          <main className="flex-grow flex ">{children}</main>
        </body>
      </Providers>
    </html>
  );
};

export default RootLayout;
