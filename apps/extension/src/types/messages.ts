export type CapturedContent = {
  text: string;
  title: string;
  url: string;
};

export type ExtensionMessage =
  | {
      type: "GET_EXTENSION_STATUS";
    }
  | {
      type: "PING_CONTENT_SCRIPT";
    }
  | {
      type: "CONTENT_SCRIPT_READY";
      url: string;
    }
  | {
      type: "CAPTURE_SELECTION";
    };

export type ExtensionResponse =
  | {
      ok: true;
      type: "EXTENSION_STATUS";
      message: string;
    }
  | {
      ok: true;
      type: "CONTENT_SCRIPT_READY";
      url: string;
    }
  | {
      ok: true;
      type: "CONTENT_SCRIPT_PONG";
    }
  | {
      ok: true;
      type: "CAPTURED_CONTENT";
      content: CapturedContent;
    }
  | {
      ok: false;
      message: string;
    };