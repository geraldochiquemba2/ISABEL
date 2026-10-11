import Capacitor
import UIKit
import WebKit

// View controller principal: igual ao CAPBridgeViewController do storyboard,
// mas com o gesto de sistema "deslizar da borda para voltar" (swipe-to-go-back)
// ligado na WebView — comportamento nativo esperado no iOS.
class ViewController: CAPBridgeViewController {

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        enableSwipeBack(in: view)
    }

    private func enableSwipeBack(in root: UIView) {
        if let web = root as? WKWebView {
            web.allowsBackForwardNavigationGestures = true
            return
        }
        for sub in root.subviews {
            if let web = sub as? WKWebView {
                web.allowsBackForwardNavigationGestures = true
                return
            }
        }
        for sub in root.subviews {
            enableSwipeBack(in: sub)
        }
    }
}
