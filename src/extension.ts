import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider("rubber-ducker-sidebar", sidebarProvider)
	);

	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.refresh', async () => {
		// // to start the app (control f5 then you can press control r to reload the app)
		await vscode.commands.executeCommand("workbench.action.closeSidebar");
		await vscode.commands.executeCommand("workbench.view.extension.rubber-ducker-sidebar-view");
		// setTimeout(() => {
		// 	vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
		// }, 500);
	}));
}

export function deactivate() {}
