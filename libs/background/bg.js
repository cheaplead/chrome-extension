class Background {
  constructor(window) {
    console.log("Hello, Background Script!");

    this.window = window;
    this.window.domains = [];
    this.window.emails = [];
    this.window.locationUrl = "";
    this.exec();

    console.log("Bg Domains: ", this.window.domains);
  }

  // Arranges the domains from content scripts in the Popup
  arrangeDms(dms) {
    if (dms != null) {
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
        ems.forEach((emObj) => {
          for (const key in emObj) {
            if (emObj.hasOwnProperty(key)) {
              const emArr = emObj[key];
              for (const em of emArr) {
                !this.window.emails.includes(em)
                  ? this.window.emails.push(em)
                  : "";
              }
            }
          }
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
              connection: request.data.msg,
            });
          }
          sendResponse({ msg: "Connections Made!" });
          break;

        case "closeThisIframe":
          chrome.tabs.sendMessage(sender.tab.id, {
            url: request.data.url,
          });
          sendResponse({ msg: "Closing Ifrane!" });
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
  }
}

new Background(window);
