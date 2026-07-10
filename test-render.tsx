import React from 'react';
import { renderToString } from 'react-dom/server';
import LifeExpectancyGraphModal from './src/components/LifeExpectancyGraphModal.tsx';

const props = {
  isOpen: true,
  onClose: () => {},
  inputs: {
    name: 'Test',
    gender: 'man',
    birthYear: 1978,
    currentAge: 48,
    // other fields don't matter for this modal
  } as any,
  cbsBaseLife: 80,
  projectedLifeExpectancy: 82.6,
};

try {
  const html = renderToString(<LifeExpectancyGraphModal {...props} />);
  console.log("RENDER SUCCESS!");
  console.log(html);
} catch (err) {
  console.error("RENDER FAILED:", err);
}
