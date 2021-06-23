import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('rubber-ducker.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri)
	}));
}

export function deactivate() {}
