let saveButton = document.getElementById("save");
let loadButton = document.getElementById("load");

saveButton.addEventListener("click", async () => {
    chrome.windows.getAll({populate: true }, function(windowList) {
        let windowArr = windowList.map(getWindow)
        console.log(windowArr)
        let json = JSON.stringify(windowArr , null, 4);
        jsonBlob = new Blob([json], {type: "octet/stream"}),
        fileUrl = window.URL.createObjectURL(jsonBlob);
        chrome.downloads.download({ url:fileUrl, saveAs: true, filename: "chrome_session.json" },function(downloadId){
            console.log("download begin, the downId is:" + downloadId);
        });
    });
});

loadButton.addEventListener("click", async () => {
    let [test] = await window.showOpenFilePicker()
    const file = await test.getFile();
    const contents = await file.text();
    let session = JSON.parse(contents)
    //console.log(session)
    session.forEach(element => {
        console.log(element)
        chrome.windows.create(element)
    });
})

function getWindow(windowDesc) {
    let window = {} 
    window.focused = windowDesc.focused
    window.left = windowDesc.left
    window.width = windowDesc.width
    window.top = windowDesc.top
    window.height = windowDesc.height
    window.incognito = windowDesc.incognito
    window.type = windowDesc.type
    window.url = getUrls(windowDesc.tabs)
    return window
}

function getUrls(tabs) {
    return tabs.map((it) => it.url)
}