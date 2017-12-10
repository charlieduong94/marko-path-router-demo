const homeComponent = require('~/src/components/home')
const beerComponent = require('~/src/components/beer')
const chartsComponent = require('~/src/components/charts')
const nestedChartComponent = require('~/src/components/nested-chart')
const deepNestedChartComponent = require('~/src/components/deep-nested-chart')
const usersComponent = require('~/src/components/users')
const userDetailsComponent = require('~/src/components/user-details')
const notFoundComponent  = require('~/src/components/not-found')
const { Router } = require('marko-path-router')

module.exports = {
  onCreate: function () {
    this.state = {
      currentRoute: window.location.pathname
    }
  },

  onMount: function () {
    const self = this
    const state = self.state

    const routes = [
      { path: '/', component: homeComponent },
      { path: '/beer', component: beerComponent },
      { path: '/deep-nested-chart', component: deepNestedChartComponent },
      {
        path: '/charts',
        component: chartsComponent,
        nestedRoutes: [
          {
            path: '/nested-chart',
            component: nestedChartComponent,
            nestedRoutes: [
              { path: '/deep-nested-chart', component: deepNestedChartComponent }
            ]
          }
        ]
      },
      {
        path: '/users',
        component: usersComponent,
        nestedRoutes: [
          {
            path: '/:userId',
            component: userDetailsComponent
          }
        ]
      },
      { path: '/**', component: notFoundComponent }
    ]

    const render = Router.renderSync({
      routes: routes,
      initialRoute: state.currentRoute
    })

    const router = this.router = render
      .appendTo(this.getEl('router-container'))
      .getComponent()

    router.beforeEach((from, to, next) => {
      console.log(`BeforeEach hook. Transitioning from ${from} to ${to}`)
      next()
    })

    router.afterEach((from, to) => {
      console.log(`AfterEach hook. Transitioning from ${from} to ${to}`)
    })

    state.currentRoute = router.currentRoute

    router.on('update', () => {
      state.currentRoute = router.currentRoute
    })
  },

  onInput: function (input) {
    let state = this.state
    state.currentRoute = input.currentRoute || state.currentRoute
    state.activeItem = input.activeItem || state.activeItem
  },

  toggleSidebar: function () {
    var sidebar = this.getComponent('sidebar')
    sidebar.toggle();
  },

  handleItemClick: function (event, el) {
    this.state.activeItem = el.getAttribute('data-key')
    this.update()
  }
}
