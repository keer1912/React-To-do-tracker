import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./TaskForm.css";
import Tag from "./Tag";

const TaskForm = ({ setTasks }) => {
  const [taskData, setTaskData] = useState({
    task: "",
    status: "todo",
    tags: [],
    dueDate: ""
  });

  const pastelColors = [
    '#f0fad4', '#e7d8f5', '#fcb3ce', '#f0bcfc', '#d6c9ec', '#dadeb6',
    '#bae8ee', '#bdbee4', '#d5dcdb', '#ccd8d4', '#bac6de', '#f1fcc6',
    '#e8ecea', '#eac4c4', '#d9d9fb', '#d9e3b9', '#cfbfe3', '#f1e3f5',
    '#eac2e8', '#c3e2f7'
  ];

  const getRandomPastelColor = () => {
    const usedColors = JSON.parse(localStorage.getItem('usedColors')) || [];
    const availableColors = pastelColors.filter(color => !usedColors.includes(color));
    if (availableColors.length === 0) return null;
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    usedColors.push(randomColor);
    localStorage.setItem('usedColors', JSON.stringify(usedColors));
    return randomColor;
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [availableTags, setAvailableTags] = useState(JSON.parse(localStorage.getItem('tags')) || []);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(availableTags));
  }, [availableTags]);

  const checkTag = (tag) => {
    return taskData.tags.some((item) => item.name === tag.name);
  };

  const selectTag = (tag) => {
    if (taskData.tags.some((item) => item.name === tag.name)) {
      const filterTags = taskData.tags.filter((item) => item.name !== tag.name);
      setTaskData((prev) => {
        return { ...prev, tags: filterTags };
      });
    } else {
      setTaskData((prev) => {
        return { ...prev, tags: [...prev.tags, tag] };
      });
    }
  };

  const handleAddNewTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !availableTags.some(tag => tag.name === newTag.trim())) {
      const tagColor = getRandomPastelColor();
      if (!tagColor) {
        alert("No more colors available for new tags.");
        return;
      }
      const newTagData = { name: newTag.trim(), color: tagColor };
      setAvailableTags(prev => [...prev, newTagData]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagName) => {
    setAvailableTags(prev => prev.filter(tag => tag.name !== tagName));
    setTaskData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.name !== tagName)
    }));
    setContextMenu(null);
  };

  const handleContextMenu = (event, tagName) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      tagName
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks((prev) => {
      return [...prev, { ...taskData, id: Date.now() + Math.random() }];
    });
    setTaskData({
      task: "",
      status: "todo",
      tags: [],
      dueDate: ""
    });
    setShowDatePicker(false);
  };

  return (
    <header className="app_header">
      <form onSubmit={handleSubmit}>
        <div className="task_input_container">
          <input
            type="text"
            name="task"
            value={taskData.task}
            className="task_input"
            placeholder="Enter your task"
            onChange={handleChange}
            required
          />
          <button 
            type="button" 
            className="calendar_button"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FontAwesomeIcon icon={faCalendar} />
          </button>
        </div>

        {showDatePicker && (
          <div className="date_picker_container">
            <input
              type="datetime-local"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              className="date_picker"
            />
          </div>
        )}

        <div className="task_form_bottom_line">
          <div className="tag_container">
            <div className="custom_tag_input">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                className="tag_input"
              />
              <button 
                type="button"
                onClick={handleAddNewTag}
                className="add_tag_button"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="tags_list">
              {availableTags.map((tag, index) => (
                <div key={index} onContextMenu={(e) => handleContextMenu(e, tag.name)}>
                  <Tag
                    tagName={tag.name}
                    selectTag={selectTag}
                    selected={checkTag(tag)}
                    tagColor={tag.color}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <select
              name="status"
              value={taskData.status}
              className="task_status"
              onChange={handleChange}
            >
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <button type="submit" className="task_submit">
              + Add Task
            </button>
          </div>
        </div>
      </form>

      {contextMenu && (
        <div
          className="context_menu"
          style={{
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
          }}
          onClick={() => handleDeleteTag(contextMenu.tagName)}
        >
          Delete Tag
        </div>
      )}
    </header>
  );
};

export default TaskForm;