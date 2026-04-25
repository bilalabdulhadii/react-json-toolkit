import { useId } from "react";
import clsx from "clsx";
import {
    FiCheckCircle,
    FiCode,
    FiCopy,
    FiDownload,
    FiEye,
    FiFileText,
    FiMinimize2,
    FiTrash2,
    FiUpload,
} from "react-icons/fi";
import "./AppToolbar.css";

function AppToolbar({
    hasInput,
    isValidJson,
    mode,
    onClear,
    onCopy,
    onDownload,
    onFileLoad,
    onFormat,
    onMinify,
    onModeChange,
    onValidate,
}) {
    const fileInputId = useId();
    const toolbarActions = [
        {
            icon: FiCode,
            label: "Format JSON",
            shortLabel: "Format",
            onClick: onFormat,
            disabled: !hasInput,
        },
        {
            icon: FiMinimize2,
            label: "Minify JSON",
            shortLabel: "Minify",
            onClick: onMinify,
            disabled: !hasInput,
        },
        {
            icon: FiCheckCircle,
            label: "Validate JSON",
            shortLabel: "Validate",
            onClick: onValidate,
            disabled: !hasInput,
        },
        {
            icon: FiCopy,
            label: "Copy JSON",
            shortLabel: "Copy",
            onClick: onCopy,
            disabled: !hasInput,
        },
        {
            icon: FiDownload,
            label: "Download JSON",
            shortLabel: "Download",
            onClick: onDownload,
            disabled: !hasInput,
        },
        {
            icon: FiTrash2,
            label: "Clear workspace",
            shortLabel: "Clear",
            onClick: onClear,
            disabled: !hasInput,
            tone: "danger",
        },
    ];

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (file) {
            await onFileLoad(file);
        }

        event.target.value = "";
    };

    return (
        <div className="app-toolbar">
            <div className="toolbar-group">
                <label
                    className="tool-button tool-button--file"
                    htmlFor={fileInputId}>
                    <FiUpload />
                    <span className="tool-button__label">Upload</span>
                </label>
                <input
                    id={fileInputId}
                    className="visually-hidden"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                />

                {toolbarActions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.label}
                            type="button"
                            className={clsx(
                                "tool-button",
                                "tool-button--compact",
                                {
                                    "tool-button--danger":
                                        action.tone === "danger",
                                },
                            )}
                            disabled={action.disabled}
                            aria-label={action.label}
                            onClick={action.onClick}>
                            <Icon />
                            <span className="tool-button__label">
                                {action.shortLabel}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="toolbar-spacer" />

            <div className="toolbar-group toolbar-group--secondary">
                <div
                    className="mode-switch"
                    role="tablist"
                    aria-label="Output mode">
                    <button
                        type="button"
                        className={clsx("tool-button", "tool-button--compact", {
                            "tool-button--active": mode === "viewer",
                        })}
                        onClick={() => onModeChange("viewer")}
                        disabled={!isValidJson}>
                        <FiEye />
                        <span className="tool-button__label">Viewer</span>
                    </button>
                    <button
                        type="button"
                        className={clsx("tool-button", "tool-button--compact", {
                            "tool-button--active": mode === "raw",
                        })}
                        onClick={() => onModeChange("raw")}
                        disabled={!isValidJson}>
                        <FiFileText />
                        <span className="tool-button__label">Raw</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AppToolbar;
