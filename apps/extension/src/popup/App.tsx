import { useEffect, useState } from "react";
import {
  Check,
  Clipboard,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import type { CapturedContent } from "../types/messages";

import "./styles.css";

type CaptureState =
  | "capturing"
  | "captured"
  | "empty"
  | "error";

function App() {
  const [status, setStatus] = useState(
    "Checking extension...",
  );

  const [captureState, setCaptureState] =
    useState<CaptureState>("capturing");

  const [capturedContent, setCapturedContent] =
    useState<CapturedContent | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function captureSelection() {
    setCaptureState("capturing");
    setCapturedContent(null);
    setErrorMessage("");

    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!activeTab?.id) {
        throw new Error(
          "Unable to determine the active tab.",
        );
      }

      const results =
        await chrome.scripting.executeScript({
          target: {
            tabId: activeTab.id,
          },

          func: () => {
            const selection =
              window.getSelection();

            const text =
              selection?.toString().trim() ?? "";

            return {
              text,
              title: document.title.trim(),
              url: window.location.href,
            };
          },
        });

      const result = results[0]?.result;

      if (!result) {
        throw new Error(
          "Unable to capture the current page.",
        );
      }

      if (!result.text) {
        setCaptureState("empty");
        return;
      }

      setCapturedContent({
        text: result.text,
        title: result.title,
        url: result.url,
      });

      setCaptureState("captured");
    } catch (error) {
      console.error(
        "[MemDev] Capture failed:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to capture this page.",
      );

      setCaptureState("error");
    }
  }

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        type: "GET_EXTENSION_STATUS",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          setStatus(
            "Background service worker unavailable.",
          );

          return;
        }

        if (
          response?.ok &&
          response.type ===
            "EXTENSION_STATUS"
        ) {
          setStatus(response.message);
        } else {
          setStatus(
            "Extension is unavailable.",
          );
        }
      },
    );

    void captureSelection();
  }, []);

  function openSource() {
    if (!capturedContent) {
      return;
    }

    void chrome.tabs.create({
      url: capturedContent.url,
    });
  }

  return (
    <main className="popup">
      <header className="brand">
        <div
          className="brand-mark"
          aria-hidden="true"
        >
          M
        </div>

        <div>
          <div className="brand-name">
            MemDev
          </div>

          <div className="brand-label">
            Knowledge capture
          </div>
        </div>
      </header>

      <section className="intro">
        <p className="eyebrow">
          Capture
        </p>

        <h1>
          Save useful knowledge from the web.
        </h1>

        <p className="description">
          Select something useful on a webpage
          and MemDev will capture it with its
          source.
        </p>
      </section>

      {captureState === "capturing" && (
        <section className="capture-panel">
          <div className="loading-row">
            <RefreshCw
              className="spin"
              size={16}
            />

            <span>
              Capturing selection...
            </span>
          </div>
        </section>
      )}

      {captureState === "captured" &&
        capturedContent && (
          <section
            className="capture-panel captured"
            aria-label="Captured content"
          >
            <div className="capture-heading">
              <div className="capture-heading-left">
                <span className="status-icon">
                  <Check
                    size={15}
                    strokeWidth={2}
                  />
                </span>

                <div>
                  <strong>
                    Selection captured
                  </strong>

                  <span>
                    Ready for the next step.
                  </span>
                </div>
              </div>
            </div>

            <div className="selection-preview">
              {capturedContent.text}
            </div>

            <div className="source-block">
              <span className="source-label">
                Source
              </span>

              <button
                className="source-button"
                type="button"
                onClick={openSource}
                title={capturedContent.url}
              >
                <span>
                  {capturedContent.title ||
                    capturedContent.url}
                </span>

                <ExternalLink size={14} />
              </button>
            </div>

            <p className="capture-hint">
              To capture something else, select
              different text on the webpage and
              reopen MemDev.
            </p>
          </section>
        )}

      {captureState === "empty" && (
        <section className="capture-panel empty">
          <div className="empty-icon">
            <Clipboard size={18} />
          </div>

          <strong>
            Nothing selected
          </strong>

          <span>
            Highlight some text on the webpage,
            then open MemDev again.
          </span>
        </section>
      )}

      {captureState === "error" && (
        <section className="capture-panel error">
          <strong>
            Capture unavailable
          </strong>

          <span>
            {errorMessage ||
              "This page cannot be captured."}
          </span>
        </section>
      )}

      <section
        className="status-panel"
        aria-label="Extension status"
      >
        <div className="status-row">
          <span className="status-icon">
            <Check
              size={15}
              strokeWidth={2}
            />
          </span>

          <div>
            <strong>
              Extension
            </strong>

            <span>{status}</span>
          </div>
        </div>

        <div className="status-row">
          <span className="status-icon">
            <ShieldCheck
              size={15}
              strokeWidth={2}
            />
          </span>

          <div>
            <strong>
              Capture access
            </strong>

            <span>
              Access is requested only when
              you use the extension.
            </span>
          </div>
        </div>
      </section>

      <footer>
        Phase 25 · Selected Text Capture
      </footer>
    </main>
  );
}

export default App;