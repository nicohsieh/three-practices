export function optimizedResize() {
    let throttle = function(type, name) {
        var running = false
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                window.dispatchEvent(new CustomEvent(name))
                running = false;
            })
        };
        window.addEventListener(type, func)
    }

    throttle('resize', 'optimizedResize')
}
