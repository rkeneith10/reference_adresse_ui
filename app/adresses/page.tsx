import RootLayout from "@/components/rootLayout";
import React, { Suspense } from "react";

const Adresses: React.FC = () => {
  return (
    <RootLayout isAuthenticated={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <div>Adresses</div>
      </Suspense>
    </RootLayout>
  );
};

export default Adresses;
