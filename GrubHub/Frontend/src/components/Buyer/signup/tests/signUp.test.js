import React from 'react';
import Signup from '../signup';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('render correctly Login component', () => {  
  const LoginInputComponent = renderer.create(<Signup />).toJSON();
  expect(LoginInputComponent).toMatchSnapshot();
})


