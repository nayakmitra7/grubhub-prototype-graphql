import React from 'react';
import Login from '../Login';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('render correctly Login component', () => {  
  const LoginInputComponent = renderer.create(<Login />).toJSON();
  expect(LoginInputComponent).toMatchSnapshot();
})


