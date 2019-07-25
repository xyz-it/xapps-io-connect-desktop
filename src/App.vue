<template>
  <v-app>
    <v-app-bar
            app
            clipped-right
            color="blue-grey"
            dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Toolbar</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
            v-model="drawer"
            app
    >
      <v-list dense>
        <v-list-item-group v-model="item" color="primary">
        <v-list-item @click.stop="goto('/plants'); ">
          <v-list-item-icon>
            <v-icon>mdi-home-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Plants settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.stop="goto('/home'); ">
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Plants settings 2</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
          </v-list-item-group>
      </v-list>
    </v-navigation-drawer>



    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer
            app
            color="blue-grey"
            class="white--text"
    >

    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: false,
  }),
  methods: {
    goto(path) {
      this.$router.push(path);
    }
  }
}

  </script>