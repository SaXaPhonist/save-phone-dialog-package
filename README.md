# save-phone-dialog

Framework agnostic library for saving phone number to local storage

## Install

```bash
npm install phone-set-modal-test
# or
yarn add phone-set-modal-test
```

## Usage

```javascript
import { setPhone, saveState } from 'phone-set-modal-test';

// Opening modal
document.getElementById('openModalButton').addEventListener('click', async () => {
  await setPhone();
});


## License

MIT