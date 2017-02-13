/* eslint strict:0 */
global.__DEV__ = true;

global.__BUNDLE_START_TIME__ = Date.now();

// <Even> (web)
if (!global.process) {
    global.process = {
        env: {},
        nextTick: function(fn) {
            setTimeout(fn, 0);
        },
    };
}
// </Even>
