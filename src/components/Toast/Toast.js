import { FiAlertCircle, FiCheckCircle, FiCode } from "react-icons/fi";
import "./Toast.css";

function Toast({ feedback }) {
    if (!feedback) {
        return null;
    }

    return (
        <div className="toast-stack" aria-live="polite" aria-atomic="true">
            <div
                className={`toast toast--${feedback.tone}`}
                role={feedback.tone === "error" ? "alert" : "status"}>
                <div className="toast__icon" aria-hidden="true">
                    {feedback.tone === "error" ? (
                        <FiAlertCircle />
                    ) : feedback.tone === "success" ? (
                        <FiCheckCircle />
                    ) : (
                        <FiCode />
                    )}
                </div>
                <div className="toast__content">
                    <p className="toast__title">
                        {feedback.tone === "error"
                            ? "Error"
                            : feedback.tone === "success"
                              ? "Success"
                              : "Notice"}
                    </p>
                    <p className="toast__message">{feedback.message}</p>
                </div>
            </div>
        </div>
    );
}

export default Toast;
