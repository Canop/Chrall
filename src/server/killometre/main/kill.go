package main

type Kill struct {
	Tueur         int
	TueurEstTroll bool
	Tué           int
	TuéEstTroll   bool
	Tag           tag
	Seconds       int64 // la date du kill
}
