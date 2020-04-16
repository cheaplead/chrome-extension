class Search {
  constructor() {
    this.extnlEms = [];

    this.fetchEmails();
    chrome.runtime.sendMessage({
      type: "arrangeEmails",
      data: { ems: this.extnlEms },
    });
  }

  fetchEmails() {
    var eMtchs,
      regEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
      bodyText = document.body.innerText.toLowerCase().trim().match(regEx);

    // Checks if "bodyText" has a value. i.e not ['null'] nor ['undefined']
    if (bodyText != null) {
      eMtchs = bodyText.filter(
        (eM) =>
          !eM.includes("gmail") &&
          !eM.includes("mail") &&
          !eM.includes("ymail") &&
          !eM.includes("bing") &&
          !eM.includes("zoho") &&
          !eM.includes("hotmail") &&
          !eM.includes("msn") &&
          !eM.includes("outlook") &&
          !eM.includes("google") &&
          !eM.includes("alibaba") &&
          !eM.includes("aibaba") &&
          !eM.includes("ablibaba") &&
          !eM.includes("abilbaba") &&
          !eM.includes("allibaba") &&
          !eM.includes("aliexpress") &&
          !eM.includes("made-in-china") &&
          !eM.includes("1688") &&
          !eM.includes("ebay") &&
          !eM.includes("shopify") &&
          !eM.includes("amazon") &&
          !eM.includes("youtube") &&
          !eM.includes("skype") &&
          !eM.includes("facebook") &&
          !eM.includes("instagram") &&
          !eM.includes("whatsapp") &&
          !eM.includes("yahoo") &&
          !eM.includes("yandex") &&
          !eM.includes("duckduckgo") &&
          !eM.includes("wordpress") &&
          !eM.includes("asp") &&
          !eM.includes("html") &&
          !eM.includes("qq") &&
          !eM.includes("icloud")
      );
      eMtchs.forEach((eMtch) => {
        !this.extnlEms.includes(eMtch)
          ? eMtch.trim() && this.extnlEms.push(eMtch)
          : "";
      });
    }
  }
}

new Search();
