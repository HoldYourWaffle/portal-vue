import Vue from 'vue'
import { VNode, PropOptions } from 'vue'
import { combinePassengers } from '@/utils'
import { Transport, PropWithComponent, Transports } from '@/types'

import { wormhole } from '@/components/wormhole'

export default Vue.extend({
  name: 'portalTarget',
  props: {
    multiple: { type: Boolean, default: false },
    name: { type: String, required: true },
    slim: { type: Boolean, default: false },
    slotProps: { type: Object, default: () => ({}) },
    tag: { type: String, default: 'div' },
    transition: { type: [String, Object, Function] } as PropOptions<
      PropWithComponent
    >,
    suspended: { type: Boolean, default: false },
  },
  data() {
    return {
      firstRender: true,

      test: { a: true, b: { c: 0 } },

      // Configurable source to allow mocking in tests
      transportsSource: wormhole.transports,

      // Transports are copied in here only when not suspended, reactivity is based on this field
      transportsBuffer: {} as Transports,
    }
  },
  created() {
    // Initial transport loading, can't do in data() because transportsSource can be overriden
    this.loadTransports()

    this.$nextTick(() => {
      wormhole.registerTarget(this.name, this)
    })
  },
  watch: {
    ownTransports() {
      // TODO can I not emit on the 'initialization' call to avoid the async issues in tests?
      this.$emit('change', this.children().length > 0)
    },
    name(newVal, oldVal) {
      /**
       * TODO
       * This should warn as well ...
       */
      wormhole.unregisterTarget(oldVal)
      wormhole.registerTarget(newVal, this)
    },
    transportsSource() {
      console.log('aaa')
      //FIXME this is called only once????

      if (!this.suspended) {
        // We're not suspended, load the changed source
        this.loadTransports()
      }
      // Otherwise transportsBuffer stays intact, therefore no re-render
    },
  },
  mounted() {
    if (this.transition) {
      this.$nextTick(() => {
        // only when we have a transition, because it causes a re-render
        this.firstRender = false
      })
    }
  },
  beforeDestroy() {
    wormhole.unregisterTarget(this.name)
  },

  computed: {
    ownTransports(): Transport[] {
      const transports: Transport[] = this.transportsBuffer[this.name] || []
      if (this.multiple) {
        return transports
      }
      return transports.length === 0 ? [] : [transports[transports.length - 1]]
    },
    passengers(): VNode[] {
      return combinePassengers(this.ownTransports, this.slotProps)
    },
  },

  methods: {
    // can't be a computed prop because loading is done deliberately, sometimes the old state stays
    loadTransports(): void {
      console.log('reloading buffer')
      /*
        TODO this needs to be a half-deep copy:
          For every key in the source...
          Copy the array value...
          ...into the buffer...
          ...at that key
       */

      console.log(Object.keys(this.transportsSource))
      console.log(this.transportsSource)

      /*console.log(Object.keys(wormhole.transports))
      console.log(wormhole.transports)

      console.log(Object.keys(this.test))
      console.log(this.test)*/

      for (let k in this.transportsSource) {
        console.log(k)
      }

      console.log(Object.getOwnPropertyDescriptors(this.transportsSource))

      this.transportsBuffer = this.transportsSource
    },
    // can't be a computed prop because it has to "react" to $slot changes.
    children(): VNode[] {
      return this.passengers.length !== 0
        ? this.passengers
        : this.$scopedSlots.default
        ? (this.$scopedSlots.default(this.slotProps) as VNode[])
        : this.$slots.default || []
    },
    // can't be a computed prop because it has to "react" to this.children().
    noWrapper(): boolean {
      const noWrapper = this.slim && !this.transition
      if (noWrapper && this.children().length > 1) {
        console.warn(
          '[portal-vue]: PortalTarget with `slim` option received more than one child element.'
        )
      }
      return noWrapper
    },
  },
  render(h): VNode {
    const noWrapper = this.noWrapper()
    const children = this.children()
    const Tag = this.transition || this.tag

    return noWrapper
      ? children[0]
      : this.slim && !Tag
      ? h()
      : h(
          Tag,
          {
            props: {
              // if we have a transition component, pass the tag if it exists
              tag: this.transition && this.tag ? this.tag : undefined,
            },
            class: { 'vue-portal-target': true },
          },

          children
        )
  },
})
