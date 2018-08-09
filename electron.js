// 初始化创建对象
const {app,BrowserWindow,ipcMain,shell,globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const update = require('./update');
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.

let mainWindow;

function createWindow(){
    mainWindow = new BrowerWindow({
        width:1200,
        height:800,
        frame:false,
        resizable:false,
        icon:_dirname +'./src/img/logon_min.png',
        webPreferences:{
            webSecurity: false
        }
    })
}
//开发的目录
mainWindow.loadURL('http://localhost:3000/');

//关闭的事件
mainWindow.on('closed',function () {
      mainWindow = null;
});

//检查更新
update.updateHandle(mainWindow);

//监听关闭窗口的事件
ipcMain.on('closeWindow',function () {
    app.quit();
});

//窗口的最小化
ipcMain.on('minWindow',function () {
   mainWindow.minimize();
});

//浏览器的打开外部的链接
ipcMain.on('openUrl',function (event ,url) {
   shell.openExternal(url);
});

/*
* 添加键盘的事件
* */

if(process.env.NODE_ENV !== 'production'){
    globalShortcut.register('F6',function () {
        mainWindow.webContents.openDevTools()
    })
}
// 刷新页面

globalShortcut.register('F5',function () {
    mainWindow.reload();
});
globalShortcut.register('Ctrl+R',function () {
    mainWindow.reload();
});

//当electron 初始化完成后，当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready',createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed',function () {
   // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
    if(process.platform !== 'darwin'){
        app.quit()
    }
});
// 窗口处于活跃的状态
app.on('activate',function () {
    // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
    if(mainWindow === null){
        createWindow()
    }
});






































