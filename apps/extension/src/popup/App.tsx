import { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import type {
  ExtensionResponse,
} from "../types/messages";

import "./styles.css";

export default function App() {
  const [status, setStatus] = useState(
    "Checking extension...",
  );

  const [contentScriptReady, setContentScriptReady] =
    useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        type: "GET_EXTENSION_STATUS",
      },
      (
        response:
          | ExtensionResponse
          | undefined,
      ) => {
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

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const activeTab = tabs[0];

        if (!activeTab?.id) {
          return;
        }

        chrome.tabs.sendMessage(
          activeTab.id,
          {
            type: "PING_CONTENT_SCRIPT",
          },
          (
            response:
              | ExtensionResponse
              | undefined,
          ) => {
            if (chrome.runtime.lastError) {
              setContentScriptReady(false);
              return;
            }

            setContentScriptReady(
              response?.ok === true &&
                response.type ===
                  "CONTENT_SCRIPT_PONG",
            );
          },
        );
      },
    );
  }, []);

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
          Extension foundation
        </p>

        <h1>
          Save useful knowledge from the web.
        </h1>

        <p className="description">
          The capture workflow is coming next.
          This version verifies that the
          extension is connected and ready.
        </p>
      </section>

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

            <span>
              {status}
            </span>
          </div>
        </div>

        <div className="status-row">
          <span
            className={
              contentScriptReady
                ? "status-icon"
                : "status-icon muted"
            }
          >
            <ShieldCheck
              size={15}
              strokeWidth={2}
            />
          </span>

          <div>
            <strong>
              Page connection
            </strong>

            <span>
              {contentScriptReady
                ? "Content script connected."
                : "Open MemDev locally to test the page connection."}
            </span>
          </div>
        </div>
      </section>

      <button
        className="primary-button"
        type="button"
        onClick={() => {
          chrome.tabs.create({
            url: "http://localhost:5173",
          });
        }}
      >
        Open MemDev

        <ExternalLink size={15} />
      </button>

      <footer>
        Phase 24 · Browser Extension Foundation
      </footer>
    </main>
  );
}