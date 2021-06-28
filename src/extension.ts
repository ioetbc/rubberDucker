import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.refresh', () => {
		HelloWorldPanel.kill();
		HelloWorldPanel.createOrShow(context.extensionUri);
		// to start the app run the app in watch mode (fn f5 then you can press control r to reload the app becuase I have added a keybinding to the refresh comand)
		setTimeout(() => {
			vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
		}, 500);
	}));
}

export function deactivate() {}
