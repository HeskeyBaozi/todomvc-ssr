<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component({
        name: 'app'
    })
    export default class App extends Vue {

    }
</script>

<style>
    body {
        background: url('./assets/background.jpg') 0 / cover fixed;
    }
</style>
