import React, { useState } from 'react';
import './InfoPage.css';
import Header from './Header';
import Footer from './Footer';

const InfoPage = () => {
  const [selectedSection, setSelectedSection] = useState('Ofte stilte spørsmål');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    'Om oss',
    'Hvordan det fungerer',
    'Ofte stilte spørsmål',
    'Vilkår og betingelser',
    'Personvern',
    'Kontakt oss',
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="info-page-container">
        <aside className="info-menu">
          <button 
            className="info-mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
          </button>
          <ul className={`info-sidebar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            {sections.map((section, index) => (
              <li 
                key={index} 
                className={selectedSection === section ? 'active' : ''}
                onClick={() => handleSectionChange(section)}
              >
                {section}
              </li>
            ))}
          </ul>
        </aside>

        <main className="info-content">
          {selectedSection === 'Ofte stilte spørsmål' ? (
            <div>
              <h1>Ofte stilte spørsmål</h1>
              <div className="info-section">
                {[
                  { question: "Hvordan registrerer jeg meg?", answer: "Du kan registrere deg ved å klikke på 'Registrer deg' øverst på siden og fylle inn dine opplysninger." },
                  { question: "Er det gratis å bruke tjenesten?", answer: "Ja, grunnleggende bruk av tjenesten er gratis. Noen funksjoner kan ha ekstra kostnader." },
                  { question: "Hvordan endrer jeg kontoinnstillinger?", answer: "Gå til 'Min konto', hvor du kan oppdatere e-post, passord og annen informasjon." },
                  { question: "Hvordan kontakter jeg kundesupport?", answer: "Du kan kontakte oss via e-post eller telefon. Se 'Kontakt oss'-seksjonen for mer informasjon." },
                ].map((item, index) => (
                  <div className="info-item" key={index}>
                    <button className="info-question" onClick={() => toggleQuestion(index)}>
                      {item.question}
                    </button>
                    {openQuestion === index && <div className="info-answer"><p>{item.answer}</p></div>}
                  </div>
                ))}
              </div>
            </div>
          ) : selectedSection === 'Om oss' ? (
            <div>
              <h1>Om oss</h1>
              <p>
                Vi er et dedikert team som jobber for å tilby en pålitelig og brukervennlig tjeneste for våre brukere.
                Vårt mål er å forenkle digitale opplevelser og skape en plattform som alle kan ha nytte av.
              </p>
            </div>
          ) : selectedSection === 'Hvordan det fungerer' ? (
            <div>
              <h1>Hvordan det fungerer</h1>
              <p>
                1. Opprett en konto og logg inn. <br />
                2. Utforsk våre tjenester og produkter. <br />
                3. Bruk tjenesten til det formålet du ønsker. <br />
                4. Ta kontakt hvis du trenger hjelp!
              </p>
            </div>
          ) : selectedSection === 'Vilkår og betingelser' ? (
            <div>
              <h1>Vilkår og betingelser</h1>
              <p>
                Ved å bruke denne tjenesten godtar du våre vilkår og betingelser. Disse kan oppdateres jevnlig, 
                så vi anbefaler at du holder deg oppdatert.
              </p>
            </div>
          ) : selectedSection === 'Personvern' ? (
            <div>
              <h1>Personvern</h1>
              <p>
                Vi tar ditt personvern på alvor. Vi samler kun inn nødvendig informasjon for å kunne tilby en god tjeneste.
                Les mer i vår personvernerklæring.
              </p>
            </div>
          ) : selectedSection === 'Kontakt oss' ? (
            <div>
              <h1>Kontakt oss</h1>
              <p>Har du spørsmål? Ta kontakt med oss:</p>
              <ul>
                <li>E-post: support@nettsidemal.com</li>
                <li>Telefon: +47 123 45 678</li>
                <li>Adresse: Eksempelgata 12, 0000 Oslo, Norge</li>
              </ul>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.6626437986742!2d10.757933315884757!3d59.91149168187483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e7d194b5a13%3A0x1234567890abcdef!2sOslo%20City%20Center!5e0!3m2!1sen!2sno!4v1617178723875!5m2!1sen!2sno"
                width="600"
                height="450"
                style={{ border: 0, width: '100%', height: '300px' }}
                allowFullScreen=""
                loading="lazy"
                title="Google Maps - Oslo"
              ></iframe>
            </div>
          ) : (
            <div>
              <h1>{selectedSection}</h1>
              <p>Innholdet for {selectedSection} vil vises her.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default InfoPage;
