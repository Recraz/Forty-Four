// Самоинтегрированная кнопка полноэкранного режима
// Просто добавьте этот файл в папку с сайтом и подключите через <script src="fullscreen-toggle.js"></script>

;(() => {
  // Проверяем, что DOM загружен
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }

  function init() {
    // Добавляем стили
    addStyles()

    // Создаем кнопку полноэкранного режима
    createFullscreenButton()
  }

  function addStyles() {
    const style = document.createElement("style")
    style.textContent = `
            body, ::backdrop {
                background: #000;
            }
            #fullscreen-button {
                position: fixed;
                top: 15px;
                right: 15px;
                background: rgba(0,0,0,0);
                border: 2px solid rgba(0,0,0,0);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                box-sizing: border-box;
                transition: all .3s ease;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 2147483647;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }
            #fullscreen-button:hover {
                transform: scale(1.125);
                background: rgba(0,0,0,1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }
            #fullscreen-button svg {
                width: 20px;
                height: 20px;
                fill: rgba(255,255,255,0.8);
                pointer-events: none;
            }
            #fullscreen-button:hover svg {
                fill: rgba(255,255,255,1);
            }
            #fullscreen-button svg:nth-child(2) { 
                display: none;
            }
            [fullscreen] #fullscreen-button svg:nth-child(1) {
                display: none;
            }
            [fullscreen] #fullscreen-button svg:nth-child(2) {
                display: inline-block;
            }
        `
    document.head.appendChild(style)
  }

  function createFullscreenButton() {
    // Проверяем поддержку полноэкранного режима
    if (!document.fullscreenEnabled) {
      return
    }

    // Создаем кнопку
    const fullscreenButton = document.createElement("button")
    fullscreenButton.setAttribute("id", "fullscreen-button")
    fullscreenButton.addEventListener("click", toggleFullscreen)
    fullscreenButton.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <svg viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
        `

    document.body.appendChild(fullscreenButton)
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen()
      document.body.setAttribute("fullscreen", "")
    } else {
      document.exitFullscreen()
      document.body.removeAttribute("fullscreen")
    }
  }
})()
