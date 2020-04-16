class AliClass {
  constructor() {
    this.cntLnkArr = [];
    this.extnlDms = [];
    this.srch = {
      path: "/trade/search",
      path_2: "/corporations",
      query: "indexarea=company_en",
    };
    this.exec(location.href.toLowerCase());
  }

  // Gets all User contacts URLs Listed from Ali
  getContactLinks() {
    // Fetch contact properties
    var cntPgLnkArr = $(
      "#J-items-content > div > div > div.top > div.corp > div.company > a.cd"
    ).children();

    // Extract and push.
    for (let i = 0; i < cntPgLnkArr.prevObject.length; i++) {
      this.cntLnkArr.push(cntPgLnkArr.prevObject[i].href);
    }

    // Return cntLnkArr value
    return this.cntLnkArr;
  }

  // Open all links in newtab!
  openContactLinks(urlArr) {
    // Open's a new Window for the new operation
    if (document.readyState === "complete") {
      confirm(`Cheaplead is about opening ${urlArr.length} pages, Ok?`) == true
        ? urlArr.forEach((url) => window.open(url))
        : console.log("Pages not allowed!");
    }
  }

  // Opens all external link from "item-value" [class] i.e {https:// OR http://}
  // Returns the domains in an Array "externalDomainsList[]" for browsers search
  getDomains() {
    var mtchs, mval;
    var rgEx = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z][a-zA-Z]{0,61}[a-zA-Z]/g;
    // dmVal = document
    //   .querySelectorAll("div.mod-content > div > table")[0]
    //   .rows[2].cells[1].innerText.toLowerCase();

    var dmVal =
      document.querySelectorAll("div.mod-content > div > table")[0] != undefined
        ? document
            .querySelectorAll("div.mod-content > div > table")[0]
            .rows[2].cells[1].innerText.toLowerCase()
        : document
            .querySelectorAll(
              "#site_content > div.grid-main > div > div.mod.mod-companyContact.app-companyContact.mod-ui-not-show-title > article > div > table > tbody > tr:nth-child(3) > td:nth-child(3)"
            )[0]
            .innerText.toLowerCase();

    // Checks if "dmVal" has a value. i.e not ['null'] nor ['undefined']
    if (typeof dmVal != "undefined" || typeof dmVal != null) {
      mtchs = dmVal
        .match(rgEx)
        .filter(
          (mtch) =>
            !mtch.includes("alibaba") &&
            !mtch.includes("aibaba") &&
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
            !mtch.includes("google")
        );

      // If there is no result from mtchs? stop loading and close window.
      if (mtchs.length <= 0) {
        window.stop();
        setTimeout(() => {
          window.close();
        }, 5000);
      }

      mtchs.forEach((mtch) =>
        mtch != null
          ? !mtch.includes("www.")
            ? this.extnlDms.push(mtch)
            : (() => {
                mtch
                  .split("www.")[1]
                  .match(rgEx)
                  .forEach((mval) =>
                    mval != null ? this.extnlDms.push(mval) : ""
                  );
              })()
          : ""
      );
    }

    chrome.runtime.sendMessage({ type: "arrangeDomains", dms: this.extnlDms });
  }

  // Main method, the execute method.
  exec(locHref) {
    // Run only id it's from cheaplead, i.e on if location.href has "from=cheaplead"
    if (locHref.includes("from=cheaplead")) {
      // ONly runs in "trade/search" and "company_en" urls
      if (
        (locHref.includes(this.srch.path) &&
          locHref.includes(this.srch.query)) ||
        locHref.includes(this.srch.path_2)
      ) {
        this.getContactLinks();
        this.openContactLinks(this.cntLnkArr);
      }

      // Only runs in "contactinfo.html" urls
      if (locHref.includes("contactinfo.html?from=cheaplead")) {
        this.getDomains();
      }
    }
  }
}

new AliClass();
