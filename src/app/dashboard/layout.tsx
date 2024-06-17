import React from "react";
import Header from "./_components/Header";

interface RootLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default DashboardLayout;
