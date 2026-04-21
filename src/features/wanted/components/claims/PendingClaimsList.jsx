import React from "react";
import ClaimReviewCard from "./ClaimReviewCard";

const PendingClaimsList = () => {
  return (
    <section>
      <h3 className="text-xl font-bold mb-4">Pending Claims for your Posts</h3>
      <div className="space-y-4">
        <ClaimReviewCard />
        <ClaimReviewCard />
      </div>
    </section>
  );
};

export default PendingClaimsList;
