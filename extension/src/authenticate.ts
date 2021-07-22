import * as vscode from 'vscode'
import { apiBaseUrl } from './constants'
import * as polka from 'polka'
import { TokenManager } from './tokenManager'

export const authenticate = (cb: () => void) => {
    const app = polka()
    // listens out for the redirect that is happening server side
    app.get(`/auth/:token`, async (req, res) => {
        const { token } = req.params
        if (!token) {
            res.end('<h1>something went wrong<h1>')
            return
        }

        await TokenManager.setToken(token)
        cb()
        res.end('auth was successful, you can close this now')
        app.server?.close()
    })
    app.listen(54321, (err: Error) => {
        if (err) {
            vscode.window.showErrorMessage(err.message)
        } else {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${apiBaseUrl}/auth/github`))
        }
    })
}