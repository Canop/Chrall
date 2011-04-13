package main

import (
	"sort"
)

type TrollArray struct {
	data []*Troll
	val func(troll *Troll) uint
}
func (a *TrollArray) Len() int {
	return len(a.data)
}
func (a *TrollArray) Less(i int, j int) bool {
	if a.data[i] == nil {
		return false
	}
	if a.data[j] == nil {
		return true
	}
	return a.val(a.data[j]) < a.val(a.data[i])
}
func (a *TrollArray) Swap(i int, j int) {
	a.data[i], a.data[j] = a.data[j], a.data[i]
}

func SortTrolls(source []*Troll, size uint, val func(troll *Troll) uint) []*Troll {
	sortedTrolls := make([]*Troll, len(source))
	copy(sortedTrolls, source)
	a := &TrollArray{sortedTrolls, val}
	sort.Sort(a)
	sortedTrolls = sortedTrolls[0:size]
	return sortedTrolls
}


