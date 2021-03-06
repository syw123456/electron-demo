const {dialog} = require('electron');
const log = require('electron-log');
const updater = require('electron-simple-updater');
const pkg = require('./package');

const  AppName = pkg.productName + ' 更新';
const  Message ={
       error:'检查更新出错',
       checking:'正在检查更新...',
       updateAvailable:'发现新版本，点击确定后开始下载:',
       updateNotAvailable:'当前已经是最新版本！',
       downloaded:'新版本已下载，将在重启程序后更新至：'
};
function updateHandle(mainWindow) {
    updater.init({
       checkUpdateOnStart: false,
       autoDownload: false,
       logger: log
    });

    updater.on('update-available',(meta)=> {
        log.info('[updater] update available',meta.version);
        dialog.showMessageBox(mainWindow,{
            type : 'info',
            buttons : ['确定'],
            title : AppName,
            message : Message.updateAvailable + meta.version,
            detail : meta.readme
        });
        updater.downloadUpdate();
    });

    updater.on('update-not-available',()=> {
       dialog.showMessageBox(mainWindow,{
               type:'info',
               buttons:['确定'],
               title:AppName,
               message: Message.updateNotAvailable
       })
    });
    updater.on('update-downloading', ()=> {

    });
    updater.on('update-downloaded',()=>{
         log.info('[updater] update downloaded', meta.version);
         const index = dialog.showMessageBox(mainWindow,{
             type : 'info',
             buttons: ['现在重启','稍后重启'],
             title : AppName,
             message :Message.downloaded + meta.version,
             detail : '更新完成!'
         });
         if(index === 0){
             try{
                 updater.quitAndInstall();
             }catch (e) {
                 dialog.showErrorBox('安装失败','无法安装更新程序。')
             }
         }
    });
    
    updater.on('error', (err) => {
        log.error('[updater] updater error' ,err);
        dialog.showMessageBox(mainWindow,{
          type:'error',
          buttons:['确定'],
          title: AppName,
          message:Message.error,
          detail: err.toString()
        })
    });
   updater.checkForUpdates();
}
module.exports ={
    updateHandle
}