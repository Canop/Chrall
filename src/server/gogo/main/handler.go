package main

import (
	"fmt"
	"io"
	"http"
	"strconv"
	"os"
)

type Hitter struct {
	nbHits int
	parent *Hitter
}

func (h *Hitter) hit() {
	h.nbHits++
	if h.parent != nil {
		h.parent.hit()
	}
}

type Handler struct {
	Hitter
}

func GetFormValue(hr *http.Request, name string) string {
	values := hr.Form[name]
	if len(values) > 0 {
		return values[0]
	}
	return ""
}
func GetFormValueAsInt(hr *http.Request, name string) int {
	values := hr.Form[name]
	if len(values) > 0 {
		v, _ := strconv.Atoi(values[0])
		return v
	}
	return 0
}
func GetFormValueAsInt64(hr *http.Request, name string) int64 {
	values := hr.Form[name]
	if len(values) > 0 {
		v, _ := strconv.Atoi64(values[0])
		return v
	}
	return 0
}
func GetFormValueAsUint(hr *http.Request, name string) uint {
	values := hr.Form[name]
	if len(values) > 0 {
		v, _ := strconv.Atoui(values[0])
		return v
	}
	return 0
}

func sendError(w http.ResponseWriter, title string, err os.Error) {
	fmt.Printf("\nErreur %s : %s", title, err.String())
	fmt.Fprintf(w, "{\"result\":\"NOK\", \"text\": \"Erreur %s : %s\"}", title, err.String())
}

func (h *Handler) head(w io.Writer, title string) {
	if title == "" {
		title = "canop.org:gOgO"
	}
	fmt.Fprintf(w, "<html><head><title>%s</title>", title)
	w.Write([]byte(`
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">		
		<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
		<style type="text/css">
			body {
				background-color: white;
				font-family: Lucida Sans Unicode, Verdana;
				font-size: 14px;
				padding: 0px;
				margin: 0px;
				color: white;
			}
			div.main {
				width: 700px;
				margin:auto;
				margin-top: 20px;
				-webkit-border-radius: 15px;
				-moz-border-radius: 15px;
				border-radius: 15px;
				box-shadow: 0px 4px 10px #666;
				-moz-box-shadow: 0px 4px 10px #666;
				-webkit-box-shadow: 0px 4px 10px #666;
				font-size: 14px;
				margin-bottom: 20px;
				padding: 10px;
				-o-background-size: 100% 100%;
				-moz-background-size: 100% 100%;
				-webkit-background-size: 100% 100%;
				background-size: 100% 100%;
				background: -moz-linear-gradient(
					top,
					dodgerblue,
					indigo
				);
				background: -webkit-gradient(
					linear,
					left top, left bottom,
					from(dodgerblue),
					to(indigo)
				);
			}
			.emphase {
				color: orange;
				font-weight:bold;
				text-shadow: 0 0 0.2em black; 
			}
			a.gogo:focus {
				oultine: none;
			}
			a.gogo {
				background-color: mediumblue;
				border-top: 1px solid mediumblue;
				border-bottom: 1px solid darkblue;
				margin : 4px;
				padding-left: 8px;
				padding-right: 8px;
				-moz-border-radius: 4px;
				-webkit-border-radius: 4px;
				border-radius: 10px;
				text-decoration: none;
				color: white;
			}
			a.gogo:hover {
				border-top: 1px solid darkblue;
				border-bottom: 1px solid mediumblue;
			}
			textarea {
				width: 100%;
			}
			[invisible] {
				display: none;
			}
			p {
				margin-left: 5px;			
			}
			p#resultContent {
			}
			p#serverMessage {
				font-style: italic;
			}
			li {
				line-height: 1.6em;
			}
			input {
				width: 55%;
			}
			p.bestiary_extract {
				text-align: center;
			}
			table.cdm {
				border-collapse: collapse;
				border: thin solid #A0A0FF;
				font-size:14px;
			}
			table.cdm th {
				border: thin solid #A0A0FF;
				text-align:right;
			}
			table.cdm td {
				border: thin solid #A0A0FF;
				text-align: left;
			}
			table.cdm th.title {
				text-align:center;
			}
		</style>
	</head>
	<body><div class=main>`))
}

func (h *Handler) foot(w io.Writer) {
	fmt.Fprint(w, "</div></body></html>")
}
