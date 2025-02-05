# Bookface Cloud Functions

## Running the Cloud Functions Locally

### Prerequisites

- Node.js (v22)
- npm installed
- Firebase CLI installed

### Setup Cloud Functions

1. Clone the repository:
   ```sh
   git clone https://github.com/KCAU-Tech/bookface.git
   cd bookface/functions
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Firebase emulator:
   ```sh
   firebase emulators:start
   ```

## Contributing

- Fetch the latest updates.
  ```sh
  git fetch
  ```
- Create a feature branch out of the `dev` branch.
  ```sh
  git checkout -b feature-branch-name dev
  ```
- Make changes to the code.

- Add the changes to the staging area.
  ```sh
  git add .
  ```
- Commit changes.
  ```sh
  git commit -m "Short descriptive commit message"
  ```
- Push the changes to the feature branch.
  ```sh
  git push origin feature-branch-name
  ```
- Submit a pull request.
  Go to [the pull requests page](https://github.com/KCAU-Tech/bookface-backend/pulls) and create a pull request for your code with at least one reviewer.

Once your code is approved and merged to the `dev` branch, your changes will be live on [the Bookface URL](https://bookface-eight.vercel.app/) or should be accessible via the live api [endpoint](https://us-central1-bookface-backend.cloudfunctions.net/helloWorld).

Happy Coding ✨
