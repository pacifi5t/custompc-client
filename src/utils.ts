const requestUrl = 'http://localhost:9999/api/v1';

class Component {
  label: string;
  onlyOne: boolean;
  data = new Map();
  constructor(label: string, onlyOne: boolean) {
    this.label = label;
    this.onlyOne = onlyOne;
  }
}

export { requestUrl, Component };
