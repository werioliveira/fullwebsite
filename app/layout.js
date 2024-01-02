import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./components/Provider";

import NewNav from "./components/NewNav";
import Carousel from "./components/Carousel";
import { GlobalProvider } from "./GlobalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WSell",
  description: "Cloths store to you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <Provider>
        <body className={inter.className}>
          <GlobalProvider>
            <NewNav />
            <Carousel />
            {children}
          </GlobalProvider>
        </body>
      </Provider>
    </html>
  );
}
