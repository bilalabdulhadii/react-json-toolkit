import {
    startTransition,
    useDeferredValue,
    useEffect,
    useEffectEvent,
    useState,
} from "react";
import { saveAs } from "file-saver";
import { THEME_STORAGE_KEY } from "../config/appConfig";
import {
    buildViewerRows,
    copyTextToClipboard,
    getCollapsiblePaths,
    getLineCount,
    safeParseJson,
    serializeJsonValue,
} from "../utils/jsonToolkit";

const getInitialTheme = () => {
    const documentTheme = document.documentElement.dataset.theme;

    if (documentTheme === "light" || documentTheme === "dark") {
        return documentTheme;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return "dark";
};

export default function useJsonToolkit() {
    const [theme, setTheme] = useState(getInitialTheme);
    const [editorValue, setEditorValue] = useState("");
    const [parsedJson, setParsedJson] = useState(null);
    const [renderedJson, setRenderedJson] = useState("");
    const [parseError, setParseError] = useState("");
    const [isValidJson, setIsValidJson] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [mode, setMode] = useState("viewer");
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [collapsedPaths, setCollapsedPaths] = useState(() => new Set());
    const [inputScrollTop, setInputScrollTop] = useState(0);
    const deferredEditorValue = useDeferredValue(editorValue);

    const hasInput = editorValue.trim().length > 0;
    const lineCount = getLineCount(editorValue);
    const charCount = editorValue.length;
    const byteCount = hasInput ? new Blob([editorValue]).size : 0;
    const isTreeViewable =
        isValidJson && parsedJson !== null && typeof parsedJson === "object";
    const inputLineNumbers = Array.from(
        { length: lineCount },
        (_, index) => index + 1,
    );
    const rawOutputLines = renderedJson ? renderedJson.split(/\r?\n/) : [];
    const viewerRows = isTreeViewable
        ? buildViewerRows(parsedJson, collapsedPaths)
        : [];
    const outputLineCount =
        mode === "viewer" && isTreeViewable
            ? viewerRows.length
            : rawOutputLines.length;
    const workspaceState = !hasInput
        ? "Idle"
        : isValidJson
          ? "Valid JSON"
          : "Syntax error";

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);

        const themeColor = theme === "dark" ? "#0D0D0D" : "#FFFFFF";
        const themeMeta = document.querySelector('meta[name="theme-color"]');

        if (themeMeta) {
            themeMeta.setAttribute("content", themeColor);
        }
    }, [theme]);

    useEffect(() => {
        if (!feedback) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setFeedback(null);
        }, 2000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [feedback]);

    useEffect(() => {
        if (!deferredEditorValue.trim()) {
            startTransition(() => {
                setParsedJson(null);
                setRenderedJson("");
                setParseError("");
                setIsValidJson(false);
            });
            setCollapsedPaths(new Set());
            return;
        }

        const nextParse = safeParseJson(deferredEditorValue);

        if (nextParse.error) {
            startTransition(() => {
                setParsedJson(null);
                setRenderedJson("");
                setParseError(nextParse.error);
                setIsValidJson(false);
            });
            return;
        }

        startTransition(() => {
            setParsedJson(nextParse.value);
            setRenderedJson(JSON.stringify(nextParse.value, null, 2));
            setParseError("");
            setIsValidJson(true);
        });
        setCollapsedPaths(new Set());
    }, [deferredEditorValue]);

    const handleEscapeKey = useEffectEvent((event) => {
        if (event.key === "Escape") {
            setIsHelpOpen(false);
        }
    });

    useEffect(() => {
        if (!isHelpOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscapeKey);
        };
    }, [handleEscapeKey, isHelpOpen]);

    const setSuccessFeedback = (message) => {
        setFeedback({
            message,
            tone: "success",
        });
    };

    const setErrorFeedback = (message) => {
        setFeedback({
            message,
            tone: "error",
        });
    };

    const requireValidJson = () => {
        if (!hasInput) {
            setErrorFeedback("Paste or upload JSON first.");
            return null;
        }

        const nextParse = safeParseJson(editorValue);

        if (nextParse.error) {
            setErrorFeedback(
                "JSON is invalid. Fix the syntax before using this action.",
            );
            return null;
        }

        return nextParse.value;
    };

    const applyTransform = (spacing, message) => {
        const nextValue = requireValidJson();

        if (nextValue === null && editorValue.trim() !== "null") {
            return;
        }

        setEditorValue(JSON.stringify(nextValue, null, spacing));
        setMode("viewer");
        setCollapsedPaths(new Set());
        setSuccessFeedback(message);
    };

    const formatJson = () => {
        applyTransform(2, "JSON formatted.");
    };

    const minifyJson = () => {
        applyTransform(0, "JSON minified.");
    };

    const validateJson = () => {
        const nextValue = requireValidJson();

        if (nextValue === null && editorValue.trim() !== "null") {
            return;
        }

        setSuccessFeedback("JSON is valid.");
    };

    const copyJson = async () => {
        if (!hasInput) {
            setErrorFeedback("Nothing to copy yet.");
            return;
        }

        try {
            await copyTextToClipboard(editorValue);
            setSuccessFeedback("JSON copied.");
        } catch (error) {
            setErrorFeedback("Clipboard access failed in this browser.");
        }
    };

    const downloadJson = () => {
        const nextValue = requireValidJson();

        if (nextValue === null && editorValue.trim() !== "null") {
            return;
        }

        const fileContents = JSON.stringify(
            nextValue,
            null,
            editorValue.includes("\n") ? 2 : 0,
        );
        const blob = new Blob([fileContents], {
            type: "application/json;charset=utf-8",
        });

        saveAs(blob, "json-toolkit-export.json");
        setSuccessFeedback("JSON downloaded.");
    };

    const clearWorkspace = () => {
        setEditorValue("");
        setMode("viewer");
        setParseError("");
        setRenderedJson("");
        setParsedJson(null);
        setIsValidJson(false);
        setIsDragging(false);
        setCollapsedPaths(new Set());
        setInputScrollTop(0);
        setFeedback({
            message: "Workspace cleared.",
            tone: "neutral",
        });
    };

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light",
        );
    };

    const refreshWorkspace = () => {
        window.location.reload();
    };

    const loadFile = async (file) => {
        if (!file) {
            return;
        }

        try {
            const fileContents = await file.text();
            setEditorValue(fileContents);
            setMode("viewer");
            setCollapsedPaths(new Set());
            setSuccessFeedback(`${file.name} loaded.`);
        } catch (error) {
            setErrorFeedback("The selected file could not be read.");
        }
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    const handleDragLeave = (event) => {
        event.preventDefault();

        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);

        const [file] = event.dataTransfer.files;

        if (file) {
            await loadFile(file);
            return;
        }

        const droppedText = event.dataTransfer.getData("text/plain");

        if (droppedText) {
            setEditorValue(droppedText);
            setMode("viewer");
            setCollapsedPaths(new Set());
            setSuccessFeedback("Dropped text loaded.");
        }
    };

    const copyValue = (value) => {
        void copyTextToClipboard(serializeJsonValue(value))
            .then(() => {
                setSuccessFeedback("Selected value copied.");
            })
            .catch(() => {
                setErrorFeedback("Clipboard access failed in this browser.");
            });
    };

    const togglePath = (pathId) => {
        setCollapsedPaths((currentPaths) => {
            const nextPaths = new Set(currentPaths);

            if (nextPaths.has(pathId)) {
                nextPaths.delete(pathId);
            } else {
                nextPaths.add(pathId);
            }

            return nextPaths;
        });
    };

    const collapseAll = () => {
        if (parsedJson === null) {
            return;
        }

        setCollapsedPaths(new Set(getCollapsiblePaths(parsedJson)));
    };

    const expandAll = () => {
        setCollapsedPaths(new Set());
    };

    return {
        byteCount,
        charCount,
        clearWorkspace,
        closeHelp: () => setIsHelpOpen(false),
        collapseAll,
        collapsedPaths,
        copyJson,
        copyValue,
        downloadJson,
        editorValue,
        expandAll,
        feedback,
        formatJson,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        hasInput,
        inputLineNumbers,
        inputScrollTop,
        isDragging,
        isHelpOpen,
        isTreeViewable,
        isValidJson,
        lineCount,
        loadFile,
        minifyJson,
        mode,
        openHelp: () => setIsHelpOpen(true),
        outputLineCount,
        parseError,
        rawOutputLines,
        refreshWorkspace,
        setEditorValue,
        setInputScrollTop,
        setMode,
        theme,
        togglePath,
        toggleTheme,
        validateJson,
        viewerRows,
        workspaceState,
    };
}
