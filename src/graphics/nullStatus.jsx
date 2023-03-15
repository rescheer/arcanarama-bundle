import * as React from 'react';

export default function Status() {
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);
  const char = urlParams.get('char');
}
