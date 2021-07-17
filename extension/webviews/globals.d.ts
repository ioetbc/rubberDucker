import * as _vscode from "vscode"

declare global {
    const tsvscode: {
        postMessage: any
        getState: () => any
        setState: (state: any) => void
    }
    const apiBaseUrl: string
}