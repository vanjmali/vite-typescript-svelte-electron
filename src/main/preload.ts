import { ipcRenderer, contextBridge } from "electron";
import { generateNameChannel, validChannels } from "./ipcMain";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const send = (channel: string, ...args: any[]) => {
	if (validChannels('to').includes(channel)) {
		ipcRenderer.send(channel, args);
		return true;
	}
	return false;
};
const receive = (channel: string, func: Function) => {
	if (validChannels('from').includes(channel)) {
		// Deliberately strip event as it includes `sender`
		ipcRenderer.on(channel, (event, ...args) => func(...args));
		return true;
	}
	return false;
};
contextBridge.exposeInMainWorld(
	"main", {
	send,
	receive,
	get: (channel: string, callbackFunc?: Function, ...args: any[]) => {
		return new Promise((resolve) => {
			console.log(`[main] Calling ${channel}`);

			// Set a listener for received message
			const receiveName = generateNameChannel(channel, 'from');
			const calledReceive = receive(receiveName, (...data: any[]) => {
				console.log(`[main] Received ${channel}`);
				if (callbackFunc) callbackFunc(...data);

				ipcRenderer.removeAllListeners(receiveName);
				resolve(data);
			});

			// Send data to main
			const calledSent = send(generateNameChannel(channel, 'to'), ...args);

			// Display error and reset if one of the above failed
			if (!calledReceive || !calledSent) {
				console.error(`[main] ${channel} doesn't exist for ${!calledSent ? 'send ' : ''}${!calledReceive && !calledSent ? 'and ' : ''}${!calledReceive ? 'receive' : ''}!`);
				ipcRenderer.removeAllListeners(receiveName);
			}
		});
	}
});;