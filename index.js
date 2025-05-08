/**
 * @module PhoneLibrary
 */

function createPhoneLibrary() {
  class PhoneModal {
    constructor() {
      this._saveState = 'pending'
      this._host = null
      this._shadowRoot = null
      this._modal = null
      this._phoneInput = null
      this._callbacks = []
    }

    get saveState() {
      return this._saveState
    }

    _createModal() {
      this._host = document.createElement('div')
      this._host.id = 'setPhoneModalHost'
      this._shadowRoot = this._host.attachShadow({ mode: 'open' })

      this._modal = document.createElement('dialog')
      this._modal.id = 'setPhoneModal'

      const styles = document.createElement('style')
      styles.textContent = `
        dialog {
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #ccc;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          box-sizing: border-box;
        }
        button {
          padding: 8px 16px;
          cursor: pointer;
        }
        .buttons {
          display: flex;
          gap: 10px;
        }
      `

      const title = document.createElement('h2')
      title.textContent = 'Set Phone Number'

      this._phoneInput = document.createElement('input')
      this._phoneInput.type = 'tel'
      this._phoneInput.id = 'phoneNumber'
      this._phoneInput.placeholder = '123-456-7890'
      this._phoneInput.pattern = '[0-9]{3}-[0-9]{3}-[0-9]{4}'

      const saveButton = document.createElement('button')
      saveButton.textContent = 'Save'
      saveButton.addEventListener('click', this._savePhone.bind(this))

      const cancelButton = document.createElement('button')
      cancelButton.textContent = 'Cancel'
      cancelButton.addEventListener('click', this._cancel.bind(this))
    
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'buttons'
      buttonContainer.appendChild(saveButton)
      buttonContainer.appendChild(cancelButton)

      this._modal.appendChild(title)
      this._modal.appendChild(this._phoneInput)
      this._modal.appendChild(buttonContainer)
        
      this._shadowRoot.appendChild(styles)
      this._shadowRoot.appendChild(this._modal)
      document.body.appendChild(this._host)

      this._modal.addEventListener('cancel', (e) => {
        e.preventDefault()
        this._cancel()
      })
    }

    _savePhone() {
      try {
        const phoneNumber = this._phoneInput.value

        if (!phoneNumber.match(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)) {
          throw new Error('Invalid phone format. Please use format: 123-456-7890')
        }

        localStorage.setItem('phoneNumber', phoneNumber)
        this._saveState = 'saved'

        this._clearModal()

        const container = document.createElement('div')
        const message = document.createElement('p')
        message.textContent = 'Phone number saved successfully!'
        container.appendChild(message)
        this._modal.appendChild(container)

        setTimeout(() => {
            this._close()
        }, 1500)
      } catch (error) {
        this._saveState = 'error'
        this._clearModal()

        const container = document.createElement('div')
        const errorMessage = document.createElement('p')
        errorMessage.textContent = `Error: ${error.message}`

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close'
        clloseButton.addEventListener('click', this._close.bind(this))
        
        container.appendChild(errorMessage)
        container.appendChild(closeButton)
        this._modal.appendChild(container)
      }

      this._notifyCallbacks()
    }

    _clearModal() {
      while (this._modal.firstChild) {
        this._modal.removeChild(this._modal.firstChild)
      }
    }

    _cancel(){
        this._saveState = 'cancelled'
        this._close()
    }

    _close() {
      if (this._modal) {
        this._modal.close()

        if (this._host && this._host.parentNode) {
          this._host.parentNode.removeChild(this._host)
        }

        this._notifyCallbacks()

        this._host = null
        this._shadowRoot = null
        this._modal = null
        this._phoneInput = null
      }
    }

  _notifyCallbacks() {
    this._callbacks.forEach(callback => {
        try {
            callback(this._saveState)
        } catch (error) {
            console.error('Error in callback:', error)
        }
    })

    this._callbacks = []
  }

  setPhone(callback){
    this._saveState = 'pending'

    if(typeof callback === 'function'){
        this._callbacks.push(callback)
    }

    return new Promise((resolve) => {
        this._callbacks.push(resolve)

        this._createModal();
        this._modal.showModal();
    })
  }
}

const phoneModal = new PhoneModal()
return {
    setPhone: function(callback){
        return phoneModal.setPhone(callback)
    },

    get saveState(){
        return phoneModal.saveState
    }
}
}

const PhoneLibrary = createPhoneLibrary()
export const setPhone = PhoneLibrary.setPhone
export const saveState = PhoneLibrary.saveState
