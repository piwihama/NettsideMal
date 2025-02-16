function validation(values) {
  let errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'Fornavn er påkrevd';
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'Etternavn er påkrevd';
  }
  if (!values.email.trim()) {
    errors.email = 'E-post er påkrevd';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'E-post adresse er ugyldig';
  }
  if (!values.confirmEmail.trim()) {
    errors.confirmEmail = 'Bekreft E-post er påkrevd';
  } else if (values.email !== values.confirmEmail) {
    errors.confirmEmail = 'E-post adresser samsvarer ikke';
  }
  if (!values.password.trim()) {
    errors.password = 'Passord er påkrevd';
  } else if (values.password.length < 8) {
    errors.password = 'Passord må være minst 8 tegn';
  }
  if (!values.mobile.trim()) {
    errors.mobile = 'Mobilnummer er påkrevd';
  }
  if (!values.birthDate.trim()) {
    errors.birthDate = 'Fødselsdato er påkrevd';
  }
  if (!values.address1.trim()) {
    errors.address1 = 'Adresse er påkrevd';
  }
  if (!values.postalCode.trim()) {
    errors.postalCode = 'Postnummer er påkrevd';
  }
  if (!values.city.trim()) {
    errors.city = 'Sted er påkrevd';
  }


  return errors;
}

export default validation;
