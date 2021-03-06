Ext.ns('monoql.form');
monoql.form.queryform = function() {
	var cls = 'monoql-form-queryform';
	var Class = Ext.extend(monoql.form.form, {
		defaults:{},
		bodyStyle:{
			'border-top-width':'0px',
			'border-left-width':'0px',
			'border-right-width':'0px'
		},
		initComponent: function() {
			this.addEvents('beforequery', 'query', 'queryresult', 'cancelquery');
			this.querytextarea = new Ext.form.TextArea({
				name:'queries',
				hideLabel:true,
				anchor:'0 0'
			});
			this.queryfield = new Ext.form.Hidden({
				name:'query'
			});
			this.querytextarea.on('render', this.onQueryTextAreaRender, this);
			this.tab.on('activate', this.onQueryTabActivate, this);
			this.items = [this.querytextarea, this.queryfield];
			Class.superclass.initComponent.call(this);
			this.addClass(cls);
		},
		onQueryTabActivate:function(tab) {
			this.querytextarea.focus();
		},
		onQueryTextAreaRender:function(textarea) {
			this.keyMap = new Ext.KeyMap(this.el, [{
				key:Ext.EventObject.ENTER,
				ctrl:true,
				handler:this.onQueryFormCtrlEnter,
				stopEvent:true,
				scope:this
			},{
				key:Ext.EventObject.F9,
				ctrl:false,
				handler:this.onQueryFormF9,
				stopEvent:true,
				scope:this
			}]);
		},
		onQueryFormCtrlEnter:function(key, e) {
			this.executeQuery();
		},
		onQueryFormF9:function(key, e) {
			this.executeQuery();
		},
		executeQuery:function() {
			var query = this.querytextarea.getSelectedText() || this.querytextarea.getValue();
			if (this.fireEvent('beforequery', this, query, this.tab.connection) !== false) {
				if (query.trim()) {
					var store = this.tab.resulttabset.resulttab.grid.getStore();
					// Apply params to the baseParams so the livegrid toolbar will pick them up, because
					// it is not remembering params
					store.load({
						baseParams:Ext.apply(store.baseParams, {
							query:query,
							connectionId:this.tab.connection.id,
							database:this.tab.database
						})
					});
					this.fireEvent('query', this, query, this.tab.connection);
					this.tab.resulttabset.resulttab.grid.getStore().on('load', this.onResultGridStoreLoad, this, {single:true});
				}
			}
		},
		onResultGridStoreLoad:function(store, records, options) {
			// A cancelled query just sets the cancelled property of the tab to true
			// since there is no way in Ext to abort a DirectProxy request -- so the
			// response will arrive but get ignored
			if (this.tab.cancelled) {
				this.tab.cancelled = false;
			} else {
				var query = options.params.query,
					connection = ui.connectionstore.getById(options.params.connectionId)
				this.fireEvent('queryresult', this, query, connection, records);
			}
		},
		cancelQuery:function() {
			this.fireEvent('cancelquery', this, this.tab.connection);
		}
	});
	Ext.reg(cls, Class);
	return Class;
}();