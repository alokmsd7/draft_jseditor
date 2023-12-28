import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw, convertFromRaw
} from "draft-js";

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const parsedContent = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(parsedContent));
    }
  }, []);

  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: "line-through",
    },
    RED_LINE: {
      color: "red",
    },
    UNDER_LINE: {
      textDecoration: "underline",
    },
    HEADER: {
      fontSize: "30px",
      fontWeight: "600",
    },
    BOLDEDIT: {
      fontSize: "6px",
      fontWeight: "60",
    },
  };

  const handleKeyCommand = (command, currentEditorState) => {
    let newState;
    if (command === "single-asterisk-styling" && currentEditorState) {
      newState = RichUtils.toggleInlineStyle(currentEditorState, "BOLD");
    } else if (command === "double-asterisk-styling" && currentEditorState) {
      newState = RichUtils.toggleInlineStyle(currentEditorState, "RED_LINE");
    } else if (command === "triple-asterisk-styling" && currentEditorState) {
      newState = RichUtils.toggleInlineStyle(currentEditorState, "UNDERLINE");
    } else if (command === "styling" && currentEditorState) {
      newState = RichUtils.toggleInlineStyle(currentEditorState, "HEADER");
    }
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const myKeyBindingFn = (e) => {
    if (e.shiftKey && e.keyCode === 56) {
      if (e.getModifierState("Shift")) {
        if (e.repeat) {
          if (e.getModifierState("Alt")) {
            return "triple-asterisk-styling";
          }
          return "double-asterisk-styling";
        }
        return "single-asterisk-styling";
      }
    } else if (e.shiftKey && e.keyCode === 51) {
      return "styling";
    }

    return getDefaultKeyBinding(e);
  };
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", rawContentState);
    setFeedbackMessage("Content saved successfully.");
  };

  const handleClear = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear the content?"
    );
    if (confirmed) {
      localStorage.removeItem("editorContent");
      setEditorState(EditorState.createEmpty());
      setFeedbackMessage("Content cleared successfully.");
    }
  };

  document.body.style.backgroundColor = '#212121';
  document.body.style.color = '#fff';


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc', background: '#87CEEB', color: '#fff' }}>
        <h1 style={{ margin: 0 }}>Editor Js</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ padding: '8px 12px', fontSize: '14px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Save</button>
          <button onClick={handleClear} style={{ padding: '8px 12px', fontSize: '14px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Clear</button>
        </div>
      </div>
      {feedbackMessage && <p style={{ padding: '10px', background: '#e0f7fa', color: '#00796b', borderRadius: '4px' }}>{feedbackMessage}</p>}

      <div style={{ display: 'flex', justifyContent: 'center', background: '#212121', color: '#fff', padding: '20px', minHeight: '200px' }}>
        <div style={{ width: '60%' }}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={myKeyBindingFn}
            ref={editorRef}
            customStyleMap={styleMap}
            placeholder="* Start Typing From Here"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomEditor;
