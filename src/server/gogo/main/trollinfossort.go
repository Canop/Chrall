package main

// tri des trollinfos dans Chrall

import (
	"sort"
)

type TrollInfosArray struct {
	data []*TrollInfos
	val  func(troll *TrollInfos) uint
}

func (a *TrollInfosArray) Len() int {
	return len(a.data)
}
func (a *TrollInfosArray) Less(i int, j int) bool {
	if a.data[i] == nil {
		return false
	}
	if a.data[j] == nil {
		return true
	}
	return a.val(a.data[j]) < a.val(a.data[i])
}
func (a *TrollInfosArray) Swap(i int, j int) {
	a.data[i], a.data[j] = a.data[j], a.data[i]
}

func SortTrollInfos(source []*TrollInfos, size uint, val func(troll *TrollInfos) uint) []*TrollInfos {
	sortedTrolls := make([]*TrollInfos, len(source))
	copy(sortedTrolls, source)
	a := &TrollInfosArray{sortedTrolls, val}
	sort.Sort(a)
	sortedTrolls = sortedTrolls[0:size]
	return sortedTrolls
}
