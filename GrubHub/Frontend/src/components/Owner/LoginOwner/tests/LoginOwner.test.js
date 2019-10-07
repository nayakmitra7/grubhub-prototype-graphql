// Link.react.test.js
import React from 'react';
import Login from '../LoginOwner';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { mount, shallow, render } from 'enzyme';
it('render correctly Login component', () => {  
  const LoginInputComponent = renderer.create(<Login />).toJSON();
  expect(LoginInputComponent).toMatchSnapshot();
})

// it('render correctly signup component', () => {  
//   const LoginInputComponent = renderer.create(<signup />).toJSON();
//   expect(LoginInputComponent).toMatchSnapshot();
// });

/*it('render correctly UpdateDetails component', () => {  
  const LoginInputComponent = renderer.create(<updateDetails />).toJSON();
  expect(LoginInputComponent).toMatchSnapshot();
});*/
