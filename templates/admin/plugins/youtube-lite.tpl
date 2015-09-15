<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Youtube Lite</div>
			<div class="panel-body">
				<form class="form">
	<div class="row">
		<div class="col-sm-6 col-xs-12">
			<div class="form-group">
				<label>Youtube API Key</label>
				<input id="youtubeAPIKey" type="text" class="form-control" placeholder="Enter Youtube API Key" value="{settings.youtubeAPIKey}">
			</div>
		</div>
	</div>
</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<input id="csrf_token" type="hidden" value="{csrf}" />

<script>
	$('#save').on('click', function() {
			var data = {
				_csrf: $('#csrf_token').val(),
				youtubeAPIKey: $('#youtubeAPIKey').val(),
			};

			$.post(config.relative_path + '/api/admin/plugins/youtube-lite/save', data, function(data) {
				app.alertSuccess(data.message);
			});

		return false;
	});
	});
</script>