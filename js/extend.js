//获取剪贴板数据方法
function getClipboardText(event){
    var clipboardData = event.clipboardData || window.clipboardData;
    return clipboardData.getData("text");
};


//设置剪贴板数据
function setClipboardText(event, value){
    if(event.clipboardData){
        return event.clipboardData.setData("text/plain", value);
    }else if(window.clipboardData){
        return window.clipboardData.setData("text", value);
    }
};