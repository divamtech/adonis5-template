import View from '@ioc:Adonis/Core/View'
import moment from 'moment'
import ChangeCase from 'App/Utils/ChangeCase'

View.global('nl2br', function (text) {
  return text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2')
})

View.global('iff', function (val, defaults = '') {
  return ['null', null, 'undefined', undefined, ''].includes(val) ? defaults : val;
});

View.global('capitalize', function (val) {
  if (typeof val !== 'string') return '';
  return val.charAt(0).toUpperCase() + val.slice(1);
});

View.global('phoneValidation', function () {
  return 'type="tel" minlength="10" maxlength="10"';
});

View.global('emailValidation', function () {
  return 'type="email"';
});

View.global('utcDate', function (val) {
  return new Date(val).toISOString();
});

View.global('serverDate', function (val) {
  return moment(new Date(val)).format('ddd DD/MM/YY hh:mm A');
});

View.global('changeCase', function (val, type = 'titleCase') {
  switch (type) {
    case 'titleCase':
      return val.split('_').map(ChangeCase.toTitle).join(' ')
    default:
      return val;
  }
});

View.global('setPriorityColor', function (val, types = [
  { value: 'darkred', key: 'URGENT' },
  { value: 'tomato', key: 'HIGH' },
  { value: 'orange', key: 'MEDIUM' },
  { value: 'gold', key: 'LOW' },
]) {
  const found = types.find(v => v.key == val)
  return found ? found.value : ''
});

View.global('setStatusColor', function (val, types = [
  { value: 'darkred', key: 'OPEN' },
  { value: 'tomato', key: 'UNDER_REVIEW' },
  { value: 'orange', key: 'IN_PROGRESS' },
  { value: 'gold', key: 'CLOSED' },
  { value: 'green', key: 'FIXED' },
]) {
  const found = types.find(v => v.key == val)
  return found ? found.value : ''
});
