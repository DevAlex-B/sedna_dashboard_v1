import React from 'react';
import ReactDOMServer from 'react-dom/server';
import VisitorCollectForm from '../VisitorCollectForm';

test('consent gate blocks send', () => {
  const htmlNo = ReactDOMServer.renderToString(
    <VisitorCollectForm name="" email="" consent={false} setName={()=>{}} setEmail={()=>{}} setConsent={()=>{}} onSubmit={()=>{}} />
  );
  expect(htmlNo).toMatch(/disabled=""/);
  const htmlYes = ReactDOMServer.renderToString(
    <VisitorCollectForm name="" email="" consent={true} setName={()=>{}} setEmail={()=>{}} setConsent={()=>{}} onSubmit={()=>{}} />
  );
  expect(htmlYes).not.toMatch(/disabled=""/);
});
