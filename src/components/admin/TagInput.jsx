import React, { useState, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/tagInput.css";

const TagInput = ({ tags = [], onChange, placeholder = "Add a tag..." }) => {
    const [input, setInput] = useState("");
    const [tagList, setTagList] = useState(tags);

    useEffect(() => {
        setTagList(tags);
    }, [tags]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const trimmedInput = input.trim();
            if (trimmedInput && !tagList.includes(trimmedInput)) {
                const newTags = [...tagList, trimmedInput];
                setTagList(newTags);
                onChange(newTags);
                setInput("");
            }
        } else if (e.key === "Backspace" && !input && tagList.length > 0) {
            const newTags = tagList.slice(0, -1);
            setTagList(newTags);
            onChange(newTags);
        }
    };

    const removeTag = (indexToRemove) => {
        const newTags = tagList.filter((_, index) => index !== indexToRemove);
        setTagList(newTags);
        onChange(newTags);
    };

    return (
        <div className="tag-input-container">
            <div className="tags-wrapper">
                {tagList.map((tag, index) => (
                    <div key={index} className="tag-chip">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(index)} className="tag-remove-btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tagList.length === 0 ? placeholder : ""}
                    className="tag-input-field"
                />
            </div>
            <small className="tag-help-text">Press Enter to add a tag</small>
        </div>
    );
};

export default TagInput;
