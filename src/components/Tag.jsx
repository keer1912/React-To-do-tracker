import React from "react";
import "./Tag.css";

const Tag = ({ tagName, selectTag, selected, tagColor }) => {
    return (
        <button
            type='button'
            className={`tag ${selected ? 'selected' : ''}`}
            style={{ color: selected ? 'black' : 'white', backgroundColor: selected ? tagColor : 'transparent', borderColor: tagColor }}
            onClick={() => selectTag({ name: tagName, color: tagColor })}>
            {tagName}
        </button>
    );
};

export default Tag;