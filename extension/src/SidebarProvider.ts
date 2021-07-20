import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./tokenManager";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "authenticate": {
          authenticate(() => {
            webviewView.webview.postMessage({ type: 'token', value: TokenManager.getToken() })
          })
          break
        }
        case "logout": {
          TokenManager.setToken("")
        }
        case "get-token": {
          // send accessToken back to webview (sidebar.svelete) 
          webviewView.webview.postMessage({ type: 'token', value: TokenManager.getToken() })
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "live-share": {
          return vscode.commands.executeCommand("liveshare.start").then((data) => data)
              // TODO save the url in global state to access in the chat.svelete file
              // THEN can remove the setTimeout shit
              // https://prod.liveshare.vsengsaas.visualstudio.com/join?376621C5FFDB0DA0FC148C08B048F47799AA
              // webviewView.webview.postMessage({ type: 'token', value: TokenManager.getToken() })
              // data.authority + data.query

              // authority: "prod.liveshare.vsengsaas.visualstudio.com"
              // path: "/join"
              // query: "376621C5FFDB0DA0FC148C08B048F47799AA"
              // scheme: "https")
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
    }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
          const apiBaseUrl = ${JSON.stringify(apiBaseUrl)};
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}