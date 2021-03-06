Ext.ns('monoql.tab');
monoql.tab.querytab = function() {
	var cls = 'monoql-tab-querytab';
	var Class = Ext.extend(monoql.tab.tab, {
		title:'Query',
		layout:'border',
		border:false,
		closable:true,
		connection:null,
		database:null,
		executing:false,
		cancelled:false,
		constructor:function(config) {
			this.addEvents('connectionchange', 'databasechange');
			Class.superclass.constructor.call(this, config);
		},
		initComponent: function() {
			this.updateTitle();
			this.bbar = new monoql.bar.querytabstatusbar({
				querytab:this
			});
			this.queryform = new monoql.form.queryform({
				region:'north',
				tab:this,
				height:200,
				split:true
			});
			this.resulttabset = new monoql.tab.resulttabset({
				region:'center',
				tab:this,
				split:true,
				border:false,
				bodyStyle:'border-top-width:1px;'
			});
			ui.toolbar.connectioncombobox.on('select', this.onToolBarConnectionComboBoxSelect, this);
			ui.toolbar.databasecombobox.on('select', this.onToolBarDatabaseComboBoxSelect, this);
			ui.toolbar.runquerybutton.on('click', this.onToolBarRunQueryButtonClick, this);
			ui.toolbar.cancelquerybutton.on('click', this.onToolBarCancelQueryButtonClick, this);
			this.queryform.on({
				scope:this,
				beforequery:this.onBeforeQuery,
				query:this.onQuery,
				queryresult:this.onQueryResult,
				cancelquery:this.onCancelQuery
			});
			this.on('connectionchange', this.onConnectionChange, this);
			ui.connectionstore.on('update', this.onConnectionStoreUpdate, this);
			this.items = [this.queryform, this.resulttabset];
			Class.superclass.initComponent.call(this);
			this.addClass(cls);
		},
		onBeforeQuery:function(queryform, query, connection) {
		},
		onQuery:function(queryform, query, connection) {
			this.executing = true;
		},
		onQueryResult:function(queryform, query, connection, result) {
			this.executing = false;
		},
		onCancelQuery:function(queryform, connection) {
			this.cancelled = true;
			this.executing = false;
		},
		onConnectionChange:function(tab, oldConn, newConn) {
			this.updateTitle();
			this.setDatabase();
		},
		updateTitle:function() {
			var title = 'Query' + (Ext.isNumber(this.index) ? ' ' + this.index : '');
			title = title + (this.connection ? ' [' + this.connection.get('host') + ']' : '');
			this.setTitle(title);
			return title;
		},
		isActive:function() {
			return this.ownerCt && this.ownerCt.getActiveTab()==this;
		},
		setConnection:function(connection) {
			var old = this.connection;
			this.connection = Ext.isObject(connection) ? connection : ui.connectionstore.getById(connection);
			this.fireEvent('connectionchange', this, old, this.connection);
			return this.connection;
		},
		setDatabase:function(database) {
			var old = this.database;
			this.database = database;
			this.fireEvent('databasechange', this, old, this.database);
			return this.database;
		},
		onToolBarConnectionComboBoxSelect:function(combo, record, index) {
			if (this.isActive()) {
				this.setConnection(combo.getValue());
			}
		},
		onToolBarDatabaseComboBoxSelect:function(combo, record, index) {
			if (this.isActive()) {
				this.setDatabase(combo.getValue());
			}
		},
		onToolBarRunQueryButtonClick:function(button, e) {
			if (this.isActive()) {
				this.queryform.executeQuery();
			}
		},
		onToolBarCancelQueryButtonClick:function(button, e) {
			if (this.isActive()) {
				this.queryform.cancelQuery();
			}
		},
		onConnectionStoreUpdate:function(store, record, index) {
			this.updateTitle();
		}
	});
	Ext.reg(cls, Class);
	return Class;
}();