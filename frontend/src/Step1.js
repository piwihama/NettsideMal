import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './BilForm.css';
import Header from './Header';
import Footer from './Footer';

const Step1 = ({ formData, setFormData, nextStep }) => {
  const validationSchema = Yup.object({
    regNumber: Yup.string().required('Registreringsnummer er påkrevd'),
  });

  return (
    <div>
      <Header />
      <div className="bil-container">
        <h2 className="step-title">Steg 1: Registrer Bilen Din</h2>
        <p className="step-info">
          Vennligst skriv inn registreringsnummeret på bilen du ønsker å selge. Dette vil hjelpe oss med å hente tekniske detaljer om bilen fra Statens Vegvesen.
        </p>

        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const response = await fetch(
                `https://proxyservervegvesen.onrender.com/vehicle-data/${values.regNumber}`
              );

              const contentType = response.headers.get('content-type');
              if (contentType && contentType.indexOf('application/json') !== -1) {
                const carData = await response.json();
                const carInfo =
                  Array.isArray(carData.kjoretoydataListe) && carData.kjoretoydataListe.length > 0
                    ? carData.kjoretoydataListe[0]
                    : {};
                const tekniskeData = carInfo.godkjenning?.tekniskGodkjenning?.tekniskeData || {};

                const updatedFormData = {
                  ...formData,
                  ...values,
                  brand:
                    tekniskeData.generelt?.merke?.[0]?.merke || '',
                  model:
                    tekniskeData.generelt?.handelsbetegnelse?.[0] || '',
                  year:
                    carInfo.godkjenning?.forstegangsGodkjenning?.forstegangRegistrertDato?.split('-')[0] || '',
                  chassisNumber:
                    carInfo.kjoretoyId?.understellsnummer || '',
                  taxClass:
                    carInfo.godkjenning?.tekniskGodkjenning?.kjoretoyklassifisering?.beskrivelse || '',
                  fuel:
                    tekniskeData.miljodata?.miljoOgDrivstoffGruppe?.[0]?.drivstoffKodeMiljodata?.kodeNavn || '',
                  gearType:
                    tekniskeData.motorOgDrivverk?.girkassetype?.kodeBeskrivelse || '',
                  driveType:
                    tekniskeData.motorOgDrivverk?.kjoresystem?.kodeBeskrivelse || '',
                  mainColor:
                    tekniskeData.karosseriOgLasteplan?.rFarge?.[0]?.kodeNavn || '',
                  power:
                    tekniskeData.motorOgDrivverk?.motor?.[0]?.maksNettoEffekt || '',
                  seats:
                    tekniskeData.persontall?.sitteplasserTotalt || '',
                  owners:
                    carInfo.eierskap?.antall || '',
                  firstRegistration:
                    carInfo.godkjenning?.forstegangsGodkjenning?.forstegangRegistrertDato || '',
                  doors:
                    tekniskeData.karosseriOgLasteplan?.antallDorer?.[0] || '',
                  weight:
                    tekniskeData.vekter?.egenvekt || '',
                  co2:
                    tekniskeData.miljodata?.forbrukOgUtslipp?.[0]?.co2BlandetKjoring || '',
                  omregistreringsavgift:
                    carInfo.omregistreringsavgift || '',
                  lastEUApproval:
                    carInfo.periodiskKjoretoyKontroll?.sistGodkjent || '',
                  nextEUControl:
                    carInfo.periodiskKjoretoyKontroll?.kontrollfrist || '',
                };

                setFormData(updatedFormData);
                nextStep();
              } else {
                const textData = await response.text();
                console.error('Unexpected content type:', contentType);
                console.error('Response text:', textData);
              }
            } catch (error) {
              console.error('Error fetching car data:', error);
            }
          }}
        >
          <Form className="bil-form">
            <div className="form-group">
              <label htmlFor="regNumber">Registreringsnummer:</label>
              <Field name="regNumber" type="text" className="form-control" placeholder="F.eks. AB12345" />
              <ErrorMessage name="regNumber" component="div" className="error" />
            </div>

            <div className="info-box">
              <p>
                <strong>Eksempel på gyldige registreringsnummer:</strong>
              </p>
              <ul>
                <li>AB12345</li>
                <li>XY98765</li>
                <li>CD67890</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-primary fetch-button">
              Neste
            </button>
          </Form>
        </Formik>
      </div>
      <Footer />
    </div>
  );
};

export default Step1;
