const resetPasswordForm = document.getElementById('reset-password-form');
    const messageDiv = document.getElementById('message');

    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = document.getElementById('token').value;
      const newPassword = document.getElementById('newPassword').value;

      try {
        const response = await fetch('/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
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