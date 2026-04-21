import React from "react";

const ClaimReviewCard = () => {
  return (
    <div className="p-6 border rounded-xl flex items-center justify-between">
      <div>
        <h4 className="font-bold">Claim from Jane Smith</h4>
        <p className="text-sm text-gray-500">Post: Lost Golden Retriever</p>
      </div>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Review</button>
        <button className="bg-gray-100 px-4 py-2 rounded font-bold">Ignore</button>
      </div>
    </div>
  );
};

export default ClaimReviewCard;
