  let highestZ = 1000;
        let draggedWindow = null;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let resizingWindow = null;
        let resizeStartX = 0;
        let resizeStartY = 0;
        let resizeStartWidth = 0;
        let resizeStartHeight = 0;

        // Lock screen functionality
        function updateLockScreen() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
            const dateStr = now.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
            
            document.getElementById('lock-time').textContent = timeStr;
            document.getElementById('lock-date').textContent = dateStr;
        }

        function unlockScreen() {
            document.getElementById('lock-screen').classList.add('hidden');
            document.querySelector('.desktop').classList.add('visible');
        }

        function showPowerMenu(e) {
            e.stopPropagation();
            const menu = document.getElementById('power-menu');
            menu.classList.toggle('active');
        }

        function sleepComputer() {
            document.getElementById('power-menu').classList.remove('active');
            document.getElementById('start-menu').classList.remove('active');
            
            // Close all windows
            document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
            document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
            
            // Show lock screen
            document.getElementById('lock-screen').classList.remove('hidden');
            document.querySelector('.desktop').classList.remove('visible');
        }

        function shutdownComputer() {
            document.getElementById('power-menu').classList.remove('active');
            document.getElementById('start-menu').classList.remove('active');
            
            const overlay = document.getElementById('shutdown-overlay');
            overlay.classList.add('active');
            
            setTimeout(() => {
                // Close all windows
                document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
                document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
                
                overlay.classList.remove('active');
                document.getElementById('lock-screen').classList.remove('hidden');
                document.querySelector('.desktop').classList.remove('visible');
            }, 2000);
        }

        function restartComputer() {
            document.getElementById('power-menu').classList.remove('active');
            document.getElementById('start-menu').classList.remove('active');
            
            const overlay = document.getElementById('shutdown-overlay');
            const text = overlay.querySelector('.shutdown-text');
            text.textContent = 'Restarting...';
            overlay.classList.add('active');
            
            setTimeout(() => {
                // Close all windows
                document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
                document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
                
                overlay.classList.remove('active');
                text.textContent = 'Shutting down...';
                document.getElementById('lock-screen').classList.remove('hidden');
                document.querySelector('.desktop').classList.remove('visible');
            }, 2000);
        }

        updateLockScreen();
        setInterval(updateLockScreen, 1000);

        function updateClock() {
            const now = new Date();
            document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        updateClock();
        setInterval(updateClock, 1000);

        function toggleStartMenu() {
            document.getElementById('start-menu').classList.toggle('active');
        }

        function openWindow(name) {
            const win = document.getElementById(name + '-window');
            const taskbar = document.getElementById('taskbar-' + name);
            
            win.classList.add('active');
            taskbar.classList.add('active');
            win.style.zIndex = ++highestZ;
        }

        function closeWindow(name) {
            const win = document.getElementById(name + '-window');
            const taskbar = document.getElementById('taskbar-' + name);
            
            win.classList.remove('active');
            taskbar.classList.remove('active');
        }

        function minimizeWindow(name) {
            document.getElementById(name + '-window').classList.remove('active');
        }

        function focusWindow(name) {
            const win = document.getElementById(name + '-window');
            if (win.classList.contains('active')) {
                win.style.zIndex = ++highestZ;
            } else {
                openWindow(name);
            }
        }

        function maximizeWindow(name) {
            const win = document.getElementById(name + '-window');
            if (win.style.width === '100%') {
                win.style.width = '900px';
                win.style.height = '600px';
                win.style.left = '100px';
                win.style.top = '80px';
            } else {
                win.style.width = '100%';
                win.style.height = 'calc(100vh - 48px)';
                win.style.left = '0';
                win.style.top = '0';
            }
        }

        // Dragging functionality
        document.querySelectorAll('.window-titlebar').forEach(titlebar => {
            titlebar.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('window-control')) return;
                
                draggedWindow = titlebar.parentElement;
                draggedWindow.style.zIndex = ++highestZ;
                
                const rect = draggedWindow.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (draggedWindow) {
                draggedWindow.style.left = (e.clientX - dragOffsetX) + 'px';
                draggedWindow.style.top = (e.clientY - dragOffsetY) + 'px';
            }
            
            if (resizingWindow) {
                const deltaX = e.clientX - resizeStartX;
                const deltaY = e.clientY - resizeStartY;
                
                resizingWindow.style.width = Math.max(400, resizeStartWidth + deltaX) + 'px';
                resizingWindow.style.height = Math.max(300, resizeStartHeight + deltaY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            draggedWindow = null;
            resizingWindow = null;
        });

        // Resize functionality
        document.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                resizingWindow = handle.parentElement;
                resizeStartX = e.clientX;
                resizeStartY = e.clientY;
                resizeStartWidth = resizingWindow.offsetWidth;
                resizeStartHeight = resizingWindow.offsetHeight;
            });
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            const startMenu = document.getElementById('start-menu');
            const startButton = document.querySelector('.start-button');
            const powerMenu = document.getElementById('power-menu');
            
            if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                startMenu.classList.remove('active');
            }
            
            if (!powerMenu.contains(e.target) && !e.target.closest('.sidebar-item[title="Power"]')) {
                powerMenu.classList.remove('active');
            }
        });

        // Browser functions
        function navigateBack() {
            alert('Browser back button clicked!');
        }

        function navigateForward() {
            alert('Browser forward button clicked!');
        }

        function refreshBrowser() {
            alert('Browser refresh button clicked!');
        }

        // Bring window to front when clicked
        document.querySelectorAll('.window').forEach(win => {
            win.addEventListener('mousedown', () => {
                win.style.zIndex = ++highestZ;
            });
        });