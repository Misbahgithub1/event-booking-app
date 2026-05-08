import { ReactNode } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100">
        {children}
      </main>
    </>
  );
};

export default Layout;