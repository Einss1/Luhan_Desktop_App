const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//Listen for app to be ready
app.on('ready', function(){
    //Creates new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width:1500,
        height:1000,
        title:'Luhan',
        resizable: false,
        icon:'Images/icon.png',
    });

    //Loads html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'homepage.html'),
        protocol:'file:',
        slashes: true
    }));
    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle create Journal Entry
function createAddWindow(){
    //Creates new window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        width:300,
        height:200,
        title:'Journal Entry',
        resizable: false,
        icon:'Images/icon.png',
    });

    //Loads html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addwindow.html'),
        protocol:'file:',
        slashes: true
    }));

    //Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}

//Catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

//Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {
                label: 'Add Journal Entry',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Journal',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.env.NODE._ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}



