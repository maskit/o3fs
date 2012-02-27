YUI().use('node', 'event', 'io', 'json', 'node-menunav', 'view', function (Y) {
	var BrowserAppView;
	
	Y.one('#browser-menu').plug(Y.Plugin.NodeMenuNav);
	BrowserAppView = Y.BrowserAppView = Y.Base.create('browserAppView', Y.View, [], {
		container: Y.one('#browser-app'),
		events: {
			'#browser-menu-storage-mount': {click: 'mount'},
			'#browser-menu-storage-unmount': {click: 'unmount'},
			'#browser-menu-storage-list': {click: 'listStorage'},
		},
		// --- Application ---
		mount: function(e) {
			Y.io('/api/V1/alive', {
				on: {
					success: function(tx, res, args) {
						var data = Y.JSON.parse(res.responseText);
						console.log(data);
					},
					failure: function(tx, res, args) {
					}
				}
			});
		}
		
	});
	new BrowserAppView();
});