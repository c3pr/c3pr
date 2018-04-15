<template>
  <div class="home">
    <h1>This is the C-3PR dashboard.</h1>

    <ul>
      <li>Travis status: <a href="https://travis-ci.org/c3pr/">https://travis-ci.org/c3pr/</a></li>
      <li>c3pr (this one): <a href="https://c3pr.herokuapp.com">https://c3pr.herokuapp.com</a></li>
      <li>c3pr-brain: <a href="https://c3pr-brain.herokuapp.com">https://c3pr-brain.herokuapp.com</a></li>
      <li>c3pr-repo-github: <a href="https://c3pr-github.herokuapp.com">https://c3pr-github.herokuapp.com</a></li>
      <li>c3pr-tool-walkmod-sonar: <a href="https://c3pr-tool-walkmod-sonar.now.sh">https://c3pr-tool-walkmod-sonar.now.sh</a></li>
    </ul>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'dashboard',
  components: {
    HelloWorld,
  },
};
</script>
