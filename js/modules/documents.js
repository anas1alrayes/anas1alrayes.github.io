// modules/documents.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

let documentsContainer = null;

/**
 * Initializes the Documents module.
 */
export async function init() {
  console.log('[Documents Module] Initializing documents grid...');
  documentsContainer = $('#documents');

  if (!documentsContainer) {
    console.warn('[Documents Module] Target container "#documents" not found.');
    return;
  }

  documentsContainer.className = 'documents-section';

  subscribe('translations', renderDocuments);
  renderDocuments();
}

/**
 * Renders downloadable documents and the QR shortcut as peer cards in a
 * single uniform grid.
 */
function renderDocuments() {
  if (!documentsContainer) return;
  documentsContainer.innerHTML = '';

  const activeLang = state.lang;
  const docsData = state.documents;

  if (!docsData) {
    console.warn('[Documents Module] No documents data found.');
    return;
  }

  const eyebrowText = t('documents.eyebrow');
  const titleText = t('section.documents.title');

  const sectionHeader = createElement('div', { className: 'section-header', 'data-reveal': '' }, [
    createElement('span', { className: 'eyebrow' }, eyebrowText),
    createElement('h2', { className: 'documents-title', id: 'documents-title' }, titleText)
  ]);

  const pagesLabelText = t('document.label.pages');
  const downloadLabel = t('document.btn.download');

  const docCards = docsData.map(doc => {
    const downloadBtn = createElement('a', {
      href: doc.file,
      className: 'btn-icon doc-card-download',
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': `${downloadLabel}: ${doc.label[activeLang]}`,
      title: downloadLabel
    }, [icon('download', 'icon icon-sm')]);

    return createElement('div', {
      className: 'doc-card surface-card surface-card--interactive',
      'data-reveal': ''
    }, [
      createElement('div', { className: 'doc-card-icon' }, [icon('file', 'icon icon-lg')]),
      createElement('div', { className: 'doc-card-info' }, [
        createElement('h3', { className: 'doc-label' }, doc.label[activeLang])
      ]),
      downloadBtn
    ]);
  });

  const qrImage = createElement('img', {
    src: 'assets/qr/qr-code.svg',
    alt: 'Portfolio QR code',
    className: 'qr-image'
  });
  qrImage.addEventListener('error', () => {
    qrImage.src = 'assets/qr/qr-code.png';
  });

  const qrTextContent = t('documents.qr_text');
  const qrCard = createElement('div', {
    className: 'doc-card doc-card--qr surface-card',
    'data-reveal': ''
  }, [
    createElement('div', { className: 'qr-image-frame' }, [qrImage]),
    createElement('span', { className: 'qr-text' }, qrTextContent)
  ]);

  const gridContainer = createElement('div', { className: 'documents-grid' }, [...docCards, qrCard]);

  documentsContainer.appendChild(sectionHeader);
  documentsContainer.appendChild(gridContainer);
}

export default { init };
