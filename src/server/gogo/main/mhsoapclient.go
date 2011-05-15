package main

import (
	"bytes"
	"fmt"
	"http"
	"io/ioutil"
)

const MH_SOAP_URL = "http://sp.mountyhall.com/SP_WebService.php"

// params : numero (%d), mdprestreint (%s)
const SOAP_PROFIL_QUERY_FORMAT = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:tns=\"urn:SP_WebService\" xmlns:soap=\"http://schemas.xmlsoap.org/wsdl/soap/\" xmlns:wsdl=\"http://schemas.xmlsoap.org/wsdl/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" ><SOAP-ENV:Body><mns:Profil xmlns:mns=\"uri:mhSp\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><numero xsi:type=\"xsd:string\">%d</numero><mdp xsi:type=\"xsd:string\">%s</mdp></mns:Profil></SOAP-ENV:Body></SOAP-ENV:Envelope>"

type SoapProfil struct {

}

func GetSoapProfil(numero, mdp) *SoapProfil {
	httpClient := new(http.Client)
	soapRequestContent := Sprintf(SOAP_PROFIL_QUERY_FORMAT, numero, mdp)
	resp, err := httpClient.Post(MH_SOAP_URL, "text/xml; charset=utf-8", bytes.NewBufferString(soapRequestContent))
	//resp, err := httpClient.Post("http://localhost:9090/test", "text/xml; charset=utf-8", bytes.NewBufferString(soapRequestContent))

	if err != nil {
		fmt.Println("Erreur : " + err.String())
		return
	}

	b, e := ioutil.ReadAll(resp.Body)
	if e != nil {
		fmt.Println("Erreur lecture :")
		fmt.Println(e)
	}
	s := string(b)
	fmt.Print(s)
	resp.Body.Close()
	fmt.Println()
	return nil
}

func main() {
	GetSoapProfil(666, "aaa")
}
