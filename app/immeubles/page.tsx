import RootLayout from "@/components/rootLayout";
import React, { Suspense } from "react";

const Immeubles: React.FC = () => {
  return (
    <RootLayout isAuthenticated={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <div>Immeubles</div>
      </Suspense>
    </RootLayout>
  );
};

export default Immeubles;
