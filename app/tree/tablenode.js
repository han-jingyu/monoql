Ext.ns('monoql.tree');
monoql.tree.tablenode = function() {
	var cls = 'monoql-tree-tablenode';
	var Class = Ext.extend(monoql.tree.node, {
		constructor: function(attributes) {
			Ext.apply(attributes, {
				iconCls:cls + '-icon'
			});
			this.menu = new monoql.menu.tablenodemenu({
				node:this
			});
			Class.superclass.constructor.call(this, attributes);
			this.on('beforeload', this.onTableNodeBeforeLoad, this);
			this.attributes.cls = [this.attributes.cls, cls].join(" ");
		},
		onTableNodeBeforeLoad:function(node) {
			Ext.apply(node.getOwnerTree().getLoader().baseParams, {
				table:node.getTable(),
				database:node.getDatabase()
			});
		}
	});
	Ext.tree.TreePanel.nodeTypes[cls] = Class;
	return Class;
}();