import type {
  ExtensionMessage,
  ExtensionResponse,
} from "../types/messages";

chrome.runtime.onInstalled.addListener(() => {
  console.info("[MemDev] Extension installed.");
});

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender,
    sendResponse: (
      response: ExtensionResponse,
    ) => void,
  ) => {
    if (message.type === "GET_EXTENSION_STATUS") {
      sendResponse({
        ok: true,
        type: "EXTENSION_STATUS",
        message: "MemDev extension is running.",
      });

      return;
    }

    if (message.type === "CONTENT_SCRIPT_READY") {
      console.info(
        "[MemDev] Content script ready:",
        message.url,
      );

      sendResponse({
        ok: true,
        type: "CONTENT_SCRIPT_READY",
        url: message.url,
      });

      return;
    }

    if (message.type === "PING_CONTENT_SCRIPT") {
      sendResponse({
        ok: true,
        type: "CONTENT_SCRIPT_PONG",
      });
    }
  },
);

console.info(
  "[MemDev] Background service worker started.",
);