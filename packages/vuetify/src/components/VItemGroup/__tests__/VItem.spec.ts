// Components
import { VItem } from '../'

// Utilities
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'

describe('VItem', () => {
  it('should throw error if injection could not be found', async () => {
    await expect(() => {
      mount(VItem, {
        slots: {
          default: () => h('div', ['foo']),
        },
        global: {
          provide: {
            [Symbol.for('vuetify')]: {
              defaults: { global: {} },
            },
          },
        },
      })
    }).toThrow('[Vuetify] Could not find useGroup injection for symbol v-item-group')

    expect('[Vue warn]: Unhandled error during execution of setup function').toHaveBeenTipped()
  })

  it('should print error if no default slot found', () => {
    mount(VItem, {
      global: {
        provide: {
          [Symbol.for('vuetify')]: {
            defaults: { global: {} },
          },
          [Symbol.for('v-item-group')]: {
            register: jest.fn(),
            unregister: jest.fn(),
          },
          [Symbol.for('v-item-group-active-class')]: ref(undefined),
        },
      },
    })

    expect('v-item is missing a default slot').toHaveBeenWarned()
  })
})
