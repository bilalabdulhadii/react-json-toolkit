import clsx from "clsx";
import { getLineNumberWidth } from "../../utils/jsonToolkit";
import "./Workspace.css";

function LineNumberSurface({ children, contentClassName, lineCount }) {
    const lineNumbers = Array.from(
        { length: lineCount },
        (_, index) => index + 1,
    );

    return (
        <div
            className="numbered-surface"
            style={{
                "--line-number-width": getLineNumberWidth(lineCount),
            }}>
            <div className="line-gutter" aria-hidden="true">
                <div className="line-gutter__inner line-gutter__inner--static">
                    {lineNumbers.map((lineNumber) => (
                        <div key={lineNumber} className="line-gutter__line">
                            {lineNumber}
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={clsx("numbered-surface__content", contentClassName)}>
                {children}
            </div>
        </div>
    );
}

export default LineNumberSurface;
