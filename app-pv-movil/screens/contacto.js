
import React from 'react';

function ContactForm() {
    return (
        <div className="contact-form-container">
            <form className="contact-form">
                <label htmlFor="name">Nombre Completo:</label>
                <input type="text" id="name" name="name" required maxLength="100" pattern="[A-Za-z\s]+" placeholder="Ingresa tu nombre completo"/>

                <label htmlFor="phone">Número de Celular:</label>
                <input type="tel" id="phone" name="phone" required maxLength="15" pattern="[0-9]+" placeholder="Ingresa tu número de celular"/>

                <label htmlFor="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" required placeholder="Ingresa tu correo electrónico"/>

                <label htmlFor="message">Mensaje:</label>
                <textarea id="message" name="message" maxLength="200" placeholder="Escribe tu mensaje (máx 200 caracteres)"></textarea>

                <button type="submit" className="submit-button">Enviar Formulario</button>

                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/ios-filled/50/000000/facebook.png" alt="Facebook"/></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"/></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/ios-filled/50/000000/youtube-play.png" alt="YouTube"/></a>
                    <a href="https://example.com" target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/ios-filled/50/000000/domain.png" alt="Sitio Web"/></a>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
