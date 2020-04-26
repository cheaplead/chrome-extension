class Store {
  constructor() {
    console.log("Hello, Store Script!");
    this.storageEmails = [];
    this.storageDomains = [];
    this.exec();
  }

  // Handles all messages
  handleMessages() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case "saveThisData":
          this.validateData(...request.data);
          this.saveToStorage(request);
          this.sendResponse({ msg: "Saved!" });
          break;

        default:
          console.error("Unrecognised message: ", request.type);
          break;
      }
    });
  }

  validateData(data) {
    var dms = data.domains;
    var ems = data.emails;
  }

  saveToStorage(jsonBag = {}) {
    chrome.storage.sync.set({ [jsonBag.userId]: jsonBag });
  }

  exec() {
    this.handleMessages();
    this.saveToStorage();
  }
}
new Store();
