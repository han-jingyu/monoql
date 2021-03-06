Ext.ns('monoql.menu');
monoql.menu.databasenodemenu = function() {
	var cls = 'monoql-menu-databasenodemenu';
	var Class = Ext.extend(monoql.menu.nodemenu, {
		initComponent:function() {
			this.query = new monoql.menu.item({
				text:'New Query',
				iconCls:'monoql-menu-item-query-icon'
			});
			this.createtable = new monoql.menu.item({
				text:'Create Table',
				iconCls:'monoql-menu-item-createtable-icon'
			});
			this.dropalltables = new monoql.menu.item({
				text:'Drop All Tables',
				iconCls:'monoql-menu-item-dropalltables-icon'
			});
			this.emptyalltables = new monoql.menu.item({
				text:'Empty All Tables',
				iconCls:'monoql-menu-item-emptyalltables-icon'
			});
			this.drop = new monoql.menu.item({
				text:'Drop Database',
				iconCls:'monoql-menu-item-dropdatabase-icon'
			});
			Class.superclass.initComponent.call(this);
			this.addClass(cls);
			this.add([this.query, this.createtable, this.emptyalltables, this.dropalltables, this.drop, this.refresh]);
		}
	});
	Ext.reg(cls, Class);
	return Class;
}();