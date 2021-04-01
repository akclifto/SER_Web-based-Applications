/**
 * Class to hold a fake database for username and password lookup on login.
 */
class FakeDatabase {
  constructor() {
    this.db = [
      {
        username: "admin",
        password: "admin",
      },
    ];
  }
}

module.exports = FakeDatabase;
