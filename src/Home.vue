<script setup lang="ts">

const emit = defineEmits(['modeChange'])

async function executeModePressed() {
  console.log("execute mode");
  emit('modeChange', 'execute')
}

async function manualModePressed() {
  console.log("manual mode");
  emit('modeChange', 'manual')
}

</script>

<template>
  <main class="container">
    <div class="row">
      <img src="/mitusa-logo.png" class="logo mitusa" alt="Mitusa logo" />
    </div>
    <div>
      <h2>Select operating mode</h2>
    </div>

    <div class="mode-button-div">
      <button @click="executeModePressed" class="button big-text y-padding-big w-25p">
        Execute Mode
      </button>
      <button @click="manualModePressed" class="button big-text y-padding-big w-25p">
        Manual Mode
      </button>
    </div>
  </main>
</template>

<style scoped>
.logo.mitusa:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.mitusa:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

.shrink{
  width: fit-content;
  margin: auto;
}

.card{
  border: 5px ridge #e8e8e8;
  border-radius: 10px;
}
.mode-button-div{
  margin-top: auto;
  padding: 5px;
}
.y-padding-big{
  padding: 50px 10px;
}

.w-25p{
  width: 25vw;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.big-text{
  font-size: larger;
}

.row {
  display: flex;
  justify-content: center;
}

</style>