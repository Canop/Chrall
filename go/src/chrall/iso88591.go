package chrall

// Contient :
//  - une méthode utilitaire donnant une string à partir d'octets correspondant à du ISO 88591
//  - un fournisseur de CharsetReader pour le parsage de fichiers (XML) ISO88591
//
// Une bonne partie de ce code provient à l'origine de là :
//  http://stackoverflow.com/questions/6002619/
//  et a été fourni par peterSO : http://stackoverflow.com/users/221700/peterso

import (
	"bytes"
	"errors"
	"io"
	"os"
	"strings"
	"unicode/utf8"
)

// fournit une string à partir d'une slice d'octets correspondant à du ISO 88591
func BIso88591ToUtf8(srcbytes []byte) string {
	utf8buf := new(bytes.Buffer)
	for _, r := range srcbytes {
		utf8buf.WriteRune(rune(r))
	}
	return utf8buf.String()
}

// fournit une string à partir d'une string encodée en ISO 88591
func Iso88591ToUtf8(src string) string {
	return BIso88591ToUtf8([]uint8(src))
}

type CharsetISO88591er struct {
	r   io.ByteReader
	buf *bytes.Buffer
}

func NewCharsetISO88591(r io.Reader) *CharsetISO88591er {
	buf := bytes.NewBuffer(make([]byte, 0, utf8.UTFMax))
	return &CharsetISO88591er{r.(io.ByteReader), buf}
}

func (cs *CharsetISO88591er) ReadByte() (b byte, err error) {
	// http://unicode.org/Public/MAPPINGS/ISO8859/8859-1.TXT
	// Date: 1999 July 27; Last modified: 27-Feb-2001 05:08
	if cs.buf.Len() <= 0 {
		r, err := cs.r.ReadByte()
		if err != nil {
			return 0, err
		}
		if r < utf8.RuneSelf {
			return r, nil
		}
		cs.buf.WriteRune(rune(r))
	}
	return cs.buf.ReadByte()
}

func (cs *CharsetISO88591er) Read(p []byte) (int, error) {
	// Use ReadByte method.
	return 0, os.ErrInvalid
}

func isCharset(charset string, names []string) bool {
	charset = strings.ToLower(charset)
	for _, n := range names {
		if charset == strings.ToLower(n) {
			return true
		}
	}
	return false
}

func IsCharsetISO88591(charset string) bool {
	// http://www.iana.org/assignments/character-sets
	// (last updated 2010-11-04)
	names := []string{
		// Name
		"ISO_8859-1:1987",
		// Alias (preferred MIME name)
		"ISO-8859-1",
		// Aliases
		"iso-ir-100",
		"ISO_8859-1",
		"latin1",
		"l1",
		"IBM819",
		"CP819",
		"csISOLatin1",
	}
	return isCharset(charset, names)
}

func IsCharsetUTF8(charset string) bool {
	names := []string{
		"UTF-8",
		// Default
		"",
	}
	return isCharset(charset, names)
}

func CharsetReader(charset string, input io.Reader) (io.Reader, error) {
	switch {
	case IsCharsetUTF8(charset):
		return input, nil
	case IsCharsetISO88591(charset):
		return NewCharsetISO88591(input), nil
	}
	return nil, errors.New("CharsetReader: unexpected charset: " + charset)
}
