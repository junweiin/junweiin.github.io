/**
 * Code Block Enhancements — Copy buttons, language labels
 */
(function () {
  // Fallback copy function for browsers without clipboard API
  function fallbackCopyText(text, btn) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(function () {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  }

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function () {
    enhanceCodeBlocks();
  });

  function enhanceCodeBlocks() {
    const blocks = document.querySelectorAll('.highlight, figure.highlight');

    blocks.forEach(function (block) {
      // Detect language
      var lang = '';
      var classes = block.className.split(' ');
      for (var i = 0; i < classes.length; i++) {
        if (classes[i] !== 'highlight' && classes[i] !== '') {
          lang = classes[i].replace('language-', '');
          break;
        }
      }

      // If Hexo wraps in figure, check inner table
      if (!lang) {
        var inner = block.querySelector('[class*="language-"]');
        if (inner) {
          var innerClasses = inner.className.split(' ');
          for (var j = 0; j < innerClasses.length; j++) {
            if (innerClasses[j].startsWith('language-')) {
              lang = innerClasses[j].replace('language-', '');
              break;
            }
          }
        }
      }

      // Skip if header already exists
      if (block.querySelector('.highlight-header')) return;

      // Create header
      var header = document.createElement('div');
      header.className = 'highlight-header';

      var left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '10px';

      // Mac dots
      var dots = document.createElement('div');
      dots.className = 'highlight-dots';
      dots.innerHTML = '<span></span><span></span><span></span>';
      left.appendChild(dots);

      // Language label
      if (lang) {
        var langLabel = document.createElement('span');
        langLabel.className = 'highlight-lang';
        langLabel.textContent = lang;
        left.appendChild(langLabel);
      }

      header.appendChild(left);

      // Copy button
      var copyBtn = document.createElement('button');
      copyBtn.className = 'highlight-copy';
      copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';

      copyBtn.addEventListener('click', function () {
        var text = '';
        
        // Try to get code from .code td first (Hexo's table layout with line numbers)
        var codeCell = block.querySelector('.code pre');
        if (codeCell) {
          text = codeCell.textContent;
        } else {
          // Fallback to simple pre selector
          var code = block.querySelector('pre');
          text = code ? code.textContent : '';
        }

        if (!text) {
          return;
        }

        // Try modern clipboard API first, fallback to execCommand
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
            setTimeout(function () {
              copyBtn.classList.remove('copied');
              copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
            }, 2000);
          }).catch(function (err) {
            console.error('Failed to copy text: ', err);
            fallbackCopyText(text, copyBtn);
          });
        } else {
          fallbackCopyText(text, copyBtn);
        }
      });

      header.appendChild(copyBtn);

      // Insert header at top of block
      block.insertBefore(header, block.firstChild);
    });
  }
})();
