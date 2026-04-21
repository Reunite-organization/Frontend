import React from "react";

export const WantedHeader = () => {
  return (
    <header className="p-4 bg-white shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-bold">Reunite</h1>
      <nav>
        <ul className="flex gap-4">
          <li>Home</li>
          <li>Browse</li>
          <li>Create</li>
        </ul>
      </nav>
    </header>
  );
};

