import "./AppFooter.css";

function AppFooter({ websiteUrl }) {
    return (
        <footer className="app-footer">
            <p>
                Json Toolkit © 2026 — Built by{" "}
                <a href={websiteUrl} target="_blank" rel="noreferrer">
                    Bilal Abdulhadi
                </a>
            </p>
        </footer>
    );
}

export default AppFooter;
