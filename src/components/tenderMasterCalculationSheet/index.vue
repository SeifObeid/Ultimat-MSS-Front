<template>
    <div>
        <div> {{test}}</div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                test:'test',
            }
        },
        mounted(){
          this.test();
        },
        methods:{
            test(){
                console.log(this.test);
            }
        },
    }
</script>

<style scoped></style>