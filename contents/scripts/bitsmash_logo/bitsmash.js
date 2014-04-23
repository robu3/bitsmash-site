$(document).ready(function () {
	var app = Processing.getInstanceById("bitsmash_logo"),
		bootstrapIntervalId;

	if (!app) {
		// try to get a reference to the processing instance
		// if we couldn't grab it on load
		bootstrapIntervalId = setInterval(function () {
			app = Processing.getInstanceById("bitsmash_logo");
			if (app) {
				bootstrap(app, "BITSMASH");
				clearInterval(bootstrapIntervalId);
			}
		}, 500);
	} else {
		bootstrap(app);
	}
});
