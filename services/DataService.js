// DataService.js
class DataService {
  sharedData = 'Initial Data';

  subscribers = [];

  setSharedData(data) {
    this.sharedData = data;
    this.notify();
  }

  getSharedData() {
    return this.sharedData;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }

  notify() {
    this.subscribers.forEach((cb) => cb(this.sharedData));
  }
}

const instance = new DataService();
export default instance;
