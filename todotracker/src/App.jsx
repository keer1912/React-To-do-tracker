import React, { useState, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskColumn from "./components/TaskColumn";
import todoIcon from "./assets/dart.png";
import doingIcon from "./assets/pencil2.png";
import doneIcon from "./assets/white_check_mark.png";

const getInitialTasks = () => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) return [];
    
    const parsedTasks = JSON.parse(savedTasks);
    // Filter out any invalid tasks and ensure each task has an id
    return parsedTasks.filter(task => 
      task && 
      typeof task === 'object' && 
      task.status && 
      typeof task.status === 'string'
    ).map(task => ({
      ...task,
      id: task.id || Date.now() + Math.random()
    }));
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error);
    return [];
  }
};

const App = () => {
  const [tasks, setTasks] = useState(getInitialTasks);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleDelete = (taskIndex) => {
    setTasks(prevTasks => prevTasks.filter((_, index) => index !== taskIndex));
  };

  const handleDrop = (taskId, targetStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: targetStatus } : task
      )
    );
  };

  // Modify setTasks to add id to new tasks
  const handleSetTasks = (taskUpdater) => {
    setTasks(prevTasks => {
      const newTasks = taskUpdater(prevTasks);
      // If the last task doesn't have an id, add one
      if (newTasks.length > prevTasks.length) {
        const lastTask = newTasks[newTasks.length - 1];
        if (!lastTask.id) {
          newTasks[newTasks.length - 1] = {
            ...lastTask,
            id: Date.now() + Math.random()
          };
        }
      }
      return newTasks;
    });
  };

  const getFilteredTasks = (status) => 
    tasks.filter(task => task && task.status === status);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <TaskForm setTasks={handleSetTasks} />
        <main className="app_main">
          <TaskColumn
            title="To do"
            icon={todoIcon}
            tasks={getFilteredTasks("todo")}
            status="todo"
            handleDelete={handleDelete}
            handleDrop={handleDrop}
          />
          <TaskColumn
            title="Doing"
            icon={doingIcon}
            tasks={getFilteredTasks("doing")}
            status="doing"
            handleDelete={handleDelete}
            handleDrop={handleDrop}
          />
          <TaskColumn
            title="Done"
            icon={doneIcon}
            tasks={getFilteredTasks("done")}
            status="done"
            handleDelete={handleDelete}
            handleDrop={handleDrop}
          />
        </main>
      </div>
    </DndProvider>
  );
};

export default App;