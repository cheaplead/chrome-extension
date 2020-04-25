class Background {
  constructor(window) {
    console.log("Hello, Background Script!");

    this.window = window;
    this.window.domains = [];
    this.window.emails = [];
    this.window.locationUrl = "";
    this.exec();

    console.log("Bg Domains: ", this.window.domains);
    console.log("Bg Emails: ", this.window.emails);
  }

  // Arranges the domains from content scripts in the Popup
  arrangeDms(dms) {
    if (dms != null && dms != undefined) {
      if (dms.length > 0) {
        dms.forEach((dm) => {
          !this.window.domains.includes(dm) ? this.window.domains.push(dm) : "";
        });
      }
    }
  }

  // Arranges the emails from content scripts in the Popup
  arrangeEms(ems) {
    if (ems != null && ems != undefined) {
      if (ems.length > 0) {
        ems.forEach((em) => {
          !this.window.emails.includes(em)
            ? (() => {
                this.window.emails.push(em);
                this.window.emails.length > 0
                  ? chrome.browserAction.setBadgeText({
                      text: `${this.window.emails.length.toString()}`,
                    })
                  : chrome.browserAction.setBadgeText({
                      text: "",
                    });
              })()
            : "";
        });
      }
    }
  }

  // Handles all messages from every content and popup scripts
  handleMessages() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case "arrangeDomains":
          this.arrangeDms(request.data.dms);
          sendResponse({ msg: "Domains arranged!" });
          break;

        case "arrangeEmails":
          this.arrangeEms(request.data.ems);
          sendResponse({ msg: "Emails arranged!" });
          break;

        case "testConnectionToFrames":
          if (request.data.connection) {
            chrome.tabs.sendMessage(sender.tab.id, {
              type: "testingConnections",
              data: {
                connection: request.data.msg,
              },
            });
          }
          sendResponse({ msg: "Connections Made!" });
          break;

        case "closeThisIframe":
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "deleteFrames",
            data: {
              id: request.data.id,
            },
          });
          sendResponse({ msg: "Closing Iframe!" });
          break;

        case "removeCustomElements":
          chrome.runtime.sendMessage({
            type: "removeCustomElementsOnClearBtn",
          });
          sendResponse({ msg: "Closing all Custom Elements!" });
          break;

        case "setUrlToIframeSrc":
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "setUrlToSrc",
            data: {
              id: request.data.id,
              url: request.data.url,
            },
          });
          sendResponse({ msg: "Setting urls to iframe's src!" });
          break;

        default:
          console.error("Unrecognised message: ", request.type);
          break;
      }
    });
  }

  // Main method, the execute method.
  exec() {
    this.handleMessages();
    if (this.window.emails.length == 0) {
      chrome.browserAction.setBadgeText({
        text: "",
      });
    }
    chrome.browserAction.setBadgeBackgroundColor({ color: "#4285f4" });
  }
}

new Background(window);
