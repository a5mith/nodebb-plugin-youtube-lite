'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	res.render('templates/admin/plugins/youtube-lite', {});
};

module.exports = Controllers;