import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Step2.css';
import Header from './Header';
import Footer from './Footer';

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
  const validationSchema = Yup.object({
    brand: Yup.string().required('Merke er påkrevd'),
    model: Yup.string().required('Modell er påkrevd'),
    year: Yup.string().required('År er påkrevd'),
    chassisNumber: Yup.string().required('Chassisnummer er påkrevd'),
    taxClass: Yup.string().required('Avgiftsklasse er påkrevd'),
    fuel: Yup.string().required('Drivstoff er påkrevd'),
    gearType: Yup.string().required('Girtype er påkrevd'),
    driveType: Yup.string().required('Driftstype er påkrevd'),
    mainColor: Yup.string().required('Hovedfarge er påkrevd'),
    power: Yup.string().required('Effekt er påkrevd'),
    seats: Yup.string().required('Antall seter er påkrevd'),
    owners: Yup.string().required('Antall eiere er påkrevd'),
    firstRegistration: Yup.string().required('1. gang registrert er påkrevd'),
    doors: Yup.string().required('Antall dører er påkrevd'),
    weight: Yup.string().required('Egenvekt er påkrevd'),
    co2: Yup.string().required('CO2-utslipp er påkrevd'),
    omregistreringsavgift: Yup.string().required('Omregistreringsavgift er påkrevd'),
    lastEUApproval: Yup.string().required('Sist EU-godkjent er påkrevd'),
    nextEUControl: Yup.string().required('Neste frist for EU-kontroll er påkrevd'),
    mileage: Yup.string().required('Kilometerstand er påkrevd'),
  });

  const formRef = useRef(null);

  const scrollToFirstError = (errors) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const errorElement = document.getElementById(errorFields[0]);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="step2-container">
        <h2 className="step-title">Steg 2: Teknisk Informasjon</h2>
        <p className="step-info">
          Informasjonen nedenfor er automatisk hentet fra Statens Vegvesen. Dobbeltsjekk detaljene og fyll inn eventuelle manglende felter.
        </p>

        <div className="info-box">
          <p><strong>Tips:</strong></p>
          <ul>
            <li>Merke og modell finner du i bilens vognkort.</li>
            <li>Chassisnummeret er unikt for hvert kjøretøy.</li>
            <li>Oppgi korrekt kilometerstand for å unngå tvil hos kjøpere.</li>
          </ul>
        </div>

        <Formik
          innerRef={formRef}
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setFormData({ ...formData, ...values });
            nextStep();
            setSubmitting(false);
          }}
          validateOnChange={false}
        >
          {({ handleSubmit, errors }) => (
            <Form className="step2-form" onSubmit={(e) => {
              handleSubmit(e);
              scrollToFirstError(errors);
            }}>
              {[
                { name: 'brand', label: 'Merke' },
                { name: 'model', label: 'Modell' },
                { name: 'year', label: 'År' },
                { name: 'chassisNumber', label: 'Chassisnummer' },
                { name: 'taxClass', label: 'Avgiftsklasse' },
                { name: 'fuel', label: 'Drivstoff' },
                { name: 'gearType', label: 'Girtype' },
                { name: 'driveType', label: 'Driftstype' },
                { name: 'mainColor', label: 'Hovedfarge' },
                { name: 'power', label: 'Effekt' },
                { name: 'seats', label: 'Antall seter' },
                { name: 'owners', label: 'Antall eiere' },
                { name: 'firstRegistration', label: '1. gang registrert' },
                { name: 'doors', label: 'Antall dører' },
                { name: 'weight', label: 'Egenvekt' },
                { name: 'co2', label: 'CO2-utslipp' },
                { name: 'omregistreringsavgift', label: 'Omregistreringsavgift' },
                { name: 'lastEUApproval', label: 'Sist EU-godkjent' },
                { name: 'nextEUControl', label: 'Neste frist for EU-kontroll' },
                { name: 'mileage', label: 'Kilometerstand' },
              ].map((field) => (
                <div className="step2-group" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <Field name={field.name} type="text" id={field.name} className="step2-control" />
                  <ErrorMessage name={field.name} component="div" className="step2-error" />
                </div>
              ))}

              <div className="step2-navigation">
                <button type="button" onClick={prevStep} className="step2-btn-primary">
                  Tilbake
                </button>
                <button type="submit" className="step2-btn-primary">
                  Neste
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <Footer />
    </div>
  );
};

export default Step2;
