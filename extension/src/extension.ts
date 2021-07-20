import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { authenticate } from './authenticate'
import { TokenManager } from './tokenManager';

export function activate(context: vscode.ExtensionContext) {
	TokenManager.globalState = context.globalState
	console.log('token value is: ', TokenManager.getToken())
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

	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.authenticate', () => {
		try {
			authenticate(() => {
				sidebarProvider._view?.webview.postMessage({ type: 'token', value: TokenManager.getToken() })
			})
		} catch(error) {
			console.log('errrrr', error)
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.refresh', async () => {
		await vscode.commands.executeCommand("workbench.action.closeSidebar");
		await vscode.commands.executeCommand("workbench.view.extension.rubber-ducker-sidebar-view");
	}));
}

export function deactivate() {}
