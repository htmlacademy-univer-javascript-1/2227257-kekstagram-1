
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const fileChooser = document.querySelector('input[type=file]');
const preview = document.querySelector('.img-upload__preview').querySelector('img');
const effectsPreview = document.querySelectorAll('.effects__preview');

fileChooser.addEventListener('change', () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const linkURL = URL.createObjectURL(file);
    preview.src = linkURL;
    for (const effectPreview of effectsPreview) {
      effectPreview.style.backgroundImage = `url(${linkURL})`;
    }
  }
});
