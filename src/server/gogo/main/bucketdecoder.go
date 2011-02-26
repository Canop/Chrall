package main

/*
Décodeur du seau versé dans le Puit de chrall.

Ce seau est une chaine qui peut contenir des CDM, et peut-être un jour autre chose
*/

type BucketDecoder struct {
	cdm []CDM // les CDM trouvées dans l'input	
	nbCdm int
}



func (bd *BucketDecoder) Decode(input string) {
}
