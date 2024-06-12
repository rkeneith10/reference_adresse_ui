import RootLayout from "@/components/rootLayout";
import React, { Suspense } from "react";

const Quartiers: React.FC = () => {
  return (
    <RootLayout isAuthenticated={true}>
      <Suspense fallback={<div>loading...</div>}> 
      <div>Quartiers</div>
      </Suspense>
    </RootLayout>
  );
};

export default Quartiers;
