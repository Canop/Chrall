package main

// test des utilitaires sql

import (
	"testing"
)

func testJoinIds(t *testing.T, ids []int, attendu string) {
	res := JoinIds(ids, ",")
	if  res != attendu {
		t.Errorf("Unexpected value for JoinIds : \"%s\" instead of \"%s\"", res, attendu)
	}
}

func TestJoinIds(t *testing.T) {
	testJoinIds(t, []int{1, 2, 3}, "1,2,3")
	testJoinIds(t, []int{}, "")
	testJoinIds(t, []int{1}, "1")
}
