import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Sortable from 'sortablejs';
import * as Yup from 'yup';
import './Step4.css';
import Header from './Header';
import Footer from './Footer';

const Step4 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [previewImages, setPreviewImages] = useState(formData.previewImages || []);
  const sortableContainerRef = useRef(null);
  const setFieldValueRef = useRef(null);

  const validationSchema = Yup.object({
    description: Yup.string().required('Beskrivelse er påkrevd'),
    conditionDescription: Yup.string().required('Beskrivelse av egenerklæring/tilstand er påkrevd'),
    images: Yup.array().min(1, 'Minst ett bilde er påkrevd'),
  });

  useEffect(() => {
    if (setFieldValueRef.current) {
      setFieldValueRef.current('images', previewImages.map((image) => image.src));
    }
  }, [previewImages]);

  useEffect(() => {
    let sortable;

    if (sortableContainerRef.current) {
      sortable = Sortable.create(sortableContainerRef.current, {
        animation: 150,
        handle: '.step4-drag-handle',
        onEnd: (evt) => {
          if (evt.oldIndex === undefined || evt.newIndex === undefined) return;

          setPreviewImages((prevImages) => {
            const newOrder = Array.from(prevImages);
            const [movedItem] = newOrder.splice(evt.oldIndex, 1);
            newOrder.splice(evt.newIndex, 0, movedItem);
            return newOrder;
          });
        },
      });
    }

    return () => {
      if (sortable) {
        sortable.destroy();
      }
    };
  }, []);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      const newImages = await Promise.all(
        files.map((file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ id: `${file.name}-${Date.now()}-${Math.random()}`, src: reader.result });
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          })
        )
      );

      setPreviewImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.error('Feil ved opplasting av bilder:', error);
    }
  };

  const handleDeleteImage = (index) => {
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    setPreviewImages((prevImages) => {
      const newOrder = [...prevImages];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return newOrder;
    });
  };

  const moveImageDown = (index) => {
    if (index === previewImages.length - 1) return;
    setPreviewImages((prevImages) => {
      const newOrder = [...prevImages];
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
      return newOrder;
    });
  };

  return (
    <div>
      <Header />
      <div className="step4-container">
        <Formik
          initialValues={{ ...formData, images: previewImages.map((image) => image.src) }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setFormData({ ...values, previewImages });
            nextStep();
          }}
        >
          {({ setFieldValue }) => {
            setFieldValueRef.current = setFieldValue;

            return (
              <Form className="step4-form">
                <h2>Detaljer om Auksjon</h2>

                <div className="step4-group">
                  <label htmlFor="description">Beskrivelse av det du skal selge</label>
                  <Field as="textarea" id="description" name="description" className="step4-control" />
                  <ErrorMessage name="description" component="div" className="step4-error" />
                </div>

                <div className="step4-group">
                  <label htmlFor="conditionDescription">Beskrivelse av egenerklæring / tilstand</label>
                  <Field as="textarea" id="conditionDescription" name="conditionDescription" className="step4-control" />
                  <ErrorMessage name="conditionDescription" component="div" className="step4-error" />
                </div>

                <div className="step4-group">
                  <label htmlFor="images">Last opp bilder</label>
                  <div ref={sortableContainerRef} className="step4-image-preview-container">
                    {previewImages.map((image, index) => (
                      <div key={image.id} className="step4-image-preview">
                        <span className="step4-drag-handle">☰</span>
                        <img src={image.src} alt={`Preview ${index}`} />
                        <div className="step4-button-container">
                          <button type="button" onClick={() => moveImageUp(index)} disabled={index === 0}>Opp</button>
                          <button type="button" onClick={() => moveImageDown(index)} disabled={index === previewImages.length - 1}>Ned</button>
                          <button type="button" onClick={() => handleDeleteImage(index)}>Slett</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <input type="file" id="images" name="images" onChange={handleImageUpload} multiple accept="image/*" />
                  <ErrorMessage name="images" component="div" className="step4-error" />
                </div>

                <div className="step4-navigation">
                  <button type="button" onClick={prevStep} className="step4-btn-primary">Tilbake</button>
                  <button type="submit" className="step4-btn-primary">Neste</button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <Footer />
    </div>
  );
};

export default Step4;
