import sys
import os
from PyQt5.QtCore import Qt, QUrl
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView

class SmartNyangWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("SmartNyang Desktop Pet")
        self.setGeometry(100, 100, 440, 680)

        # Make window frameless and transparent
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.SubWindow)
        self.setAttribute(Qt.WA_TranslucentBackground, True)

        # WebEngine container
        self.browser = QWebEngineView(self)
        
        # Load local index.html
        html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../index.html'))
        self.browser.setUrl(QUrl.fromLocalFile(html_path))
        self.setCentralWidget(self.browser)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = SmartNyangWindow()
    window.show()
    sys.exit(app.exec_())
