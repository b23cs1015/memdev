import { useEffect, useState } from "react";
import {
  Check,
  Clipboard,
  ExternalLink,
  Link2,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  createNote,
  ExtensionApiError,
  getCurrentUser,
  type ExtensionUser,
} from "../lib/api";

import type { CapturedContent } from "../types/messages";

import "./styles.css";

type CaptureState =
  | "capturing"
  | "captured"
  | "empty"
  | "error";

type SaveState =
  | "idle"
  | "saving"
  | "saved"
  | "error";

const TOKEN_KEY = "memdev_token";

async function getStoredToken() {
  const result =
    await chrome.storage.local.get(
      TOKEN_KEY,
    );

  const token = result[TOKEN_KEY];

  return typeof token === "string"
    ? token
    : null;
}

async function removeStoredToken() {
  await chrome.storage.local.remove(
    TOKEN_KEY,
  );
}

async function readMemDevToken(
  tabId: number,
) {
  const results =
    await chrome.scripting.executeScript({
      target: {
        tabId,
      },

      world: "MAIN",

      func: () => {
        return window.localStorage.getItem(
          "memdev_token",
        );
      },
    });

  return results[0]?.result ?? null;
}

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

  const [user, setUser] =
    useState<ExtensionUser | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [authMessage, setAuthMessage] =
    useState("");

  const [saveState, setSaveState] =
    useState<SaveState>("idle");

  const [saveMessage, setSaveMessage] =
    useState("");

  async function captureSelection() {
    setCaptureState("capturing");
    setCapturedContent(null);
    setErrorMessage("");
    setSaveState("idle");
    setSaveMessage("");

    try {
      const [activeTab] =
        await chrome.tabs.query({
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
              selection
                ?.toString()
                .trim() ?? "";

            return {
              text,
              title:
                document.title.trim(),
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

  async function loadAuthentication() {
    setAuthLoading(true);
    setAuthMessage("");

    try {
      const token =
        await getStoredToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response =
        await getCurrentUser(token);

      setUser(response.user);
    } catch (error) {
      if (
        error instanceof ExtensionApiError &&
        error.status === 401
      ) {
        await removeStoredToken();

        setUser(null);

        setAuthMessage(
          "Your MemDev session has expired. Reconnect to continue.",
        );

        return;
      }

      setAuthMessage(
        "Unable to verify your MemDev session.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function connectToMemDev() {
    setAuthMessage("");

    try {
      const [activeTab] =
        await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

      if (!activeTab?.id) {
        setAuthMessage(
          "Unable to determine the active tab.",
        );

        return;
      }

      const activeUrl =
        activeTab.url ?? "";

      if (
        !activeUrl.startsWith(
          "http://localhost:5173/",
        )
      ) {
        await chrome.tabs.create({
          url: "http://localhost:5173/login",
        });

        setAuthMessage(
            "MemDev login opened. Sign in, then open the extension again and connect.",
        );

        return;
      }

      const token =
        await readMemDevToken(
          activeTab.id,
        );

      if (!token) {
        setAuthMessage(
          "Sign in to MemDev in this tab first, then connect again.",
        );

        return;
      }

      await chrome.storage.local.set({
        [TOKEN_KEY]: token,
      });

      const response =
        await getCurrentUser(token);

      setUser(response.user);

      setAuthMessage(
        "Connected to your MemDev account.",
      );
    } catch (error) {
      console.error(
        "[MemDev] Connection failed:",
        error,
      );

      setAuthMessage(
        "Unable to connect to MemDev. Make sure the web app is running and you are signed in.",
      );
    }
  }

  async function disconnectFromMemDev() {
    await removeStoredToken();

    setUser(null);
    setSaveState("idle");
    setSaveMessage("");
    setAuthMessage(
      "MemDev connection removed.",
    );
  }

  async function saveToMemDev() {
    if (!capturedContent) {
      return;
    }

    if (!user) {
      setSaveState("error");
      setSaveMessage(
        "Connect to MemDev before saving.",
      );

      return;
    }

    setSaveState("saving");
    setSaveMessage("");

    try {
      const token =
        await getStoredToken();

      if (!token) {
        setUser(null);
        setSaveState("error");
        setSaveMessage(
          "Your MemDev session is no longer available.",
        );

        return;
      }

      const title =
        capturedContent.title ||
        `Capture from ${new URL(
          capturedContent.url,
        ).hostname}`;

      await createNote(token, {
        title,
        content:
          capturedContent.text,
        sourceUrl:
          capturedContent.url,
      });

      setSaveState("saved");

      setSaveMessage(
        "Saved successfully to your MemDev library.",
      );
    } catch (error) {
      console.error(
        "[MemDev] Save failed:",
        error,
      );

      if (
        error instanceof ExtensionApiError &&
        error.status === 401
      ) {
        await removeStoredToken();

        setUser(null);
        setSaveState("error");
        setSaveMessage(
          "Your MemDev session has expired. Reconnect to continue.",
        );

        return;
      }

      setSaveState("error");

      setSaveMessage(
        error instanceof ExtensionApiError
          ? error.message
          : "Unable to save the note.",
      );
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

    void loadAuthentication();
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

  function openMemDev() {
    void chrome.tabs.create({
      url: "http://localhost:5173/dashboard",
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
          Capture useful text and save it
          directly to your MemDev library.
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
                    Ready to save.
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
                title={
                  capturedContent.url
                }
              >
                <span>
                  {capturedContent.title ||
                    capturedContent.url}
                </span>

                <ExternalLink size={14} />
              </button>
            </div>

            <p className="capture-hint">
              To capture something else,
              select different text on the
              webpage and reopen MemDev.
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
            Highlight some text on the
            webpage, then open MemDev again.
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
        className="connection-panel"
        aria-label="MemDev connection"
      >
        <div className="connection-header">
          <div className="connection-title">
            <span
              className={
                user
                  ? "status-icon"
                  : "status-icon muted"
              }
            >
              {user ? (
                <Check
                  size={15}
                  strokeWidth={2}
                />
              ) : (
                <Link2
                  size={15}
                  strokeWidth={2}
                />
              )}
            </span>

            <div>
              <strong>
                MemDev account
              </strong>

              <span>
                {authLoading
                  ? "Checking connection..."
                  : user
                    ? user.email
                    : "Not connected"}
              </span>
            </div>
          </div>

          {user && (
            <button
              className="icon-button"
              type="button"
              onClick={() => {
                void disconnectFromMemDev();
              }}
              title="Disconnect MemDev"
              aria-label="Disconnect MemDev"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

        {authMessage && (
          <p className="connection-message">
            {authMessage}
          </p>
        )}

        {!authLoading && !user && (
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              void connectToMemDev();
            }}
          >
            <Link2 size={15} />
            Connect to MemDev
          </button>
        )}
      </section>

      {saveMessage && (
        <div
          className={
            saveState === "saved"
              ? "save-message success"
              : "save-message error-message"
          }
        >
          {saveState === "saved" ? (
            <Check size={14} />
          ) : null}

          <span>{saveMessage}</span>
        </div>
      )}

      {captureState === "captured" &&
        capturedContent &&
        user &&
        saveState !== "saved" && (
          <button
            className="primary-button"
            type="button"
            disabled={saveState === "saving"}
            onClick={() => {
              void saveToMemDev();
            }}
          >
            {saveState === "saving" ? (
              <>
                <RefreshCw
                  className="spin"
                  size={15}
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save to MemDev
              </>
            )}
          </button>
        )}

      {saveState === "saved" && (
        <button
          className="primary-button"
          type="button"
          onClick={openMemDev}
        >
          Open MemDev
          <ExternalLink size={15} />
        </button>
      )}

      {!user &&
        captureState === "captured" && (
          <p className="save-hint">
            Connect your MemDev account to
            save this capture.
          </p>
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
              Account security
            </strong>

            <span>
              Your existing MemDev session is
              used to authorize saves.
            </span>
          </div>
        </div>
      </section>

      <footer>
        Phase 26 · Save to MemDev
      </footer>
    </main>
  );
}

export default App;