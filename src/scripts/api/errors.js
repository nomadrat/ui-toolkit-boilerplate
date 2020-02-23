export function handleError($form, error, response) {
  let errorText;

  if (error && error.code) {
    switch(error.code) {
      case "auth.signin.wrong-credentials":
        errorText = "Sorry, wrong password or email.";
        break;

      case "auth.signup.user-exists":
        errorText = "Looks like we already have a user with this email.";
        break;
    }
  }

  if (error.message && !errorText) {
    errorText = error.message;
  }

  if (!errorText) {
    errorText = "Something happened on our side. Please try again in ten minutes.";
  }

  $.remove(".alert", $form);

  const $alert = $.insertFirstChild($form, $.createElement('div.alert error', {
    html: `<p>${errorText}</p>`
  }));

  return new Promise((approve) => {
    approve($alert, $form);
  });
}