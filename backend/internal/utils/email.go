package utils

import (
	"fmt"
	"log"
	"net/smtp"
)

func SendEmail(host, port, from, to, subject, body string) error {
	addr := fmt.Sprintf("%s:%s", host, port)
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, to, subject, body)

	err := smtp.SendMail(addr, nil, from, []string{to}, []byte(msg))
	if err != nil {
		log.Println("❌ Ошибка отправки email:", err)
	}
	return err
}
