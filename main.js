const { app, BrowserWindow } = require('electron');
const path = require('path')

function createWindow(){
  const window = new BrowserWindow({
    width: 700,
    height: 600,
    autoHideMenuBar: true,
    webPreferences:{
      contextIsolation: true
    },
    icon: path.resolve(__dirname, 'assets', 'img', 'icon.png')
  });

  window.loadFile('index.html')
  window.setMinimumSize(700, 500)
  window.setMaximumSize(930, 600)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () =>{
  if(process.platform !== 'darwin') app.quit()
});

app.on('activate', () =>{
  if(BrowserWindow.getAllWindows().length === 0) createWindow()
})