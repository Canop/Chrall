package main

/*
Interrogations du serveur SOAP de MH

*/

import (
	"bytes"
	"fmt"
	"http"
	"io"
	"io/ioutil"
	"strings"
	"xml"
	//"os"
)

// http://www.mountyhall.com/Forum/display_topic_threads.php?ThreadID=2171938

const MH_SOAP_URL = "http://sp.mountyhall.com/SP_WebService.php"

// params : numero (%d), mdprestreint (%s)
// params : numero (%d), mdprestreint (%s)
const SOAP_PROFIL_QUERY_FORMAT = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:tns=\"urn:SP_WebService\" xmlns:soap=\"http://schemas.xmlsoap.org/wsdl/soap/\" xmlns:wsdl=\"http://schemas.xmlsoap.org/wsdl/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" ><SOAP-ENV:Body><mns:Profil xmlns:mns=\"uri:mhSp\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><numero xsi:type=\"xsd:string\">%d</numero><mdp xsi:type=\"xsd:string\">%s</mdp></mns:Profil></SOAP-ENV:Body></SOAP-ENV:Envelope>"
const SOAP_CHARACTERISTIQUES_QUERY_FORMAT = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:tns=\"urn:SP_WebService\" xmlns:soap=\"http://schemas.xmlsoap.org/wsdl/soap/\" xmlns:wsdl=\"http://schemas.xmlsoap.org/wsdl/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" ><SOAP-ENV:Body><mns:Caracteristiques xmlns:mns=\"uri:mhSp\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><numero xsi:type=\"xsd:string\">%d</numero><mdp xsi:type=\"xsd:string\">%s</mdp></mns:Caracteristiques></SOAP-ENV:Body></SOAP-ENV:Envelope>"
const SOAP_VUE_QUERY_FORMAT = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:tns=\"urn:SP_WebService\" xmlns:soap=\"http://schemas.xmlsoap.org/wsdl/soap/\" xmlns:wsdl=\"http://schemas.xmlsoap.org/wsdl/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" ><SOAP-ENV:Body><mns:Vue xmlns:mns=\"uri:mhSp\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><numero xsi:type=\"xsd:string\">%d</numero><mdp xsi:type=\"xsd:string\">%s</mdp></mns:Vue></SOAP-ENV:Body></SOAP-ENV:Envelope>"

type SoapItem struct { // un objet vu
	Numero    int
	Nom       string
	Type      string
	PositionX int
	PositionY int
	PositionN int
	Monde     int
}

type SoapVue struct {
	Items []SoapItem "return>item"
}

type SoapProfil struct { // un peu incomplet, certes
	Numero uint
}
type SoapFault struct {
	Faultstring string
	Detail      string
}
type SoapBody struct {
	Fault          SoapFault
	ProfilResponse SoapProfil
	VueResponse    SoapVue
}
type SoapEnvelope struct {
	XMLName xml.Name
	Body    SoapBody
}

/*

Structure d'un message d'erreur:

{{http://schemas.xmlsoap.org/soap/envelope/ Body} []}
{{http://schemas.xmlsoap.org/soap/envelope/ Fault} []}
{{ faultcode} [{{http://www.w3.org/2001/XMLSchema-instance type} xsd:string}]}
SERVER
{{ faultcode}}
{{ faultactor} [{{http://www.w3.org/2001/XMLSchema-instance type} xsd:string}]}
{{ faultactor}}
{{ faultstring} [{{http://www.w3.org/2001/XMLSchema-instance type} xsd:string}]}
Erreur 2
{{ faultstring}}
{{ detail} [{{http://www.w3.org/2001/XMLSchema-instance type} xsd:string}]}
Troll inexistant
{{ detail}}
{{http://schemas.xmlsoap.org/soap/envelope/ Fault}}
{{http://schemas.xmlsoap.org/soap/envelope/ Body}}
{{http://schemas.xmlsoap.org/soap/envelope/ Envelope}}

*/


func DumpAll(r io.Reader) {
	b, e := ioutil.ReadAll(r)
	if e != nil {
		fmt.Println("Erreur lecture :")
		fmt.Println(e)
	}
	s := string(b)
	fmt.Print(s)
}

func GetSoapEnvelope(query string, numero uint, mdp string) (envelope *SoapEnvelope) {
	httpClient := new(http.Client)
	soapRequestContent := fmt.Sprintf(query, numero, mdp)
	
	resp, err := httpClient.Post(MH_SOAP_URL, "text/xml; charset=utf-8", bytes.NewBufferString(soapRequestContent))

	if err != nil {
		fmt.Println("Erreur : " + err.String())
		return nil
	}
	// là on fait du lourd : on passe par une chaine car j'ai pas le temps ce soir de trouver comment sauter directement un bout du flux jusqu'au début du xml
	b, e := ioutil.ReadAll(resp.Body)
	if e != nil {
		fmt.Println("Erreur lecture :")
		fmt.Println(e)
	}
	in := string(b)
	indexDebutXml := strings.Index(in, "<?xml version")
	if indexDebutXml>0 {
		fmt.Printf("Erreur message SOAP. Début XML à l'index %d\n", indexDebutXml)
		in = in[indexDebutXml:len(in)]
	}
	//fmt.Print(in)
	parser := xml.NewParser(bytes.NewBufferString(in))
	parser.CharsetReader = CharsetReader
	envelope = new(SoapEnvelope)
	err = parser.Unmarshal(&envelope, nil)
	if err != nil {
		fmt.Println("Erreur au décodage du XML : " + err.String())
		return nil
	}

	resp.Body.Close()

	return
}

func FetchVueSoap(numero uint, mdp_restreint string) (items []SoapItem, errorCode string, errorDetails string) {
	env := GetSoapEnvelope(SOAP_VUE_QUERY_FORMAT, numero, mdp_restreint)

	if env == nil {
		errorCode = "soap_error"
		errorDetails = "erreur connexion ou parsage"
		return
	}

	//~ fmt.Println("Résultat : ", env.XMLName)

	if env.Body.Fault.Detail != "" {
		// il semble que le serveur MH ne soit pas capable de reconnaitre un mauvais mdp : je reçois ça comme erreur : "Erreur inconnue"
		errorCode = "soap_error"
		errorDetails = env.Body.Fault.Detail
		fmt.Printf("Fault : %s\n", env.Body.Fault.Detail)
		return
	}

	items = env.Body.VueResponse.Items

	fmt.Printf("Vue > Nombre d'items : %d\n", len(items))
	//~ fmt.Printf("Vue > Item : %+v\n", items)
	return
}


// vérifie, par une connexion SOAP, que le couple (numero, mdp_restreint) est authentifié par MH.
// Ceci consomme l'une des connexions autorisées pour ce troll, il ne faut donc le faire que si le mot de passe a changé
func CheckPassword(numero uint, mdp_restreint string) (ok bool, errorCode string, errorDetails string) {
	env := GetSoapEnvelope(SOAP_PROFIL_QUERY_FORMAT, numero, mdp_restreint)
	if env == nil {
		errorCode = "soap_error"
		errorDetails = "erreur connexion ou parsage"
		return
	}

	if env.Body.Fault.Detail != "" {
		// il semble que le serveur MH ne soit pas capable de reconnaitre un mauvais mdp : je reçois ça comme erreur : "Erreur inconnue"
		errorCode = "soap_error"
		errorDetails = env.Body.Fault.Detail
		fmt.Printf("Fault : %s\n", env.Body.Fault.Detail)
		return
	}

	// on va considérer que si l'on a reçu un profil qui contienne un niveau initialisé alors MH a considéré le couple (numero, mdp) comme valide
	if env.Body.ProfilResponse.Numero <= 0 {
		errorCode = "soap_error"
		errorDetails = "profil incoherent"
		return
	}

	ok = true
	return
}
