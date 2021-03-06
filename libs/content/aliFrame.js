class AliFrame {
  constructor() {
    this.extnlDms = [];
    this.exec();
  }

  // Test connection to all created iframes
  testConnectionToFrames() {
    if (!window.isTop) {
      var msg = "Successfully";
      // Send message to top frame, for example:
      chrome.runtime.sendMessage({
        type: "testConnectionToFrames",
        data: { connection: true, msg: msg },
      });
    }
  }

  // Get all domains available
  getDomains() {
    var mtchs;
    var rgEx = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z][a-zA-Z]{0,61}[a-zA-Z]/g;
    var dmVal =
      document.querySelectorAll("div.mod-content > div > table")[0] != undefined
        ? document.querySelectorAll("div.mod-content > div > table")[0]
            .rows[2] != undefined
          ? document
              .querySelectorAll("div.mod-content > div > table")[0]
              .rows[2].cells[1].innerText.toLowerCase()
          : document.querySelectorAll(
              "#site_content > div.grid-main > div > div.mod.mod-companyContact.app-companyContact.mod-ui-not-show-title > article > div > table > tbody > tr:nth-child(3) > td:nth-child(3)"
            )[0] != undefined
          ? document
              .querySelectorAll(
                "#site_content > div.grid-main > div > div.mod.mod-companyContact.app-companyContact.mod-ui-not-show-title > article > div > table > tbody > tr:nth-child(3) > td:nth-child(3)"
              )[0]
              .innerText.toLowerCase()
          : undefined
        : undefined;

    // Checks if "dmVal" has a value. i.e not ['null'] nor ['undefined']
    if (dmVal != undefined || dmVal != null) {
      mtchs = dmVal
        .match(rgEx)
        .filter(
          (mtch) =>
            !mtch.includes("alibaba") &&
            !mtch.includes("aibaba") &&
            !mtch.includes("aliabab") &&
            !mtch.includes("ablibaba") &&
            !mtch.includes("abilbaba") &&
            !mtch.includes("allibaba") &&
            !mtch.includes("aliexpress") &&
            !mtch.includes("made-in-china") &&
            !mtch.includes("1688") &&
            !mtch.includes("0.0") &&
            !mtch.includes("ebay") &&
            !mtch.includes("shopify") &&
            !mtch.includes("amazon") &&
            !mtch.includes("youtube") &&
            !mtch.includes("skype") &&
            !mtch.includes("facebook") &&
            !mtch.includes("instagram") &&
            !mtch.includes("whatsapp") &&
            !mtch.includes("yahoo") &&
            !mtch.includes("asp") &&
            !mtch.includes("html") &&
            !mtch.includes("qq") &&
            !mtch.includes("google")
        );

      // If there is no result from mtchs? stop loading and close window.
      if (mtchs.length <= 0) {
        window.stop();
        chrome.runtime.sendMessage({
          type: "closeThisIframe",
          data: {
            id: window.origin.split("://")[1].split(".")[0],
          },
        });
      } else {
        mtchs.forEach((mtch) =>
          mtch != null
            ? !mtch.includes("www.")
              ? this.extnlDms.push(mtch)
              : (() => {
                  mtch.split("www.")[1].includes("http")
                    ? mtch
                        .split("www.")[1]
                        .split("http")[0]
                        .match(rgEx)
                        .forEach((mval) =>
                          mval != null
                            ? (() => {
                                this.extnlDms.push(mval);
                                setTimeout(() => {
                                  window.stop();
                                  this.startSearches(mval);
                                }, 1000);
                              })()
                            : ""
                        )
                    : mtch
                        .split("www.")[1]
                        .match(rgEx)
                        .forEach((mval) =>
                          mval != null
                            ? (() => {
                                this.extnlDms.push(mval);
                                setTimeout(() => {
                                  window.stop();
                                  this.startSearches(mval);
                                }, 1000);
                              })()
                            : ""
                        );
                })()
            : ""
        );
      }
    }

    chrome.runtime.sendMessage({
      type: "arrangeDomains",
      data: { dms: this.extnlDms },
    });
  }

  // Start the search engines
  startSearches(domain) {
    chrome.runtime.sendMessage({
      type: "setUrlToIframeSrc",
      data: {
        id: window.origin.split("://")[1].split(".")[0],
        url: `https://www.bing.com/search?q=[@${domain}]&from=cheaplead&nextUrl=https://search.yahoo.com/search?p=[@${domain}]&from=cheaplead`,
      },
    });
  }

  // closes every error page that occurs in the frames
  closeEveryErrorPage() {
    if (
      window.location.href.includes("error404") ||
      window.location.href.includes("error.alibaba.com")
    ) {
      chrome.runtime.sendMessage({
        type: "closeThisIframe",
        data: {
          id: window.origin.split("://")[1].split(".")[0],
        },
      });
    }
  }

  // Main method, the execute method.
  exec() {
    this.testConnectionToFrames();
    this.closeEveryErrorPage();
    this.getDomains();
  }
}

new AliFrame();
