import clsx from "clsx";
import {
    FiEye,
    FiFileText,
    FiMaximize2,
    FiMinimize2,
    FiX,
} from "react-icons/fi";
import LineNumberSurface from "./LineNumberSurface";
import JsonTreeView from "./JsonTreeView";
import "./Workspace.css";

function renderRawLines(lines) {
    return lines.map((line, index) => (
        <div key={`${line}-${index}`} className="raw-line">
            <span className="raw-line__text">{line || "\u00A0"}</span>
        </div>
    ));
}

function OutputPane({
    collapsedPaths,
    hasInput,
    isTreeViewable,
    isValidJson,
    mode,
    outputLineCount,
    parseError,
    rawOutputLines,
    viewerRows,
    workspaceState,
    onCollapseAll,
    onExpandAll,
    onTogglePath,
    onValueCopy,
}) {
    return (
        <section className="workspace-pane workspace-pane--output">
            <div className="workspace-pane__header">
                <div className="workspace-pane__title">
                    {mode === "viewer" ? <FiEye /> : <FiFileText />}
                    <span>{mode === "viewer" ? "Viewer" : "Raw Output"}</span>
                </div>

                <div className="workspace-pane__meta">
                    <span
                        className={clsx("status-chip", {
                            "status-chip--error": hasInput && !isValidJson,
                            "status-chip--success": isValidJson,
                        })}>
                        {workspaceState}
                    </span>

                    {mode === "viewer" && isTreeViewable ? (
                        <div className="viewer-actions">
                            <button
                                type="button"
                                className="icon-button icon-button--pane"
                                aria-label="Collapse all nodes"
                                title="Collapse all"
                                onClick={onCollapseAll}>
                                <FiMinimize2 />
                            </button>
                            <button
                                type="button"
                                className="icon-button icon-button--pane"
                                aria-label="Expand all nodes"
                                title="Expand all"
                                onClick={onExpandAll}>
                                <FiMaximize2 />
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="workspace-pane__body workspace-pane__body--output">
                {!hasInput ? (
                    <div className="workspace-empty">
                        <FiFileText />
                        <p>
                            Output appears here as soon as valid JSON is
                            available.
                        </p>
                    </div>
                ) : null}

                {hasInput && !isValidJson ? (
                    <div className="workspace-empty workspace-empty--error">
                        <FiX />
                        <p>
                            Fix the JSON syntax to render the viewer or raw
                            output.
                        </p>
                        <code className="workspace-empty__detail">
                            {parseError}
                        </code>
                    </div>
                ) : null}

                {hasInput &&
                isValidJson &&
                mode === "viewer" &&
                isTreeViewable ? (
                    <LineNumberSurface lineCount={outputLineCount}>
                        <JsonTreeView
                            collapsedPaths={collapsedPaths}
                            onTogglePath={onTogglePath}
                            onValueCopy={onValueCopy}
                            viewerRows={viewerRows}
                        />
                    </LineNumberSurface>
                ) : null}

                {hasInput &&
                isValidJson &&
                mode === "viewer" &&
                !isTreeViewable ? (
                    <LineNumberSurface lineCount={outputLineCount}>
                        <div className="primitive-view">
                            <div className="raw-lines">
                                {renderRawLines(rawOutputLines)}
                            </div>
                        </div>
                    </LineNumberSurface>
                ) : null}

                {hasInput && isValidJson && mode === "raw" ? (
                    <LineNumberSurface
                        contentClassName="raw-lines"
                        lineCount={outputLineCount}>
                        {renderRawLines(rawOutputLines)}
                    </LineNumberSurface>
                ) : null}
            </div>
        </section>
    );
}

export default OutputPane;
