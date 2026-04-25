import { FiCode, FiUpload } from "react-icons/fi";
import "./Workspace.css";

function InputPane({
    byteCount,
    charCount,
    editorValue,
    inputLineNumbers,
    inputScrollTop,
    isDragging,
    lineCount,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onEditorChange,
    onInputScroll,
}) {
    return (
        <section className="workspace-pane workspace-pane--input">
            <div className="workspace-pane__header">
                <div className="workspace-pane__title">
                    <FiCode />
                    <span>Editor</span>
                </div>

                <div className="workspace-pane__meta">
                    <span>{charCount.toLocaleString()} chars</span>
                    <span>{lineCount.toLocaleString()} lines</span>
                    <span>{byteCount.toLocaleString()} bytes</span>
                </div>
            </div>

            <div
                className={`workspace-pane__body workspace-pane__body--editor${isDragging ? " workspace-pane__body--dragging" : ""}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}>
                <div
                    className="editor-grid"
                    style={{
                        "--line-number-width": `${Math.max(2, String(lineCount).length) + 2}ch`,
                    }}>
                    <div className="line-gutter" aria-hidden="true">
                        <div
                            className="line-gutter__inner"
                            style={{
                                transform: `translateY(-${inputScrollTop}px)`,
                            }}>
                            {inputLineNumbers.map((lineNumber) => (
                                <div
                                    key={lineNumber}
                                    className="line-gutter__line">
                                    {lineNumber}
                                </div>
                            ))}
                        </div>
                    </div>

                    <textarea
                        className="json-textarea"
                        aria-label="JSON input"
                        placeholder="Paste your JSON here..."
                        spellCheck={false}
                        value={editorValue}
                        wrap="off"
                        onChange={(event) => onEditorChange(event.target.value)}
                        onScroll={(event) =>
                            onInputScroll(event.currentTarget.scrollTop)
                        }
                    />
                </div>

                {isDragging ? (
                    <div className="dropzone-overlay">
                        <FiUpload />
                        <span>Drop a JSON file to load it</span>
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default InputPane;
