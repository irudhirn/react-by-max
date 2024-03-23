import { useState } from "react";
import NewProject from "./components/NewProject";
import NoProjectSelected from "./components/NoProjectSelected";
import ProjectsSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";

function App() {
  const [projectState, setProjectState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: []
  });

  function handleAddTask(text){
    setProjectState((prev) => {
      const taskId = Math.random();
      const newTask = {
        text: text,
        id: taskId,
        projectId: prev.selectedProjectId
      }
  
      return {
        ...prev,
        // selectedProjectId: undefined,
        tasks: [newTask, ...prev.tasks]
      }
    });
  }

  function handleDeleteTask(id){
    setProjectState((prev) => ({...prev, tasks: prev.tasks.filter((task) => task.id !== id)}));
  }

  function handleCancelAddProject(){
    setProjectState((prev) => {
      return {
        ...prev,
        selectedProjectId: undefined,
      }
    });    
  }

  function handleAddProject(projectData){
    setProjectState((prev) => {
      const newProject = {
        ...projectData,
        id: Math.random(),
      }

      return {
        ...prev,
        selectedProjectId: undefined,
        projects: [...prev.projects, newProject]
      }
    });
  }
  
  function handleStartAddProject(){
    setProjectState((prev) => {
      return {
        ...prev,
        selectedProjectId: null,
      }
    });
  }

  function handleSelectProject(id){
    setProjectState((prev) => ({...prev, selectedProjectId: id}))
  }

  function handleDeleteProject(){
    setProjectState((prev) => ({...prev, projects: prev.projects.filter((project) => project.id !== prev.selectedProjectId), selectedProjectId: undefined}));
  }

  const selectedProject = projectState.projects.find((project) => project.id === projectState.selectedProjectId)

  let content = <SelectedProject project={selectedProject} onDelete={handleDeleteProject} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} tasks={projectState.tasks} />;

  if(projectState.selectedProjectId === null){
    content = <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />
  } else if (projectState.selectedProjectId === undefined){
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar selectedProjectId={projectState.selectedProjectId} onStartAddProject={handleStartAddProject} projects={projectState.projects} onSelectProject={handleSelectProject} />
      {/* <NewProject /> */}
      {/* <NoProjectSelected onStartAddProject={handleStartAddProject} /> */}
      {content}
    </main>
  );
}

export default App;
