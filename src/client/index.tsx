import React from 'react';
import { hydrate } from 'react-dom';
import AppHistory from '../components/AppHistory';

hydrate(<AppHistory {...window['__PROPS__']} />, document.querySelector('#app'));
