<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Youtube Lite</div>
			<div class="panel-body">
				<blockquote>
					<p>
						Youtube Lite allows you to lazyload Youtube Videos on your forum. You will need an API key to use this plugin.<br /><br />
					</p>
				</blockquote>
				<p>
					To get started:
				</p>
				<ol>
					<li>
						Sign into Youtube and visit <a href="https://developers.google.com/youtube/v3/getting-started#before-you-start">The Youtube Help Pages</a>. You will need to enable the Youtube v3 API and then go to APIs & Auth > Credentials to create a new browser API key.
					</li>
					<li>
					    Find your key, <a target="_blank" href="http://i.imgur.com/AxvKc9f.png">screenshot-1</a>. (Don't use mine, it only accepts requests from my domain.)
					</li>
					<li>
						Paste your API key into the field below, hit save, and restart/reload NodeBB.
					</li>
				</ol>
				<form role="form" class="youtube-settings">
					<fieldset>
						<div class="row">
							<div class="col-sm-6">
								<div class="form-group">
									<label for="apiKey">v3 API Key</label>
									<input placeholder="AIzaSyAecaR1l_7k9Hs4TtiL83FKhDJfnIreVro" type="text" class="form-control" id="apiKey" name="apiKey" />
								</div>
							</div>
						</div>
					</fieldset>
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

<script>
	require(['settings'], function(Settings) {
		Settings.load('youtube', $('.youtube-settings'));

		$('#save').on('click', function() {
			Settings.save('youtube', $('.youtube-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'youtube-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				})
			});
		});
	});
</script>