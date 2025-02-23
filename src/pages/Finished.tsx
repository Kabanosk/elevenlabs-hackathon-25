import React from "react";
import { Card } from "../components/ui/card";
const Finished = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-foreground">Your interview has ended</h1>
      </Card>
    </div>
  );
};
export default Finished;
