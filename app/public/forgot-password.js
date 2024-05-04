const forgotPasswordForm = document.getElementById('forgot-password-form');
    const messageDiv = document.getElementById('message');

    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;

      try {
        const response = await fetch('http://localhost:4000/api/recovery/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          messageDiv.textContent = 'Contraseña restablecida exitosamente';
        } else {
          const error = await response.json();
          messageDiv.textContent = error.message;
        }
      } catch (error) {
        console.error(error);
        messageDiv.textContent = 'Ha ocurrido un error al restablecer la contraseña';
      }
    });