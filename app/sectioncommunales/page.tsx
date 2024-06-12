import RootLayout from "@/components/rootLayout";
import React, { Suspense } from "react";

const SectionCommunales: React.FC = () => {
  return (
    <RootLayout isAuthenticated={true}>
      <Suspense fallback={<div>loading...</div>}>
      <div>SectionCommunales</div>
      </Suspense>
    </RootLayout>
  );
};

export default SectionCommunales;
