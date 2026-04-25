import "./App.css";
import "./styles/ui.css";
import {
    WEBSITE_URL,
    REPO_URL,
    PROFILE_IMAGE_SRC,
    getLogoSrc,
    socialLinks,
} from "./config/appConfig";
import useJsonToolkit from "./hooks/useJsonToolkit";
import AppHeader from "./components/AppHeader/AppHeader";
import AppToolbar from "./components/AppToolbar/AppToolbar";
import InputPane from "./components/Workspace/InputPane";
import OutputPane from "./components/Workspace/OutputPane";
import AppFooter from "./components/AppFooter/AppFooter";
import Toast from "./components/Toast/Toast";
import HelpDialog from "./components/HelpDialog/HelpDialog";

function App() {
    const toolkit = useJsonToolkit();
    const logoSrc = getLogoSrc(toolkit.theme);

    return (
        <div className="app-shell">
            <AppHeader
                logoSrc={logoSrc}
                repoUrl={REPO_URL}
                theme={toolkit.theme}
                onOpenHelp={toolkit.openHelp}
                onRefresh={toolkit.refreshWorkspace}
                onToggleTheme={toolkit.toggleTheme}
            />

            <AppToolbar
                hasInput={toolkit.hasInput}
                isValidJson={toolkit.isValidJson}
                mode={toolkit.mode}
                onClear={toolkit.clearWorkspace}
                onCopy={toolkit.copyJson}
                onDownload={toolkit.downloadJson}
                onFileLoad={toolkit.loadFile}
                onFormat={toolkit.formatJson}
                onMinify={toolkit.minifyJson}
                onModeChange={toolkit.setMode}
                onValidate={toolkit.validateJson}
            />

            <main className="app-main">
                <div className="workspace">
                    <InputPane
                        byteCount={toolkit.byteCount}
                        charCount={toolkit.charCount}
                        editorValue={toolkit.editorValue}
                        inputLineNumbers={toolkit.inputLineNumbers}
                        inputScrollTop={toolkit.inputScrollTop}
                        isDragging={toolkit.isDragging}
                        lineCount={toolkit.lineCount}
                        onDragEnter={toolkit.handleDragEnter}
                        onDragLeave={toolkit.handleDragLeave}
                        onDragOver={toolkit.handleDragOver}
                        onDrop={toolkit.handleDrop}
                        onEditorChange={toolkit.setEditorValue}
                        onInputScroll={toolkit.setInputScrollTop}
                    />

                    <OutputPane
                        collapsedPaths={toolkit.collapsedPaths}
                        hasInput={toolkit.hasInput}
                        isTreeViewable={toolkit.isTreeViewable}
                        isValidJson={toolkit.isValidJson}
                        mode={toolkit.mode}
                        outputLineCount={toolkit.outputLineCount}
                        parseError={toolkit.parseError}
                        rawOutputLines={toolkit.rawOutputLines}
                        viewerRows={toolkit.viewerRows}
                        workspaceState={toolkit.workspaceState}
                        onCollapseAll={toolkit.collapseAll}
                        onExpandAll={toolkit.expandAll}
                        onModeChange={toolkit.setMode}
                        onTogglePath={toolkit.togglePath}
                        onValueCopy={toolkit.copyValue}
                    />
                </div>
            </main>

            <AppFooter websiteUrl={WEBSITE_URL} />

            <Toast feedback={toolkit.feedback} />

            <HelpDialog
                isOpen={toolkit.isHelpOpen}
                logoSrc={logoSrc}
                profileImageSrc={PROFILE_IMAGE_SRC}
                socialLinks={socialLinks}
                onClose={toolkit.closeHelp}
            />
        </div>
    );
}

export default App;
