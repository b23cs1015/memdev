import type {
  ExtensionMessage,
  ExtensionResponse,
} from "../types/messages";

const readyMessage: ExtensionMessage = {
  type: "CONTENT_SCRIPT_READY",
  url: window.location.href,
};

chrome.runtime.sendMessage(
  readyMessage,
  (
    response: ExtensionResponse | undefined,
  ) => {
    if (chrome.runtime.lastError) {
      console.debug(
        "[MemDev] Background service worker is not reachable yet.",
      );

      return;
    }

    if (response?.ok) {
      console.debug(
        "[MemDev] Content script connected.",
      );
    }
  },
);

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender,
    sendResponse: (
      response: ExtensionResponse,
    ) => void,
  ) => {
    if (message.type === "PING_CONTENT_SCRIPT") {
      sendResponse({
        ok: true,
        type: "CONTENT_SCRIPT_PONG",
      });
    }
  },
);