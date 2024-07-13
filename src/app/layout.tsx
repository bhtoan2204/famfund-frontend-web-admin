"use client";
import Loader from "@/components/common/Loader";
import "@/css/satoshi.css";
import "@/css/style.css";
import ReduxProvider from "@/redux/redux-provider";
import "flatpickr/dist/flatpickr.min.css";
// import "jsvectormap/dist/css/jsvectormap.css";
import React, { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
          {/* </PersistGate> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
