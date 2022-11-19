<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from './Card/index.vue'
import Sale from './Sale/index.vue'
import Observe from './Observe/index.vue'
export default {
 components:{
  Card,
  Sale,
  Observe
 },
 mounted(){
  this.$store.dispatch('getData');
 }
}
</script>

<style scoped>

</style>
