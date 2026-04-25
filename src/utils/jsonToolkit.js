export const safeParseJson = (value) => {
    try {
        return {
            error: "",
            value: JSON.parse(value),
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Invalid JSON.",
            value: null,
        };
    }
};

export const getLineCount = (value) => value.split(/\r?\n/).length;

export const getLineNumberWidth = (count) =>
    `${Math.max(2, String(count).length) + 2}ch`;

export const getJsonValueType = (value) => {
    if (Array.isArray(value)) {
        return "array";
    }

    if (value === null) {
        return "null";
    }

    return typeof value;
};

export const getContainerEntries = (value) => {
    if (Array.isArray(value)) {
        return value.map((item, index) => [index, item]);
    }

    return Object.entries(value);
};

export const getPathId = (path) => JSON.stringify(path);

export const getContainerSummary = (value) => {
    if (Array.isArray(value)) {
        return `${value.length} item${value.length === 1 ? "" : "s"}`;
    }

    const keyCount = Object.keys(value).length;
    return `${keyCount} key${keyCount === 1 ? "" : "s"}`;
};

export const getCollapsiblePaths = (value, path = []) => {
    const type = getJsonValueType(value);

    if (type !== "object" && type !== "array") {
        return [];
    }

    const entries = getContainerEntries(value);

    if (entries.length === 0) {
        return [];
    }

    return [
        getPathId(path),
        ...entries.flatMap(([childKey, childValue]) =>
            getCollapsiblePaths(childValue, [...path, childKey]),
        ),
    ];
};

export const buildViewerRows = (value, collapsedPaths) => {
    const rows = [];

    const visitNode = ({ currentValue, path, depth, key, isLast }) => {
        const type = getJsonValueType(currentValue);

        if (type !== "object" && type !== "array") {
            rows.push({
                kind: "value",
                pathId: getPathId(path),
                depth,
                key,
                comma: !isLast,
                copyValue: currentValue,
                valueText: JSON.stringify(currentValue),
                valueType: type,
            });
            return;
        }

        const entries = getContainerEntries(currentValue);
        const pathId = getPathId(path);
        const openSymbol = type === "array" ? "[" : "{";
        const closeSymbol = type === "array" ? "]" : "}";

        if (entries.length === 0) {
            rows.push({
                kind: "empty",
                pathId,
                depth,
                key,
                comma: !isLast,
                copyValue: currentValue,
                openSymbol,
                closeSymbol,
            });
            return;
        }

        if (collapsedPaths.has(pathId)) {
            rows.push({
                kind: "collapsed",
                pathId,
                depth,
                key,
                comma: !isLast,
                copyValue: currentValue,
                openSymbol,
                closeSymbol,
                summary: getContainerSummary(currentValue),
            });
            return;
        }

        rows.push({
            kind: "open",
            pathId,
            depth,
            key,
            openSymbol,
            copyValue: currentValue,
        });

        entries.forEach(([childKey, childValue], index) => {
            visitNode({
                currentValue: childValue,
                path: [...path, childKey],
                depth: depth + 1,
                key: Array.isArray(currentValue) ? null : childKey,
                isLast: index === entries.length - 1,
            });
        });

        rows.push({
            kind: "close",
            pathId,
            depth,
            closeSymbol,
            comma: !isLast,
        });
    };

    visitNode({
        currentValue: value,
        path: [],
        depth: 0,
        key: null,
        isLast: true,
    });

    return rows;
};

export const serializeJsonValue = (value) => {
    if (typeof value === "string") {
        return value;
    }

    return JSON.stringify(value, null, 2);
};

export const copyTextToClipboard = async (value) => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
};
