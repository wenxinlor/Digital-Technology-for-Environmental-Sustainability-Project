"use client";

import React  from "react";
import Navbar from "@/components/layout/navbar";
import { Suspense } from "react";
import { Toaster } from "sonner";
import {LoadingSpinner }from "@/components/loadingSpinner";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-ash max-h-screen h-screen">
      {/* static content */}

      {/* dynamic content */}
      <main className="py-4 max-h-full h-full">
        <div className="col-span-12 sm:my-4 md:mt-0 max-h-full h-full ">
          {/* Content for the main column */}
          <Suspense fallback={<LoadingSpinner />}>
          {children}
          </Suspense>
        </div>
      </main>
      {/* add nav bar here */}
      <Toaster />
      <Navbar />
    </div>
  );
};

export default MainLayout;
