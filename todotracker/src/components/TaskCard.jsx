import React from "react";
import { useDrag } from 'react-dnd';
import "./TaskCard.css";
import Tag from "./Tag";
import deleteIcon from "../assets/wastebasket.png";

const TaskCard = ({ title, tags, handleDelete, index, id, status, dueDate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id }, // Pass id instead of index
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <article 
      ref={drag}
      className='task_card'
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      <p className={`task_text ${status === 'done' ? 'task_done' : ''}`}>{title}</p>
      {dueDate && <p className='task_due_date'>Due: {new Date(dueDate).toLocaleString()}</p>}
      <div className='task_card_bottom_line'>
        <div className='task_card_tags'>
          {tags.map((tag, i) => (
            <Tag key={i} tagName={tag.name} selected tagColor={tag.color} />
          ))}
        </div>
        <div
          className='task_delete'
          onClick={() => handleDelete(index)}>
          <img src={deleteIcon} className='delete_icon' alt='Delete' />
        </div>
      </div>
    </article>
  );
};

export default TaskCard;