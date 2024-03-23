import React from 'react';
import noProject from "../assets/no-projects.png";
import Button from './Button';

export default function NoProjectSelected({ onStartAddProject }) {
  return (
    <div className="mt-24 text-center w-2/3">
      <img src={noProject} alt="no-project" className="w-16 h-16 object-contain mx-auto" />
      <h2 className="text-ul font-bold text-stone-500 my-4">No project selected</h2>
      <p className="text-stone-400 mb-4">Select a project or get started with new one</p>
      <p className="mt-8">
        <Button onClick={onStartAddProject}>Create new project</Button>
      </p>
    </div>
  )
}
