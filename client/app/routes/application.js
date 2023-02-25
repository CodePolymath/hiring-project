import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    this._super(...arguments);
    let link1 = document.createElement('link');
    let link2 = document.createElement('link');
    link1.href = 'https://fonts.gstatic.com';
    link1.rel = 'preconnect';
    link2.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    link2.rel = 'stylesheet';
    document.head.appendChild(link1);
    document.head.appendChild(link2);
  }
});