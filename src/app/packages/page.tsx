"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Tabs, Typography } from "antd";
import { ComboPackageTab, ExtraPackageTab, MainPackageTab } from "./_packages";

export default function Dashboard() {
  const items = [
    {
      key: "1",
      label: "Main Package",
      children: <MainPackageTab />,
    },
    {
      key: "2",
      label: "Extra Package",
      children: <ExtraPackageTab />,
    },
    {
      key: "3",
      label: "Combo Package",
      children: <ComboPackageTab />,
    },
  ];

  return (
    <>
      <DefaultLayout>
        <Typography.Title>Packages</Typography.Title>
        <Tabs defaultActiveKey="1" items={items} />
      </DefaultLayout>
    </>
  );
}
