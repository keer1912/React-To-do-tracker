import React from "react";
import { useDrop } from 'react-dnd';
import "./TaskColumn.css";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, icon, tasks, status, handleDelete, handleDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => handleDrop(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <section 
      ref={drop} 
      className={`task_column ${isOver ? 'drag-over' : ''}`}
    >
      <h2 className='task_column_heading'>
        <img className='task_column_icon' src={icon} alt='' /> {title}
      </h2>

      {tasks.map((task, index) => (
        <TaskCard
          key={task.id || index}
          id={task.id}
          title={task.task}
          tags={task.tags}
          status={task.status}
          dueDate={task.dueDate}
          handleDelete={handleDelete}
          index={index}
        />
      ))}
    </section>
  );
};

export default TaskColumn;