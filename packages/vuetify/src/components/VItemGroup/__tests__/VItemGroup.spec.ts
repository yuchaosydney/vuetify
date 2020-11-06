// Components
import { VItemGroup, VItem } from '../'

// Utilities
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import * as framework from '@/framework'

const Mock = defineComponent({
  name: 'Test',
  props: {
    disabled: Boolean,
  },
  setup (props) {
    return () => h(VItem, { disabled: props.disabled }, {
      default: (props: any) => {
        return h('div', { class: ['item', props.activeClass], onClick: props.toggle }, ['foo'])
      },
    })
  },
})

describe('VItemGroup', () => {
  it('should warn if using multiple prop without an array value', () => {
    jest.spyOn(framework, 'useVuetify').mockImplementation(() => ({
      defaults: {
        global: {},
      },
    }))

    mount(VItemGroup, {
      props: {
        multiple: true,
        value: '',
      },
    })

    expect('v-item-group modelValue must be an array when using multiple prop').toHaveBeenTipped()
  })

  it('should use provided active class', async () => {
    jest.spyOn(framework, 'useVuetify').mockImplementation(() => ({
      defaults: {
        global: {},
      },
    }))

    const wrapper = mount(VItemGroup, {
      slots: {
        default: () => [h(Mock), h(Mock)],
      },
    })

    await wrapper.find('.item').trigger('click')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should select the first item if mandatory and no value', async () => {
    jest.spyOn(framework, 'useVuetify').mockImplementation(() => ({
      defaults: {
        global: {},
      },
    }))

    const wrapper = mount(VItemGroup, {
      props: { mandatory: true },
      slots: {
        default: () => h(Mock),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/5384
  // Not sure how to do this in 3.0, there does not seem to be
  // isDestroyed on vm? At least not typed through getCurrentInstance
  it.skip('should not unregister children when is destroyed', async () => {
    const Test = defineComponent({
      name: 'Test',
      props: { show: Boolean },
      setup (props) {
        return () => props.show ? h(VItemGroup, {
          modelValue: 0,
        }, () => h(Mock)) : h('div', ['something else'])
      },
    })
    const wrapper = mount(Test, {
      props: {
        show: true,
      },
    })

    const itemGroup = wrapper.findComponent(VItemGroup)

    await wrapper.setProps({ show: false })

    expect(itemGroup.emitted('update:modelValue')).toHaveLength(0)
  })

  // https://github.com/vuetifyjs/vuetify/issues/5000
  it('should update mandatory to first non-disabled item', async () => {
    jest.spyOn(framework, 'useVuetify').mockImplementation(() => ({
      defaults: {
        global: {},
      },
    }))

    const wrapper = mount(VItemGroup, {
      propsData: {
        mandatory: true,
      },
      slots: {
        default: () => [
          h(Mock, { disabled: true }),
          h(Mock),
        ],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
