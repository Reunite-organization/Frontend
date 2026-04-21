import React from "react";
import MemoryInput from "./MemoryInput";
import LocationPicker from "./LocationPicker";
import QuestionBuilder from "./QuestionBuilder";
import CategorySelector from "./CategorySelector";

const PostForm = () => {
  return (
    <form className="space-y-8">
      <div><label className="block mb-2 font-medium">Title</label><input type="text" className="w-full border p-2 rounded" /></div>
      <CategorySelector />
      <LocationPicker />
      <MemoryInput />
      <QuestionBuilder />
      <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">Publish Post</button>
    </form>
  );
};

export default PostForm;
