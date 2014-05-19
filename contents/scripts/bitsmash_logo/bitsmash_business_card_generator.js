function updateLogo() {
	var app = Processing.getInstanceById("bitsmash_business_card"),
		bootstrapIntervalId,
		name = $("#name").val(),
		seedText = $("#seed_text").val(),
		angleText = $("#angle").val(),
		options = {};

	// see if an explosion angle was provided
	if ($.isNumeric(angleText)) {
		options.angle = parseInt(angleText);
	}

	// generate the logo
	if (!app) {
		// try to get a reference to the processing instance
		// if we couldn't grab it on load
		bootstrapIntervalId = setInterval(function () {
			app = Processing.getInstanceById("bitsmash_business_card_logo");
			if (app) {
				bootstrap(app, seedText, options);
				clearInterval(bootstrapIntervalId);
			}
		}, 500);
	} else {
		bootstrap(app);
	}

	// update the text
	$("#business_card_generator h1").text(name);

	return false;
}

$(document).ready(function () {
	$("#generate_button").click(updateLogo);

	$("#name").change(function () {
		$("#seed_text").val($("#name").val());
	});
});
