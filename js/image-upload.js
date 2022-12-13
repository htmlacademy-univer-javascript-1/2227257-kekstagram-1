import { isEscapeKey } from './util.js';
import { sendData } from './api.js';

//// Selectors for editor view
const windowBody = document.querySelector('body');
const inputImage = document.querySelector('#upload-file');
const overlayImage = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');

// Scale
const buttonScaleSmaller = overlayImage.querySelector('.scale__control--smaller');
const buttonScaleBigger = overlayImage.querySelector('.scale__control--bigger');
const scaleControl = overlayImage.querySelector('.scale__control--value');
const editedPicture = overlayImage.querySelector('.img-upload__preview').querySelector('img');

// Effects
const effects = overlayImage.querySelector('.effects__list');
const slider = overlayImage.querySelector('.effect-level__slider');
const effectLevelInput = overlayImage.querySelector('.effect-level__value');
const fieldSlider = overlayImage.querySelector('.img-upload__effect-level');
let checkedBox;

//// Selectors for hashtags and comment (description) -> Validation
const form = document.querySelector('.img-upload__form');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

//// Selectors for state of submission
const successfulSubmission = document.querySelector('#success').content.querySelector('.success');
const erroneousSubmission = document.querySelector('#error').content.querySelector('.error');
const successButton = successfulSubmission.querySelector('.success__button');
const errorButton = erroneousSubmission.querySelector('.error__button');

//// Editor view

const setValues = () => {
  checkedBox = 'effect-none';
  fieldSlider.classList.add('hidden');
  scaleControl.value = `${100}%`;
  editedPicture.style.transform = `scale(${1})`;
};

const resetValues = () => {
  inputImage.value = '';
  hashtagInput.value = '';
  commentInput.value = '';
  editedPicture.className = '';
  scaleControl.value = `${100}%`;
  editedPicture.style.transform = `scale(${1})`;
  const errors = document.querySelectorAll('.text__error');
  for (const error of errors) {
    error.textContent = '';
  }
  slider.noUiSlider.destroy();
};

const closeOverlayImage = () => {
  overlayImage.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onOverlayEscKeydown);
  closeButton.removeEventListener('click', closeOverlayImage);

  submitButton.removeAttribute('disabled', 'true');
  form.removeEventListener('submit', submitListener);

  buttonScaleBigger.removeEventListener('click', changeScale);
  buttonScaleSmaller.removeEventListener('click', changeScale);

  effects.removeEventListener('change', effectPicture);
  resetValues();
};

function onOverlayEscKeydown(evt) {
  if (isEscapeKey(evt) && evt.target !== hashtagInput
    && evt.target !== commentInput && !windowBody.contains(erroneousSubmission)) {
    evt.preventDefault();
    closeOverlayImage();
  }
}

function changeScale(evt) {
  const scaleValue = scaleControl.value.replace('%', '');
  if (evt.target === buttonScaleSmaller && scaleValue > 25) {
    scaleControl.value = `${parseInt(scaleValue, 10) - 25}%`;
    editedPicture.style.transform = `scale(${(parseInt(scaleValue, 10) - 25) / 100})`;
  } else if (evt.target === buttonScaleBigger && scaleValue < 100) {
    scaleControl.value = `${parseInt(scaleValue.replace(), 10) + 25}%`;
    editedPicture.style.transform = `scale(${(parseInt(scaleValue, 10) + 25) / 100})`;
  }
}

// Effect change
function effectPicture(evt) {
  checkedBox = evt.target.id;
  let currentMin = 0;
  let currentMax = 100;
  let currentStart = 100;
  let currentStep = 1;
  let effectClass;
  switch (evt.target.id) {
    case 'effect-chrome':
      currentMin = 0;
      currentMax = 1;
      currentStep = 0.1;
      currentStart = 1;
      effectClass = 'effects__preview--none';
      break;
    case 'effect-sepia':
      currentMin = 0;
      currentMax = 1;
      currentStep =
        0.1;
      currentStart = 1;
      effectClass = 'effects__preview--chrome';
      break;
    case 'effect-marvin':
      currentMin = 0;
      currentMax = 100;
      currentStep = 1;
      currentStart = 100;
      effectClass = 'effects__preview--sepia';
      break;
    case 'effect-phobos':
      currentMin = 0;
      currentMax = 3;
      currentStep = 0.1;
      currentStart = 3;
      effectClass = 'effects__preview--marvin';
      break;
    case 'effect-heat':
      currentMin = 1;
      currentMax = 3;
      currentStep = 0.1;
      currentStart = 3;
      effectClass = 'effects__preview--heat';
      break;
  }
  slider.noUiSlider.updateOptions({
    range: {
      min: currentMin,
      max: currentMax
    },
    start: currentStart,
    step: currentStep
  });
  if (evt.target.id !== 'effect-none') {
    fieldSlider.classList.remove('hidden');
  } else {
    fieldSlider.classList.add('hidden');
  }
  editedPicture.className = effectClass;
}

// Effect intensity
const effectIntens = () => {
  const sliderValue = slider.noUiSlider.get();
  effectLevelInput.value = sliderValue;
  let filter;
  switch (checkedBox) {
    case 'effect-chrome':
      filter = `grayscale(${sliderValue})`;
      break;
    case 'effect-sepia':
      filter = `sepia(${sliderValue})`;
      break;
    case 'effect-marvin':
      filter = `invert(${sliderValue}%)`;
      break;
    case 'effect-phobos':
      filter = `blur(${sliderValue}px)`;
      break;
    case 'effect-heat':
      filter = `brightness(${sliderValue})`;
      break;
  }
  if (checkedBox === 'effect-none') {
    editedPicture.style.filter = '';
  } else {
    editedPicture.style.filter = filter;
  }
};

inputImage.addEventListener('change', (evt) => {
  evt.preventDefault();

  setValues();

  document.addEventListener('keydown', onOverlayEscKeydown);

  closeButton.addEventListener('click', closeOverlayImage);

  buttonScaleSmaller.addEventListener('click', changeScale);
  buttonScaleBigger.addEventListener('click', changeScale);

  editedPicture.classList.add('effects__preview--none');
  effects.addEventListener('change', effectPicture);

  noUiSlider.create(slider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100
  });
  slider.noUiSlider.on('update', () => {
    effectIntens();
  });

  form.addEventListener('submit', submitListener);
  document.body.classList.add('modal-open');
  overlayImage.classList.remove('hidden');
});


//// Validation of hashtags and comment

let boolHashtagGlobal = true;
let boolCommentGlobal = true;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper-valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text__error'
}, true);

const controlSubmit = () => {
  if (!boolHashtagGlobal || !boolCommentGlobal) {
    submitButton.setAttribute('disabled', 'true');
  } else {
    submitButton.removeAttribute('disabled', 'true');
  }
};

const regHashtag = /(^\s*$)|(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)/;

const isCorrectHashtag = (value) => regHashtag.test(value);

const validateHashtag = (value) => {
  const hashtags = value.split(' ');
  const copyHashtags = new Set();
  for (const hashtag of hashtags) {
    copyHashtags.add(hashtag.toLowerCase());
  }
  if (copyHashtags.size < hashtags.length || hashtags.length > 5) {
    boolHashtagGlobal = false;
    controlSubmit();
    return false;
  }
  const bool = hashtags.every(isCorrectHashtag);
  boolHashtagGlobal = bool;
  controlSubmit();
  return bool;
};

const isCorrectComment = (value) => value.length < 140;

const validateComment = (value) => {
  const bool = isCorrectComment(value);
  boolCommentGlobal = bool;
  controlSubmit();
  return bool;
};

pristine.addValidator(
  hashtagInput,
  validateHashtag,
  'Хэштег задан неправильно'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Комментарий не должен превышать 140 символов'
);

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Опубликовываю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const closeMessages = () => {
  document.removeEventListener('keydown', escMessage);
  if (windowBody.contains(successfulSubmission)) {
    windowBody.removeChild(successfulSubmission);
    document.removeEventListener('click', closeSuccessMessage);
    successButton.removeEventListener('click', closeMessages);
  }
  if (windowBody.contains(erroneousSubmission)) {
    errorButton.removeEventListener('click', closeMessages);
    document.removeEventListener('click', closeErrorMessage);
    overlayImage.classList.remove('hidden');
    windowBody.removeChild(erroneousSubmission);
  }
};

function closeSuccessMessage(evt) {
  if (evt.target === successfulSubmission) {
    closeMessages();
  }
}

function closeErrorMessage(evt) {
  if (evt.target === erroneousSubmission) {
    closeMessages();
  }
}

function escMessage(evt) {
  if (isEscapeKey(evt)) {
    closeMessages();
  }
}

function submitListener(evt) {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    blockSubmitButton();
    sendData(
      () => {
        closeOverlayImage();
        unblockSubmitButton();
        successButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', escMessage);
        document.addEventListener('click', closeSuccessMessage);
        windowBody.appendChild(successfulSubmission);
      },
      () => {
        overlayImage.classList.add('hidden');
        unblockSubmitButton();
        errorButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', escMessage);
        document.addEventListener('click', closeErrorMessage);
        windowBody.appendChild(erroneousSubmission);
      },
      new FormData(evt.target),
    );
  }
}

export { closeOverlayImage };
