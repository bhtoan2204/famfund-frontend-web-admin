"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <DefaultLayout>
      <div>Redirecting...</div>
    </DefaultLayout>
  );
};

export default Home;
