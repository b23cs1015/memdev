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
      ok: false;
      message: string;
    };