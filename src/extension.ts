import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	// add a button to the bottom bar to run add todo command
	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = "Add Todo";
	item.command = "rubber-ducker.addTodo";
	item.show();

	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider("rubber-ducker-sidebar", sidebarProvider)
	);

    context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.addTodo', () => {
		const { activeTextEditor } = vscode.window;
		if (!activeTextEditor) {
			vscode.window.showInformationMessage("No active text editor");
			return;
		}	
		const text = activeTextEditor.document.getText(activeTextEditor.selection);
		vscode.window.showInformationMessage(text);

		sidebarProvider._view?.webview.postMessage({ type: 'new-todo', value: text });
	}));

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
