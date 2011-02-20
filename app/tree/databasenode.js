Ext.ns('monoql.tree');
monoql.tree.databasenode = function() {
	var cls = 'monoql-tree-databasenode';
	var Class = Ext.extend(monoql.tree.node, {
		constructor: function(attributes) {
			Ext.apply(attributes, {
				iconCls:cls + '-icon'
			});
			this.menu = new monoql.menu.databasenodemenu({
				node:this
			});
			this.menu.query.on('click', this.onMenuQueryClick, this);
			Class.superclass.constructor.call(this, attributes);
			this.attributes.cls = [this.attributes.cls, cls].join(" ");
		},
		onMenuQueryClick:function(item, e) {
			this.menu.hide();
			ui.tabs.addQueryTab(this.getConnection(), this.attributes.database);
		}
	});
	Ext.tree.TreePanel.nodeTypes[cls] = Class;
	return Class;
}();