import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NextPage } from "next";

const Home: NextPage = () => {
  // Redirect to "/dashboard" when the Server Component renders
  if (typeof window === "undefined") {
    return (
      <>
        <DefaultLayout>
          <div>Dashboard</div>
        </DefaultLayout>
      </>
    );
  } else {
    return null; // Don't render anything on the client-side
  }
};

export default Home;
