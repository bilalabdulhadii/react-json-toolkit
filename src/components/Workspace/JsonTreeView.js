import clsx from "clsx";
import { FiChevronDown, FiChevronRight, FiCopy } from "react-icons/fi";
import "./Workspace.css";

function JsonTreeView({
    collapsedPaths,
    onTogglePath,
    onValueCopy,
    viewerRows,
}) {
    return (
        <div className="json-lines">
            {viewerRows.map((row, index) => {
                const ToggleIcon = collapsedPaths.has(row.pathId)
                    ? FiChevronRight
                    : FiChevronDown;
                const rowKey = `${row.pathId}-${row.kind}-${index}`;

                return (
                    <div key={rowKey} className="json-line">
                        <div
                            className="json-line__content"
                            style={{
                                "--json-line-depth": row.depth,
                            }}>
                            {row.kind === "open" || row.kind === "collapsed" ? (
                                <button
                                    type="button"
                                    className="viewer-toggle"
                                    aria-label={
                                        row.kind === "collapsed"
                                            ? "Expand node"
                                            : "Collapse node"
                                    }
                                    onClick={() => onTogglePath(row.pathId)}>
                                    <ToggleIcon />
                                </button>
                            ) : (
                                <span
                                    className="viewer-toggle viewer-toggle--spacer"
                                    aria-hidden="true"
                                />
                            )}

                            {row.key !== null ? (
                                <>
                                    <span className="json-token json-token--key">
                                        {JSON.stringify(row.key)}
                                    </span>
                                    <span className="json-token json-token--punctuation">
                                        :{" "}
                                    </span>
                                </>
                            ) : null}

                            {row.kind === "value" ? (
                                <>
                                    <span
                                        className={clsx("json-token", {
                                            "json-token--string":
                                                row.valueType === "string",
                                            "json-token--number":
                                                row.valueType === "number",
                                            "json-token--boolean":
                                                row.valueType === "boolean",
                                            "json-token--null":
                                                row.valueType === "null",
                                        })}>
                                        {row.valueText}
                                    </span>
                                    {row.comma ? (
                                        <span className="json-token json-token--punctuation">
                                            ,
                                        </span>
                                    ) : null}
                                </>
                            ) : null}

                            {row.kind === "open" ? (
                                <span className="json-token json-token--punctuation">
                                    {row.openSymbol}
                                </span>
                            ) : null}

                            {row.kind === "close" ? (
                                <>
                                    <span className="json-token json-token--punctuation">
                                        {row.closeSymbol}
                                    </span>
                                    {row.comma ? (
                                        <span className="json-token json-token--punctuation">
                                            ,
                                        </span>
                                    ) : null}
                                </>
                            ) : null}

                            {row.kind === "empty" ? (
                                <>
                                    <span className="json-token json-token--punctuation">
                                        {row.openSymbol}
                                        {row.closeSymbol}
                                    </span>
                                    {row.comma ? (
                                        <span className="json-token json-token--punctuation">
                                            ,
                                        </span>
                                    ) : null}
                                </>
                            ) : null}

                            {row.kind === "collapsed" ? (
                                <>
                                    <span className="json-token json-token--punctuation">
                                        {row.openSymbol}
                                    </span>
                                    <span className="json-token json-token--summary">
                                        {" "}
                                        {row.summary}{" "}
                                    </span>
                                    <span className="json-token json-token--punctuation">
                                        {row.closeSymbol}
                                    </span>
                                    {row.comma ? (
                                        <span className="json-token json-token--punctuation">
                                            ,
                                        </span>
                                    ) : null}
                                </>
                            ) : null}

                            {row.copyValue !== undefined ? (
                                <button
                                    type="button"
                                    className="viewer-copy"
                                    aria-label="Copy value"
                                    title="Copy value"
                                    onClick={() => onValueCopy(row.copyValue)}>
                                    <FiCopy />
                                </button>
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default JsonTreeView;
