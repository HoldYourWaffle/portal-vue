# PortalVue

> A Portal Component for Vuejs, to render DOM outside of a component, anywhere in the document.

<!-- markdownlint-disable MD033 -->
<p style="tex-align: center">
  <img src="https://portal-vue.linusb.org/logo.png" alt="PortalVue Logo">
</p>

<p>
<a href='https://ko-fi.com/R6R7QW4D' target='_blank'>
  <img height='36' style='border:0px;height:36px;margin-bottom:30px;' src='https://az743702.vo.msecnd.net/cdn/kofi4.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' />
</a>
<p>

For more detailed documentation and additional Information, [please visit the docs](https://portal-vue.linusb.org).

> Looking for version 1.\*? [Docs for version 1 are here](https://v1.portal-vue.linusb.org)

## In this fork...
Upstream pull requests [#340](https://github.com/LinusBorg/portal-vue/pull/340) and [#341](https://github.com/LinusBorg/portal-vue/pull/341) have been merged.

This adds a new `suspension` property to `<portal-target>`, which _suspends_ all teleportation as long as its value is `true`.

## Installation

```bash
npm i @holdyourwaffle/portal-vue

# or

yarn add @holdyourwaffle/portal-vue
```

```javascript
import PortalVue from '@holdyourwaffle/portal-vue'
Vue.use(PortalVue)
```


### Transitive dependencies

If you're using [bootstrap-vue](https://bootstrap-vue.org/) or another library that has `portal-vue` as a transitive dependency, you might prefer installing this fork with a Git dependency instead:

```bash
npm i git://github.com/HoldYourWaffle/portal-vue.git#suspension-built

# or

yarn add git://github.com/HoldYourWaffle/portal-vue.git#suspension-built
```

This keeps the module under the standard `portal-vue` name, allowing NPM to de-dupe the (unforked) transitive dependency.
```javascript
import PortalVue from 'portal-vue'
Vue.use(PortalVue)
```


## Usage

```html
<portal to="destination">
  <p>This slot content will be rendered wherever the <portal-target> with name 'destination'
    is  located.</p>
</portal>

<portal-target name="destination">
  <!--
  This component can be located anywhere in your App.
  The slot content of the above portal component will be rendered here.
  -->
</portal-target>
```

## Nuxt module

Add `@holdyourwaffle/portal-vue/nuxt` to modules section of `nuxt.config.js`

```javascript
{
  modules: ['@holdyourwaffle/portal-vue/nuxt']
}
```

Or when using a Git dependency:

```javascript
{
  modules: ['portal-vue/nuxt']
}
```
