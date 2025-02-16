import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Step5.css';
import Header from './Header';
import Footer from './Footer';

const Step5 = ({ formData, setFormData, prevStep, nextStep }) => {
  const validationSchema = Yup.object().shape({
    auctionDuration: Yup.string().required('Vennligst velg hvor raskt du vil selge.'),
    reservePrice: Yup.number().min(0, 'Minstepris må være større enn eller lik 0'),
    auctionWithoutReserve: Yup.boolean(),
  });

  return (
    <div>
      <Header />
      <div className="step5-container">
        <h2 className="step-title">Steg 5: Auksjonsinnstillinger</h2>
        <p className="step-info">
          Her kan du bestemme hvor lenge auksjonen skal vare og om du vil ha en minstepris. Velg nøye for å sikre at du får best mulig resultat for salget ditt.
        </p>

        <Formik
          initialValues={{
            auctionDuration: formData.auctionDuration || '',
            reservePrice: formData.reservePrice || '',
            auctionWithoutReserve: formData.auctionWithoutReserve || false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setFormData({ ...formData, ...values });
            nextStep();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="step5-form">
              <div className='step5-group'>
                <label htmlFor='auctionDuration'>Hvor raskt vil du selge?</label>
                <Field as='select' id='auctionDuration' name='auctionDuration' className='step5-control'>
                  <option value=''>Velg</option>
                  <option value='3'>3 dager</option>
                  <option value='5'>5 dager</option>
                  <option value='7'>7 dager</option>
                  <option value='10'>10 dager</option>
                </Field>
                <ErrorMessage name='auctionDuration' component='div' className='step5-error' />
              </div>

              <div className="info-box">
                <p><strong>Tips:</strong> Kortere auksjoner kan føre til raskere salg, men gir mindre tid til å tiltrekke budgivere. Lengre auksjoner kan gi høyere bud hvis du kan vente.</p>
              </div>

              <div className='step5-group'>
                <label>
                  <Field
                    type='checkbox'
                    name='auctionWithoutReserve'
                    checked={values.auctionWithoutReserve}
                    onChange={() => setFieldValue('auctionWithoutReserve', !values.auctionWithoutReserve)}
                  />
                  Jeg vil selge uten minstepris
                  <div className="tooltip1">
                    <span className="info-icon">?</span>
                    <span className="tooltiptext">
                      Å selge uten minstepris betyr at varen din selges til høyeste bud, uavhengig av beløpet. Dette kan tiltrekke flere budgivere, men innebærer risiko for lavere salgspris.
                    </span>
                  </div>
                </label>
              </div>

              {!values.auctionWithoutReserve && (
                <div className='step5-group'>
                  <label htmlFor='reservePrice'>
                    Minstepris
                    <div className="tooltip1">
                      <span className="info-icon">?</span>
                      <span className="tooltiptext">
                        Minstepris er den laveste prisen du aksepterer. Hvis budene ikke når denne prisen, blir ikke varen solgt.
                      </span>
                    </div>
                  </label>
                  <Field
                    type='number'
                    id='reservePrice'
                    name='reservePrice'
                    className='step5-control'
                    placeholder='Skriv inn minstepris'
                  />
                  <ErrorMessage name='reservePrice' component='div' className='step5-error' />
                </div>
              )}

              <div className='step5-navigation'>
                <button type='button' onClick={prevStep} className='step5-btn-primary'>
                  Tilbake
                </button>
                <button type='submit' className='step5-btn-primary'>
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

export default Step5;
