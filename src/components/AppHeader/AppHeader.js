import { FiGithub, FiHelpCircle, FiMoon, FiSun } from "react-icons/fi";
import "./AppHeader.css";

function AppHeader({
    logoSrc,
    repoUrl,
    theme,
    onOpenHelp,
    onRefresh,
    onToggleTheme,
}) {
    return (
        <header className="app-header">
            <button
                type="button"
                className="brand-button"
                aria-label="Refresh Json Toolkit"
                title="Refresh workspace"
                onClick={onRefresh}>
                <img
                    className="brand-logo"
                    src={logoSrc}
                    alt=""
                    aria-hidden="true"
                />
                <span className="brand-title">Json Toolkit</span>
            </button>

            <div className="header-actions">
                <button
                    type="button"
                    className="icon-button"
                    aria-label="Open help dialog"
                    onClick={onOpenHelp}>
                    <FiHelpCircle />
                </button>
                <a
                    className="icon-button"
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open GitHub repository">
                    <FiGithub />
                </a>
                <button
                    type="button"
                    className="icon-button"
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    aria-pressed={theme === "dark"}
                    onClick={onToggleTheme}>
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                </button>
            </div>
        </header>
    );
}

export default AppHeader;
