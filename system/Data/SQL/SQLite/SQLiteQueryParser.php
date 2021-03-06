<?php
class SQLiteQueryParser extends AbstractQueryParser implements IQueryParser {

	public function isSelect() {
		$q = trim($this->query);
		return !!preg_match('/^SELECT/i', $q);
	}

	public function isInsert() {}

	public function isUpdate() {}

	public function isDelete() {}

	public function isCreate() {}

	public function addLimit($limit) {
		if ($this->isSelect() && !preg_match('/limit\s[0-9]+/i', $this->query)) {
			$this->query = $this->query . " LIMIT {$limit}";
		}
		return $this;
	}
	
	public function addOffset($offset) {
		if ($this->isSelect() && !preg_match('/(limit\s[0-9]+,\s+[0-9]+|offset\s[0-9]+)/i', $this->query)) {
			$this->query = $this->query . " OFFSET {$offset}";
		}
		return $this;
	}
	
	public function setup() {
		return $this;
	}
	
}
?>