import React, { useState } from 'react';
import './InfoPage.css';
import Header from './Header';
import Footer from './Footer';

const InfoPage = () => {
  const [selectedSection, setSelectedSection] = useState('Vanlige spørsmål og svar');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [openPrivacySection, setOpenPrivacySection] = useState(null); // State for personvernseksjonen
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openTransparencySection, setOpenTransparencySection] = useState(null); // State for åpenhetsloven
  const [openTeamMember, setOpenTeamMember] = useState(null);


  const sections = [
    'Om oss',
    'Hvordan handle hos Auksjonen.no',
    'Hvordan selge hos Auksjonen.no',
    'Vanlige spørsmål og svar',
    'Trygg budgivning',
    'Vilkår for nettauksjon',
    'Personvern',
    'Åpenhetsloven',
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const toggleTeamMember = (index) => {
    setOpenTeamMember(openTeamMember === index ? null : index);
  };

  const togglePrivacySection = (index) => {
    setOpenPrivacySection(openPrivacySection === index ? null : index);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setIsMobileMenuOpen(false);
  };
  const toggleTransparencySection = (index) => {
    setOpenTransparencySection(openTransparencySection === index ? null : index);
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
            {isMobileMenuOpen ? 'Lukk meny' : 'Åpne info-meny'}
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
          {selectedSection === 'Vanlige spørsmål og svar' ? (
            <div>
              <h1>Vanlige Spørsmål og Svar (info)</h1>
              <div className="info-section">
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleQuestion(0)}
                  >
                    Hvordan fungerer auksjonene?
                  </button>
                  {openQuestion === 0 && (
                    <div className="info-answer">
                      <p>
                        Våre auksjoner fungerer ved at selgere legger ut varer for salg med en startpris.
                        Kjøpere kan deretter by på varen, og høyeste bud ved auksjonens slutt vinner varen.
                        Det er viktig å være oppmerksom på minsteprisen, som er det laveste beløpet
                        selgeren er villig til å akseptere.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleQuestion(1)}
                  >
                    Hva er minstepris?
                  </button>
                  {openQuestion === 1 && (
                    <div className="info-answer">
                      <p>
                        Minstepris er det laveste beløpet en selger er villig til å akseptere for varen sin.
                        Hvis høyeste bud ikke når minsteprisen, blir varen ikke solgt.
                      </p>
                      <div className="info-tooltip1">
                        <i className="info-icon">i</i>
                        <span className="info-tooltiptext1">
                          Selger du uten minstepris, risikerer du at varen blir solgt til et lavere beløp enn
                          forventet. Dette kan imidlertid tiltrekke flere budgivere, noe som kan øke sjansene
                          for en raskere salg.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleQuestion(2)}
                  >
                    Hvordan plasserer jeg et bud?
                  </button>
                  {openQuestion === 2 && (
                    <div className="info-answer">
                      <p>
                        For å plassere et bud, naviger til ønsket auksjon og skriv inn ditt budbeløp i budfeltet.
                        Klikk deretter på "Legg inn bud"-knappen for å bekrefte budet. Sørg for at du er logget inn
                        på din konto før du plasserer bud.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleQuestion(3)}
                  >
                    Hva skjer hvis jeg vinner en auksjon?
                  </button>
                  {openQuestion === 3 && (
                    <div className="info-answer">
                      <p>
                        Hvis du vinner en auksjon, vil du motta en e-postbekreftelse med detaljer om hvordan
                        du fullfører kjøpet. Du må deretter betale for varen innen en gitt tidsfrist for å sikre
                        transaksjonen.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleQuestion(4)}
                  >
                    Hva betyr det å selge uten minstepris?
                  </button>
                  {openQuestion === 4 && (
                    <div className="info-answer">
                      <p>
                        Å selge uten minstepris betyr at varen blir solgt til høyeste bud, uansett hvor lavt det er.
                        Dette kan tiltrekke flere budgivere og potensielt resultere i en raskere salg, men det innebærer
                        også risikoen for at varen selges for en lavere pris enn forventet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : selectedSection === 'Personvern' ? (
            <div>
              <h1>Personvern</h1>
              <div className="info-section">
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => togglePrivacySection(0)}
                  >
                    Hvordan vi behandler din informasjon
                  </button>
                  {openPrivacySection === 0 && (
                    <div className="info-answer">
                      <p>
                        Vi tar ditt personvern på alvor og behandler all personlig informasjon konfidensielt. 
                        Informasjonen vi samler inn brukes til å forbedre brukeropplevelsen og tilby tjenester som auksjoner og budgivning.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => togglePrivacySection(1)}
                  >
                    Hvilken informasjon samler vi inn?
                  </button>
                  {openPrivacySection === 1 && (
                    <div className="info-answer">
                      <p>
                        Vi samler inn informasjon som navn, e-postadresse, telefonnummer, og betalingsdetaljer når du registrerer deg, 
                        legger inn bud, eller kjøper varer gjennom vår plattform.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => togglePrivacySection(2)}
                  >
                    Hvordan bruker vi din informasjon?
                  </button>
                  {openPrivacySection === 2 && (
                    <div className="info-answer">
                      <p>
                        Din informasjon brukes til å administrere auksjoner, kontakte deg vedrørende bud, og forbedre våre tjenester. 
                        Vi kan også bruke informasjonen for å sende deg relevante tilbud og oppdateringer.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => togglePrivacySection(3)}
                  >
                    Dine rettigheter
                  </button>
                  {openPrivacySection === 3 && (
                    <div className="info-answer">
                      <p>
                        Du har rett til innsyn, retting, og sletting av dine personopplysninger. Du kan også reservere deg mot direkte markedsføring.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
         ) : selectedSection === 'Åpenhetsloven' ? (
            <div>
              <h1>Åpenhetsloven</h1>
              <div className="info-section">
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleTransparencySection(0)}
                  >
                    Hva er Åpenhetsloven?
                  </button>
                  {openTransparencySection === 0 && (
                    <div className="info-answer">
                      <p>
                        Åpenhetsloven er en norsk lov som krever at større selskaper skal være åpne om hvordan de håndterer spørsmål om grunnleggende menneskerettigheter og anstendige arbeidsforhold i sine leverandørkjeder. 
                        Loven pålegger selskapene å offentliggjøre relevant informasjon og rapporter om deres innsats for å unngå brudd på disse rettighetene.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleTransparencySection(1)}
                  >
                    Hvilke selskaper omfattes av Åpenhetsloven?
                  </button>
                  {openTransparencySection === 1 && (
                    <div className="info-answer">
                      <p>
                        Åpenhetsloven gjelder for større selskaper som har hjemmehørende i Norge og som oppfyller visse kriterier, som blant annet et visst antall ansatte eller en viss omsetning. Loven omfatter også utenlandske selskaper som driver virksomhet i Norge.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleTransparencySection(2)}
                  >
                    Hvordan påvirker Åpenhetsloven forbrukerne?
                  </button>
                  {openTransparencySection === 2 && (
                    <div className="info-answer">
                      <p>
                        Forbrukere får rett til å be om informasjon om hvordan selskaper håndterer risikoer knyttet til menneskerettigheter og arbeidsforhold i sine leverandørkjeder. Dette gir forbrukerne større innsyn og mulighet til å gjøre informerte valg om hvilke produkter de kjøper.
                      </p>
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <button
                    className="info-question"
                    onClick={() => toggleTransparencySection(3)}
                  >
                    Hvilke krav stiller Åpenhetsloven til rapportering?
                  </button>
                  {openTransparencySection === 3 && (
                    <div className="info-answer">
                      <p>
                        Selskaper som omfattes av Åpenhetsloven må årlig offentliggjøre en redegjørelse om hvordan de jobber for å sikre anstendige arbeidsforhold og respektere menneskerettighetene. Denne redegjørelsen skal være lett tilgjengelig for publikum.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
         ): selectedSection === 'Om oss' ? (
            <div>
              <h1>Om oss</h1>
              <div className="about-us-section">
                <section className="about-intro">
                  <p>
                    Velkommen til vår auksjonsplattform! Vi er en dedikert gruppe profesjonelle som er lidenskapelig opptatt av å skape en trygg, rettferdig og spennende markedsplass for kjøp og salg av varer på nett.
                  </p>
                  <p>
                    Hos oss setter vi kunden i sentrum, og vi jobber kontinuerlig med å forbedre vår plattform for å møte dine behov. Vi er stolte av vår åpenhet og våre etiske retningslinjer som sikrer en trygg handel for alle.
                  </p>
                </section>

                <section className="team-section">
                  <h2>Møt teamet vårt</h2>
                  <div className="team-members">
                    <div className="team-member">
                      <button className="team-member-button" onClick={() => toggleTeamMember(0)}>
                        <h3>Biston Karim</h3>
                        <p>Grunnlegger & CEO</p>
                      </button>
                      {openTeamMember === 0 && (
                        <div className="team-member-info">
                          <p>Biston har over 15 års erfaring i auksjonsbransjen og brenner for å skape en rettferdig og åpen markedsplass.</p>
                        </div>
                      )}
                    </div>

                    <div className="team-member">
                      <button className="team-member-button" onClick={() => toggleTeamMember(1)}>
                        <h3>Peiwast Hama</h3>
                        <p>Grunnlegger & CEO</p>
                      </button>
                      {openTeamMember === 1 && (
                        <div className="team-member-info">
                          <p>Peiwast har over 15 års erfaring i auksjonsbransjen og brenner for å skape en rettferdig og åpen markedsplass.</p>
                          </div>
                      )}
                    </div>

                  
                  </div>
                </section>

                <section className="location-section">
                  <h2>Vår adresse</h2>
                  <p>Du finner oss i hjertet av Oslo. Kom gjerne innom for en prat!</p>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.6626437986742!2d10.757933315884757!3d59.91149168187483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e7d194b5a13%3A0x1234567890abcdef!2sOslo%20City%20Center!5e0!3m2!1sen!2sno!4v1617178723875!5m2!1sen!2sno"
                    width="600"
                    height="450"
                    style={{ border: 0, width: '100%', height: '300px' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Maps - Oslo"
                  ></iframe>
                </section>

                <section className="faq-section">
                  <h2>Vanlige spørsmål</h2>
                  <div className="info-section">
                    <div className="info-item">
                      <button
                        className="info-question"
                      >
                        Hva er våre åpningstider?
                      </button>
                      <div className="info-answer">
                        <p>Vi er tilgjengelige fra mandag til fredag, 09:00 - 17:00.</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <button
                        className="info-question"
                      >
                        Hvordan kontakter du oss?
                      </button>
                      <div className="info-answer">
                        <p>Du kan kontakte oss via e-post på support@rimeligauksjon.no eller ringe oss på 22 22 22 22.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
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
