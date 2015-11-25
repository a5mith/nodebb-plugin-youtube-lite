'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	res.render('admin/plugins/youtube-lite', {});
};

module.exports = Controllers;