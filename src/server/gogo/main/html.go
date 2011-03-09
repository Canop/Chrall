package main

/*
quelques fonctions pour le formatage html des CDM
*/

import (
	"strconv"
)

func cdmValuesCell(min uint, max uint) string {
	if min == max {
		return "<td>" + strconv.Uitoa(min) + "</td>"
	}
	if max == 0 {
		return "<td>" + strconv.Uitoa(min) + " - +∞</td>"
	}
	return "<td>" + strconv.Uitoa(min) + " - " + strconv.Uitoa(max) + "</td>"
}
func cdmValuesLine(label string, min uint, max uint) string {
	if min == 0 && max == 0 {
		return ""
	}
	return "<tr><th>" + label + "</th>" + cdmValuesCell(min, max) + "</tr>"
}
func cdmValueLine(label string, v uint) string {
	if v == 0 {
		return ""
	}
	return "<tr><th>" + label + "</th><td>" + strconv.Uitoa(v) + "</td></tr>"
}
func cdmBooleanLine(label string, b boolean) string {
	if b == b_unknown {
		return ""
	}
	return "<tr><th>" + label + "</th><td>" + b.String() + "</td></tr>"
}
func cdmTextLine(label string, t string) string {
	if t == "" {
		return ""
	}
	return "<tr><th>" + label + "</th><td>" + t + "</td></tr>"
}
