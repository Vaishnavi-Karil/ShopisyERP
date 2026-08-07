// Console Ninja Test Script
console.log("Console Ninja: Standard log test.");
console.warn("Console Ninja: Warning test.");

function triggerError() {
  throw new Error("Console Ninja: Test Error - Runtime exception.");
}

// Uncomment the line below to trigger the test error after 2 seconds
// setTimeout(triggerError, 2000);

module.exports = { triggerError };
